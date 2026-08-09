"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/app/[locale]/components/ui/button";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import ScholarshipCard from "@/app/[locale]/components/ui/scholarship-card";
import { scholarshipsConfig, scholarshipWinnersConfig, isClosed, type ScholarshipConfig } from "@/lib/scholarships-config";
import { getStoredScholarships, saveScholarships, getStoredWinners, saveWinners, type StoredScholarship, type StoredWinner } from "@/lib/scholarship-store";
import { Archive } from "lucide-react";

// Merge stored scholarship data with static config defaults
function mergeWithConfig(stored: StoredScholarship): ScholarshipConfig & { nameOverride: string; eligibilityOverride: string } {
  const base = scholarshipsConfig.find(s => s.id === stored.id);
  return {
    id:                 stored.id,
    nameKey:            base?.nameKey            ?? stored.id,
    eligibilityKey:     base?.eligibilityKey     ?? stored.id,
    courseId:           stored.courseId          || base?.courseId || stored.id,
    applicationsCount:  stored.applicationsCount ?? base?.applicationsCount ?? 0,
    deadline:           stored.deadline          || base?.deadline || "",
    winnersCount:       stored.winnersCount      ?? base?.winnersCount ?? 0,
    fundingType:        stored.fundingType       || base?.fundingType || "full",
    tuitionAmount:      stored.tuitionAmount     ?? base?.tuitionAmount ?? 0,
    applicationFormUrl: stored.applicationFormUrl || base?.applicationFormUrl,
    nameOverride:       stored.name,
    eligibilityOverride: stored.eligibility,
  };
}

export function ScholarshipsSection({ showAll = false }: { showAll?: boolean }) {
  const t = useTranslations("scholarshipsSection");

  // Always initialise from static config so server and client render the same HTML.
  // localStorage is loaded in useEffect (client-only) to avoid hydration mismatches.
  const [scholarships, setScholarships] = useState<ReturnType<typeof mergeWithConfig>[]>(
    () => scholarshipsConfig.map(s => ({ ...s, nameOverride: "", eligibilityOverride: "" }))
  );

  // Winners: seed from static config so the first render matches SSR, then
  // swap in localStorage data (and optionally the API) on the client.
  const [winners, setWinners] = useState<StoredWinner[]>(
    () => scholarshipWinnersConfig.map(w => ({
      id:         w.id,
      name:       w.name,
      image:      w.image,
      scholarship: w.scholarshipKey.replace(/([A-Z])/g, " $1").trim() + " Scholarship",
      year:       w.year,
      status:     "active" as const,
    }))
  );
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

    // Load winners from localStorage first (admin-saved data)
    const localWinners = getStoredWinners();
    if (localWinners.length > 0) {
      setWinners(localWinners);
    }

    // Re-read localStorage first (covers same-browser admin edits)
    const stored = getStoredScholarships();
    if (stored.length > 0) {
      setScholarships(stored.map(mergeWithConfig));
    }

    // Then try the backend — if it has data, it is authoritative
    fetch(`${API}/scholarships`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list: any[] = Array.isArray(d) ? d : d.data ?? [];
        if (list.length === 0) return;
        const mapped: StoredScholarship[] = list.map((s: any) => ({
          id:                 s.id || s._id || "",
          name:               s.name || s.title || "",
          courseId:           s.courseId || s.course?.id || "",
          course:             s.course?.title || s.courseName || s.courseId || "",
          applicationsCount:  s.applicationsCount || 0,
          winnersCount:       s.winnersCount || 0,
          deadline:           s.deadline || s.endDate || "",
          eligibility:        s.eligibility || s.requirements || "",
          status:             (s.status || "active").toLowerCase(),
          fundingType:        s.fundingType || "full",
          tuitionAmount:      s.tuitionAmount || 0,
          applicationFormUrl: s.applicationFormUrl || "",
        }));
        // Persist so the next page load is instant
        saveScholarships(mapped);
        setScholarships(mapped.map(mergeWithConfig));
      })
      .catch(() => {
        // API unavailable — localStorage/static config already applied above
      });

    // Try winners API — if it returns data, it overrides localStorage
    fetch(`${API}/scholarship-winners`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list: any[] = Array.isArray(d) ? d : d.data ?? [];
        if (list.length === 0) return;
        const mapped: StoredWinner[] = list.map((w: any) => ({
          id:         w.id || w._id || "",
          name:       w.name || w.studentName || "",
          image:      w.image || w.photo || "",
          scholarship: w.scholarship || w.scholarshipName || "",
          year:       w.year || new Date(w.awardedAt || Date.now()).getFullYear(),
          status:     ((w.status || "active").toLowerCase()) as "active" | "inactive",
        }));
        saveWinners(mapped);
        setWinners(mapped);
      })
      .catch(() => {
        // API unavailable — localStorage data already applied above
      });
  }, []);

  const active  = scholarships.filter(s => !isClosed(s.deadline));
  const archived = scholarships.filter(s => isClosed(s.deadline));
  const visible  = showAll ? active : active.slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        {/* Active cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 ${showAll ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-6 mb-8 items-stretch`}>
          {visible.map((scholarship, i) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <ScholarshipCard
                id={scholarship.id}
                name={scholarship.nameOverride || t(`scholarships.${scholarship.nameKey}.name`)}
                applicationsCount={scholarship.applicationsCount}
                deadline={scholarship.deadline}
                winnersCount={scholarship.winnersCount}
                eligibility={scholarship.eligibilityOverride || t(`scholarships.${scholarship.eligibilityKey}.eligibility`)}
                courseId={scholarship.courseId}
                fundingType={scholarship.fundingType}
                tuitionAmount={scholarship.tuitionAmount}
                applicationFormUrl={scholarship.applicationFormUrl}
              />
            </motion.div>
          ))}
        </div>

        {/* View All / archived only on full page */}
        {!showAll && (
          <div className="flex justify-center mb-14">
            <Button className="bg-[#2196F3] hover:bg-blue-500 text-white px-8 h-11" asChild>
              <Link href="/scholarships">View All Scholarships</Link>
            </Button>
          </div>
        )}

        {/* Archived section — only on full scholarships page */}
        {showAll && archived.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center gap-2 mb-6">
              <Archive className="h-5 w-5 text-gray-400" />
              <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">Archived Scholarships</h3>
              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500 font-semibold">{archived.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch opacity-70">
              {archived.map((scholarship, i) => (
                <motion.div
                  key={scholarship.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <ScholarshipCard
                    id={scholarship.id}
                    name={scholarship.nameOverride || t(`scholarships.${scholarship.nameKey}.name`)}
                    applicationsCount={scholarship.applicationsCount}
                    deadline={scholarship.deadline}
                    winnersCount={scholarship.winnersCount}
                    eligibility={scholarship.eligibilityOverride || t(`scholarships.${scholarship.eligibilityKey}.eligibility`)}
                    courseId={scholarship.courseId}
                    fundingType={scholarship.fundingType}
                    tuitionAmount={scholarship.tuitionAmount}
                    archived
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Previous winners */}
        <div className="mt-14">
          <h3 className="text-center text-xl font-semibold text-gray-900 dark:text-gray-50 mb-6">
            {t("previousWinners")}
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {winners.filter(w => w.status === "active").map((winner, i) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2196F3] shrink-0">
                  {winner.image ? (
                    <Image
                      src={winner.image}
                      alt={`${winner.name} scholarship winner`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E90FF] to-[#F57C00] flex items-center justify-center text-white text-xl font-bold">
                      {winner.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{winner.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{winner.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/app/[locale]/components/ui/button";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import ScholarshipCard from "@/app/[locale]/components/ui/scholarship-card";
import { scholarshipsConfig, scholarshipWinnersConfig, isClosed } from "@/lib/scholarships-config";
import { Archive } from "lucide-react";

export function ScholarshipsSection({ showAll = false }: { showAll?: boolean }) {
  const t = useTranslations("scholarshipsSection");

  const active   = scholarshipsConfig.filter(s => !isClosed(s.deadline));
  const archived = scholarshipsConfig.filter(s => isClosed(s.deadline));
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
                name={t(`scholarships.${scholarship.nameKey}.name`)}
                applicationsCount={scholarship.applicationsCount}
                deadline={scholarship.deadline}
                winnersCount={scholarship.winnersCount}
                eligibility={t(`scholarships.${scholarship.eligibilityKey}.eligibility`)}
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
                    name={t(`scholarships.${scholarship.nameKey}.name`)}
                    applicationsCount={scholarship.applicationsCount}
                    deadline={scholarship.deadline}
                    winnersCount={scholarship.winnersCount}
                    eligibility={t(`scholarships.${scholarship.eligibilityKey}.eligibility`)}
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
            {scholarshipWinnersConfig.map((winner, i) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2196F3]">
                  <Image src={winner.image} alt={`${winner.name} scholarship winner`} fill className="object-cover" sizes="64px" />
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

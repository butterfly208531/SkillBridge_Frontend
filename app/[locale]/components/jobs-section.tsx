"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import JobCard from "@/app/[locale]/components/ui/job-card";
import { jobsConfig, isJobClosed, type Job } from "@/lib/jobs-config";
import { getStoredJobs, saveJobs, isJobsInitialized } from "@/lib/jobs-store";
import { syncSharedJobsToLocal } from "@/lib/jobs-shared";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

export function JobsSection() {
  const [allJobs, setAllJobs] = useState<Job[]>(() => {
    // Sync init from localStorage so first render isn't empty
    return isJobsInitialized() ? getStoredJobs() : jobsConfig;
  });

  useEffect(() => {
    (async () => {
      // Pull admin-published jobs from the shared store so ALL devices see the
      // same list (adds/edits/deletes made by the admin on any device).
      await syncSharedJobsToLocal();
      const stored = isJobsInitialized() ? getStoredJobs() : jobsConfig;
      setAllJobs(stored);

      // Fetch from API — API is authoritative, including an empty list
      fetch(`${API}/jobs`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => {
          const list: Job[] = Array.isArray(d) ? d : d.data ?? [];
          saveJobs(list);
          setAllJobs(list);
        })
        .catch(() => {
          // API unavailable — shared store / localStorage initialisation above covers this
        });
    })();
  }, []);

  const openJobs = allJobs.filter(j => !isJobClosed(j)).slice(0, 3);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Job Announcements"
          subtitle="Discover exciting opportunities from companies hiring SkillBridge graduates."
          center
        />

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {[
            { label: "Open Positions",   value: allJobs.filter(j => !isJobClosed(j)).length, color: "text-[#1E90FF]" },
            { label: "Partner Companies",value: new Set(allJobs.map(j => j.company)).size,    color: "text-[#F57C00]" },
            { label: "Job Categories",   value: new Set(allJobs.map(j => j.category)).size,   color: "text-[#1E90FF]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-5 py-3 shadow-sm">
              <Briefcase className={cn("h-4 w-4", color)} />
              <span className={cn("text-xl font-black", color)}>{value}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        {openJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-gray-400">
            <Briefcase className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">We don&apos;t have any job openings right now. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
            {openJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="h-full"
              >
                <JobCard job={job} index={i} />
              </motion.div>
            ))}
          </div>
        )}

        {/* View All button */}
        {openJobs.length > 0 && (
          <div className="flex justify-center">
            <Button
              className="bg-[#1E90FF] hover:bg-blue-500 text-white px-8 h-11 gap-2"
              asChild
            >
              <Link href="/jobs">
                View All Jobs <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

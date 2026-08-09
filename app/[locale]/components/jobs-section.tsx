"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import JobCard from "@/app/[locale]/components/ui/job-card";
import { jobsConfig, isJobClosed, type Job } from "@/lib/jobs-config";
import { getStoredJobs, saveJobs } from "@/lib/jobs-store";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

export function JobsSection() {
  const [allJobs, setAllJobs] = useState<Job[]>(() => {
    // Sync init from localStorage so first render isn't empty
    const stored = getStoredJobs();
    return stored.length > 0 ? stored : jobsConfig;
  });

  useEffect(() => {
    // Fetch from API — only update state/localStorage if the API returns at least
    // as many records as what admin saved locally (prevents stale API from wiping edits).
    fetch(`${API}/jobs`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list: Job[] = Array.isArray(d) ? d : d.data ?? [];
        if (list.length === 0) return;
        const local = getStoredJobs();
        if (list.length >= local.length) {
          saveJobs(list);
          setAllJobs(list);
        }
      })
      .catch(() => {
        // API unavailable — localStorage initialisation above already covers this
      });
  }, []);

  const openJobs = allJobs.filter(j => !isJobClosed(j)).slice(0, 3);

  return (
    <section className="py-16 bg-[#0f2474] dark:bg-[#0a1a5c]">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Job Announcements"
          subtitle="Discover exciting opportunities from companies hiring SkillBridge graduates."
          center
          titleColor="text-white"
        />

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {[
            { label: "Open Positions",    value: allJobs.filter(j => !isJobClosed(j)).length, color: "text-cyan-300" },
            { label: "Partner Companies", value: new Set(allJobs.map(j => j.company)).size,    color: "text-orange-300" },
            { label: "Job Categories",    value: new Set(allJobs.map(j => j.category)).size,   color: "text-cyan-300" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 px-5 py-3 shadow-sm">
              <Briefcase className={cn("h-4 w-4", color)} />
              <span className={cn("text-xl font-black", color)}>{value}</span>
              <span className="text-xs text-blue-200">{label}</span>
            </div>
          ))}
        </div>

        {/* Cards grid */}
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

        {/* View All button */}
        <div className="flex justify-center">
          <Button
            className="bg-white text-[#1E90FF] hover:bg-blue-50 font-bold px-8 h-11 gap-2 shadow-lg"
            asChild
          >
            <Link href="/jobs">
              View All Jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

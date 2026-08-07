"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, DollarSign, Calendar, ExternalLink, ChevronDown, ChevronUp, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import {
  jobsConfig, categoryColor, typeColor,
  daysUntilDeadline, isJobClosed, type Job,
} from "@/lib/jobs-config";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function JobCard({ job, index }: { job: Job; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const closed = isJobClosed(job);
  const days   = job.deadline ? daysUntilDeadline(job.deadline) : null;
  const closingSoon = days !== null && days >= 0 && days <= 7;

  const initials = job.company.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      viewport={{ once: true }}
      className={cn(
        "flex flex-col bg-white dark:bg-gray-900 rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden h-full",
        closed
          ? "border-gray-200 dark:border-gray-800 opacity-70"
          : closingSoon
          ? "border-[#F57C00]/40 hover:shadow-xl hover:-translate-y-1"
          : "border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1"
      )}
    >
      {/* Top gradient bar */}
      <div className="h-1.5 w-full shrink-0" style={{
        background: closed
          ? "#e5e7eb"
          : "linear-gradient(90deg,#1E90FF,#F57C00)"
      }} />

      <div className="flex flex-col flex-1 p-5">

        {/* Header: avatar + title */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
            style={{ background: closed ? "#9ca3af" : "linear-gradient(135deg,#1E90FF,#42A5F5)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn("text-sm font-bold leading-snug line-clamp-2",
              closed ? "text-gray-400" : "text-gray-900 dark:text-gray-50"
            )}>
              {job.title}
            </h3>
            <p className="text-xs font-semibold text-[#1E90FF] mt-0.5 truncate">{job.company}</p>
          </div>
          {closingSoon && !closed && (
            <span className="shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#F57C00]/10 text-[#F57C00] animate-pulse">
              ⚠ {days}d
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", categoryColor[job.category] ?? "bg-gray-100 text-gray-500")}>
            {job.category}
          </span>
          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold", typeColor[job.type])}>
            {job.type}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800">
            {job.level}
          </span>
        </div>

        {/* Info pills */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
            <MapPin size={11} className="text-[#1E90FF] shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
              <DollarSign size={11} className="text-[#F57C00] shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          )}
          {job.deadline && (
            <div className={cn(
              "flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5",
              closingSoon ? "bg-[#F57C00]/10 text-[#F57C00]" : "bg-gray-50 text-gray-500 dark:bg-gray-800"
            )}>
              <Calendar size={11} className="text-[#1E90FF] shrink-0" />
              <span>Deadline: <strong>{formatDate(job.deadline)}</strong></span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {job.description}
        </p>

        {/* Expandable details */}
        {expanded && (
          <div className="mb-3 space-y-3 border-t border-gray-100 dark:border-gray-800 pt-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1E90FF] mb-1.5 border-b border-[#F57C00] pb-0.5 w-fit">Requirements</p>
              <ul className="space-y-1">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[#1E90FF] shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#F57C00] mb-1.5 border-b border-[#1E90FF] pb-0.5 w-fit">Responsibilities</p>
              <ul className="space-y-1">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[#F57C00] shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-3">
          {!closed ? (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 flex-1 py-2 text-xs font-bold text-white rounded-xl hover:opacity-90 transition-all"
              style={{ background: "linear-gradient(90deg,#1E90FF,#42A5F5)" }}
            >
              <ExternalLink size={12} /> Apply Now
            </a>
          ) : (
            <button disabled className="flex-1 py-2 text-xs font-bold bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed dark:bg-gray-800">
              Closed
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {expanded ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> Details</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function JobsSection() {
  const openJobs = jobsConfig.filter(j => !isJobClosed(j)).slice(0, 3);

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
            { label: "Open Positions", value: jobsConfig.filter(j => !isJobClosed(j)).length, color: "text-[#1E90FF]" },
            { label: "Partner Companies", value: new Set(jobsConfig.map(j => j.company)).size, color: "text-[#F57C00]" },
            { label: "Job Categories",   value: new Set(jobsConfig.map(j => j.category)).size, color: "text-[#1E90FF]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 px-5 py-3 shadow-sm">
              <Briefcase className={cn("h-4 w-4", color)} />
              <span className={cn("text-xl font-black", color)}>{value}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
          {openJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>

        {/* View All button */}
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
      </div>
    </section>
  );
}

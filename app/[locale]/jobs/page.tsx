"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, MapPin, Briefcase, Clock, DollarSign,
  Calendar, ExternalLink, ChevronDown, ChevronUp, Filter
} from "lucide-react";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import {
  jobsConfig, JOB_CATEGORIES, JOB_TYPES, JOB_LEVELS,
  categoryColor, typeColor, daysUntilDeadline, isJobClosed,
  type Job, type JobType, type JobLevel,
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

  // Initials avatar from company name
  const initials = job.company.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.06 }}
      viewport={{ once: true }}
      className={cn(
        "flex flex-col bg-white dark:bg-gray-900 rounded-2xl border shadow-sm transition-all duration-300 overflow-hidden",
        closed
          ? "border-gray-200 dark:border-gray-800 opacity-70"
          : closingSoon
          ? "border-[#F57C00]/40 dark:border-[#F57C00]/30 hover:shadow-xl hover:-translate-y-1"
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
        {/* ── Card header ── */}
        <div className="flex items-start gap-3 mb-4">
          {/* Company avatar */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm"
            style={{ background: closed ? "#9ca3af" : "linear-gradient(135deg,#1E90FF,#42A5F5)" }}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-base font-bold leading-snug truncate",
              closed ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-gray-50"
            )}>
              {job.title}
            </h3>
            <p className="text-sm font-semibold text-[#1E90FF] mt-0.5 truncate">{job.company}</p>
          </div>

          {/* Closing soon / closed badge */}
          {closed ? (
            <span className="shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold bg-gray-100 text-gray-400 dark:bg-gray-800">
              Closed
            </span>
          ) : closingSoon ? (
            <span className="shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold bg-red-100 text-red-600 animate-pulse">
              ⚠ {days}d left
            </span>
          ) : null}
        </div>

        {/* ── Badges row ── */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-semibold", categoryColor[job.category] ?? "bg-gray-100 text-gray-500")}>
            {job.category}
          </span>
          <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-semibold", typeColor[job.type])}>
            {job.type}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {job.level}
          </span>
        </div>

        {/* ── Info pills ── */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
            <MapPin size={12} className="text-[#1E90FF] shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          {job.salary ? (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
              <DollarSign size={12} className="text-[#F57C00] shrink-0" />
              <span className="truncate">{job.salary}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
              <DollarSign size={12} className="text-gray-300 shrink-0" />
              <span>Negotiable</span>
            </div>
          )}
          {job.deadline && (
            <div className={cn(
              "col-span-2 flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-1.5",
              closingSoon
                ? "bg-red-50 text-red-500 dark:bg-red-900/20"
                : "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            )}>
              <Calendar size={12} className={closingSoon ? "text-red-400 shrink-0" : "text-[#1E90FF] shrink-0"} />
              <span>Deadline: <strong>{formatDate(job.deadline)}</strong></span>
              {closingSoon && <span className="ml-auto font-bold text-[#F57C00]">Closing Soon!</span>}
            </div>
          )}
        </div>

        {/* ── Description ── */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-3">
          {job.description}
        </p>

        {/* ── Expandable details ── */}
        {expanded && (
          <div className="mt-2 mb-4 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#1E90FF] mb-2 border-b border-[#F57C00] pb-0.5 w-fit">
                Requirements
              </p>
              <ul className="space-y-1.5">
                {job.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1E90FF] shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-[#F57C00] mb-2 border-b border-[#1E90FF] pb-0.5 w-fit">
                Responsibilities
              </p>
              <ul className="space-y-1.5">
                {job.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F57C00] shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* ── Actions ── */}
        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800 mt-3">
          {!closed ? (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 flex-1 py-2 text-xs font-bold text-white rounded-xl transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "linear-gradient(90deg,#1E90FF,#42A5F5)" }}
            >
              <ExternalLink size={13} /> Apply Now
            </a>
          ) : (
            <button disabled className="flex-1 py-2 text-xs font-bold bg-gray-100 text-gray-400 rounded-xl cursor-not-allowed dark:bg-gray-800">
              Applications Closed
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {expanded ? <><ChevronUp size={13} /> Less</> : <><ChevronDown size={13} /> Details</>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function JobsPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");
  const [type,     setType]     = useState<JobType | "All">("All");
  const [level,    setLevel]    = useState<JobLevel | "All">("All");
  const [showFilters, setShowFilters] = useState(false);

  const open   = jobsConfig.filter(j => !isJobClosed(j));
  const closed = jobsConfig.filter(j =>  isJobClosed(j));

  const filter = (jobs: Job[]) => jobs.filter(j => {
    const matchCat    = category === "All" || j.category === category;
    const matchType   = type === "All"     || j.type === type;
    const matchLevel  = level === "All"    || j.level === level;
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchLevel && matchSearch;
  });

  const filteredOpen   = filter(open);
  const filteredClosed = filter(closed);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-montserrat">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1565C0] via-[#2196F3] to-[#42A5F5] dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            <Briefcase className="h-3.5 w-3.5" /> Career Opportunities
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Job Announcements
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8">
            Discover exciting opportunities from top companies hiring SkillBridge graduates.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-white mb-8">
            {[
              { label: "Open Positions", value: open.length },
              { label: "Companies",      value: new Set(jobsConfig.map(j => j.company)).size },
              { label: "Job Types",      value: JOB_TYPES.length },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-3xl font-black">{value}</span>
                <span className="text-xs text-white/70 mt-0.5">{label}</span>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search jobs, companies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-0 shadow-xl text-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F57C00]"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">

        {/* Filter bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {filteredOpen.length} open position{filteredOpen.length !== 1 ? "s" : ""} found
            </p>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#1E90FF] transition-colors"
            >
              <Filter size={13}/> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  category === cat
                    ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                    : "bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                )}
              >{cat}</button>
            ))}
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Job Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                >
                  <option value="All">All Types</option>
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Experience Level</label>
                <select
                  value={level}
                  onChange={e => setLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                >
                  <option value="All">All Levels</option>
                  {JOB_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Open jobs */}
        {filteredOpen.length === 0 && filteredClosed.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Briefcase className="h-14 w-14 mx-auto mb-3 opacity-20" />
            <p className="text-base font-medium">No jobs found matching your search</p>
          </div>
        ) : (
          <>
            {filteredOpen.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
                {filteredOpen.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>
            )}

            {/* Closed / Archived */}
            {filteredClosed.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3">
                    Closed Positions ({filteredClosed.length})
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 opacity-60">
                  {filteredClosed.map((job, i) => (
                    <JobCard key={job.id} job={job} index={i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

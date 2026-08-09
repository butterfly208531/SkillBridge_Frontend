"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Briefcase, Filter } from "lucide-react";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import JobCard from "@/app/[locale]/components/ui/job-card";
import {
  jobsConfig, JOB_CATEGORIES, JOB_TYPES, JOB_LEVELS,
  isJobClosed, type Job, type JobType, type JobLevel,
} from "@/lib/jobs-config";
import { getStoredJobs, saveJobs } from "@/lib/jobs-store";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

export default function JobsPage() {
  const [allJobs,     setAllJobs]     = useState<Job[]>(() => {
    // Sync init from localStorage so first render isn't empty
    const stored = getStoredJobs();
    return stored.length > 0 ? stored : jobsConfig;
  });
  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("All");
  const [type,        setType]        = useState<JobType | "All">("All");
  const [level,       setLevel]       = useState<JobLevel | "All">("All");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch from API on mount — same smart-merge logic as jobs-section.tsx
  useEffect(() => {
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
        // API unavailable — state already initialised from localStorage/static config
      });
  }, []);

  const open   = allJobs.filter(j => !isJobClosed(j));
  const closed = allJobs.filter(j =>  isJobClosed(j));

  const filter = (jobs: Job[]) => jobs.filter(j => {
    const matchCat    = category === "All" || j.category === category;
    const matchType   = type     === "All" || j.type     === type;
    const matchLevel  = level    === "All" || j.level    === level;
    const matchSearch = !search  ||
      j.title.toLowerCase().includes(search.toLowerCase())       ||
      j.company.toLowerCase().includes(search.toLowerCase())     ||
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

          {/* Stats — driven by live data */}
          <div className="flex flex-wrap justify-center gap-8 text-white mb-8">
            {[
              { label: "Open Positions", value: open.length },
              { label: "Companies",      value: new Set(allJobs.map(j => j.company)).size },
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
              <Filter size={13} /> {showFilters ? "Hide Filters" : "Show Filters"}
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
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Advanced filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Job Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as JobType | "All")}
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
                  onChange={e => setLevel(e.target.value as JobLevel | "All")}
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10 items-stretch">
                {filteredOpen.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: (i % 6) * 0.06 }}
                    viewport={{ once: true }}
                    className="h-full"
                  >
                    <JobCard job={job} index={i} />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Closed / Archived */}
            {filteredClosed.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3">
                    Closed Positions ({filteredClosed.length})
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 opacity-60 items-stretch">
                  {filteredClosed.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: (i % 6) * 0.06 }}
                      viewport={{ once: true }}
                      className="h-full"
                    >
                      <JobCard job={job} index={i} />
                    </motion.div>
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

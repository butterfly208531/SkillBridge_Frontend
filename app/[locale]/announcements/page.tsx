"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Pin, Search, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import { announcementsConfig, categoryMeta, type AnnouncementCategory } from "@/lib/announcements-config";
import { usePageView } from "@/hooks/use-page-view";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

const ALL_CATS: AnnouncementCategory[] = ["scholarship", "course", "deadline", "spotlight", "general"];

export default function AnnouncementsPage() {
  usePageView("/announcements");
  const [search,   setSearch]  = useState("");
  const [category, setCategory] = useState<AnnouncementCategory | "all">("all");

  const filtered = announcementsConfig
    .filter(a => {
      const matchCat    = category === "all" || a.category === category;
      const matchSearch = !search ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.body.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      // pinned first, then by date desc
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const pinned = filtered.filter(a => a.pinned);
  const rest   = filtered.filter(a => !a.pinned);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-montserrat">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1565C0] via-[#2196F3] to-[#42A5F5] dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 py-14 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <Bell className="h-3.5 w-3.5" /> Latest Updates
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Announcements
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8">
            Stay up to date with new scholarships, course additions, deadline changes, and spotlights.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search announcements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-0 shadow-xl text-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F57C00]"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setCategory("all")}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
              category === "all"
                ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#1E90FF] hover:text-[#1E90FF] dark:bg-gray-900 dark:border-gray-700"
            )}
          >
            All ({announcementsConfig.length})
          </button>
          {ALL_CATS.map(cat => {
            const meta  = categoryMeta[cat];
            const count = announcementsConfig.filter(a => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  category === cat
                    ? `${meta.bg} ${meta.color} border-current`
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 dark:bg-gray-900 dark:border-gray-700"
                )}
              >
                <span>{meta.icon}</span> {meta.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Result count */}
        {(search || category !== "all") && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            {filtered.length} announcement{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No announcements found</p>
          </div>
        )}

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Pin className="h-4 w-4 text-[#F57C00]" />
              <span className="text-xs font-bold text-[#F57C00] uppercase tracking-widest">Pinned</span>
            </div>
            <div className="space-y-4">
              {pinned.map((ann, i) => (
                <AnnouncementCard key={ann.id} ann={ann} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div className="space-y-4">
            {pinned.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">All Updates</span>
              </div>
            )}
            {rest.map((ann, i) => (
              <AnnouncementCard key={ann.id} ann={ann} index={i} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function AnnouncementCard({ ann, index }: { ann: typeof announcementsConfig[0]; index: number }) {
  const meta = categoryMeta[ann.category];
  const [expanded, setExpanded] = useState(false);
  const isLong = ann.body.length > 160;
  const preview = isLong && !expanded ? ann.body.slice(0, 160) + "…" : ann.body;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={cn(
        "bg-white dark:bg-gray-900 rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5",
        ann.pinned ? "border-[#F57C00]/40 dark:border-[#F57C00]/30" : "border-gray-100 dark:border-gray-800"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Top row */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className={cn("flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold", meta.bg, meta.color)}>
              {meta.icon} {meta.label}
            </span>
            {ann.pinned && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F57C00]/10 text-[#F57C00]">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
            <span className="flex items-center gap-1 text-[11px] text-gray-400 ml-auto">
              <Calendar className="h-3 w-3" />
              {timeAgo(ann.date)} · {formatDate(ann.date)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-50 leading-snug mb-2">
            {ann.title}
          </h3>

          {/* Body */}
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {preview}
          </p>

          {/* Expand / Course link */}
          <div className="flex items-center gap-4 mt-3">
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-semibold text-[#1E90FF] hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
            {ann.courseId && (
              <Link
                href={`/courses/${ann.courseId}`}
                className="flex items-center gap-1 text-xs font-semibold text-[#1E90FF] hover:underline"
              >
                View Course <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        {/* Big icon */}
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0", meta.bg)}>
          {meta.icon}
        </div>
      </div>
    </motion.div>
  );
}

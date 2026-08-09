"use client";

import * as React from "react";
import { useState } from "react";
import {
  Search, Mail, MapPin, Clock, ChevronDown, ChevronUp,
  Briefcase, ExternalLink, CalendarDays,
} from "lucide-react";
import Image from "next/image";
import {
  daysUntilDeadline, isJobClosed,
  type Job,
} from "@/lib/jobs-config";
import { cn } from "@/lib/utils";

// ── helpers ────────────────────────────────────────────────────────────────

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Category → outer background gradient (the "blue wall" in the poster) */
const outerGradient: Record<string, string> = {
  ERP:         "linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)",
  AI:          "linear-gradient(135deg,#065f46 0%,#10b981 100%)",
  Design:      "linear-gradient(135deg,#9d174d 0%,#ec4899 100%)",
  Automation:  "linear-gradient(135deg,#b45309 0%,#f59e0b 100%)",
  Language:    "linear-gradient(135deg,#0e7490 0%,#06b6d4 100%)",
  Development: "linear-gradient(135deg,#1565C0 0%,#2196F3 100%)",
};
const defaultGradient = "linear-gradient(135deg,#1565C0 0%,#2196F3 100%)";

// ── component ──────────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  index?: number;
}

export default function JobCard({ job }: JobCardProps) {
  const [expanded, setExpanded] = useState(false);

  const closed      = isJobClosed(job);
  const days        = job.deadline ? daysUntilDeadline(job.deadline) : null;
  const closingSoon = days !== null && days >= 0 && days <= 7;
  const bg          = outerGradient[job.category] ?? defaultGradient;

  // Decorative dot grid — same dot pattern as in the poster corners
  const DotGrid = ({ className }: { className?: string }) => (
    <div className={cn("absolute grid gap-[4px] opacity-40 pointer-events-none", className)}
      style={{ gridTemplateColumns: "repeat(5,6px)" }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60" />
      ))}
    </div>
  );

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300"
      style={{ background: bg }}
    >
      {/* ── Decorative dots ── */}
      <DotGrid className="top-4 left-3" />
      <DotGrid className="bottom-16 right-3" />

      {/* ── Decorative swoosh lines (top-right) ── */}
      <div className="absolute top-3 right-10 flex flex-col items-end gap-0.5 pointer-events-none opacity-70">
        {[16, 24, 14].map((w, i) => (
          <div key={i} className="h-0.5 rounded-full bg-cyan-300/80" style={{ width: w }} />
        ))}
      </div>

      {/* ── Logo + tagline (top-left, like VNEXUS) ── */}
      <div className="relative z-10 flex items-center gap-2 px-5 pt-5 pb-3">
        <div className="w-9 h-9 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
          <Image src="/Logo.svg" alt="SkillBridge" width={24} height={24} className="object-contain" />
        </div>
        <div>
          <p className="text-white font-black text-sm leading-none tracking-wide">SkillBridge</p>
          <p className="text-white/70 text-[10px]">Learn. Grow. Succeed.</p>
        </div>
      </div>

      {/* ── White notecard ── */}
      <div className="relative z-10 mx-4 mb-5 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }}>

        {/* Pin */}
        <div className="flex justify-center -mt-4 mb-1">
          <div className="w-8 h-8 rounded-full bg-[#1E90FF] shadow-lg flex items-center justify-center border-4 border-white">
            <div className="w-2 h-2 rounded-full bg-white/80" />
          </div>
        </div>

        <div className="px-5 pb-5 flex flex-col gap-4">

          {/* "we want you" + "We're Hiring" */}
          <div className="text-center">
            <p className="text-[#1E90FF] text-sm font-semibold flex items-center justify-center gap-1.5">
              <span className="text-[#1E90FF] font-black">≫</span>
              we want you
              <span className="text-[#1E90FF] font-black">≪</span>
            </p>
            <p className="text-[#0d1b5e] text-2xl font-black leading-tight mt-0.5">
              We&apos;re Hiring
            </p>

            {/* Status / countdown badge */}
            <div className="flex justify-center mt-1.5">
              {closed ? (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-500">
                  <Clock className="h-3 w-3" /> Closed
                </span>
              ) : closingSoon ? (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600 animate-pulse">
                  <Clock className="h-3 w-3" /> {days === 0 ? "Closes Today!" : `${days}d left`}
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                  <Clock className="h-3 w-3" /> {days !== null ? `${days} days left` : "Open"}
                </span>
              )}
            </div>
          </div>

          {/* Search-bar style job title */}
          <div className="flex items-center gap-3 border border-[#1E90FF]/30 rounded-full px-4 py-2.5 bg-white shadow-sm">
            <div className="w-7 h-7 rounded-full bg-[#1E90FF] flex items-center justify-center shrink-0">
              <Search className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[#0d1b5e] font-bold text-sm truncate">{job.title}</span>
          </div>

          {/* Type + Level chips */}
          <div className="flex flex-wrap gap-2 justify-center -mt-1">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#1E90FF]/10 text-[#1E90FF] border border-[#1E90FF]/20">
              <Briefcase className="h-3 w-3" /> {job.type}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-[#1E90FF]/10 text-[#1E90FF] border border-[#1E90FF]/20">
              {job.level}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-600 border border-orange-200">
                {job.salary}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Email row */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full border-2 border-[#1E90FF]/30 flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4 text-[#1E90FF]" />
            </div>
            <div>
              <p className="text-[11px] text-gray-400">Please send us your resume to</p>
              <p className="text-[#1E90FF] font-bold text-xs">skillbridge@gmail.com</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Address / Location row */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1E90FF] flex items-center justify-center shrink-0 shadow">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="border border-gray-200 rounded-xl px-3 py-2 flex-1">
              <p className="text-[#0d1b5e] font-black text-xs">Company</p>
              <p className="text-gray-600 text-[11px] leading-snug mt-0.5">{job.company}</p>
              <p className="text-gray-500 text-[11px] leading-snug">{job.location}</p>
            </div>
          </div>

          {/* Expandable details */}
          {expanded && (
            <>
              {/* Deadline */}
              {job.deadline && (
                <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2">
                  <CalendarDays className="h-4 w-4 text-[#1E90FF] shrink-0" />
                  <span className="text-xs text-gray-500">
                    Deadline:{" "}
                    <strong className={closed ? "text-gray-500" : closingSoon ? "text-red-600" : "text-gray-800"}>
                      {formatDeadline(job.deadline)}
                    </strong>
                  </span>
                </div>
              )}

              {/* Requirements */}
              {job.requirements.length > 0 && (
                <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-[#1E90FF] mb-2 border-b-2 border-orange-400 pb-0.5 w-fit">
                    Requirements
                  </p>
                  <ul className="space-y-1.5">
                    {job.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1E90FF] mt-1.5 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed">{job.description}</p>
            </>
          )}

          {/* Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#1E90FF] transition-colors"
          >
            {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> See details</>}
          </button>

        </div>

        {/* Apply CTA — bottom of notecard */}
        {!closed ? (
          <a
            href={job.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 text-sm font-black text-white transition-opacity hover:opacity-90"
            style={{ background: bg }}
          >
            <ExternalLink className="h-4 w-4" />
            APPLY NOW
          </a>
        ) : (
          <div className="flex items-center justify-center py-3 text-sm font-black text-gray-400 bg-gray-100">
            Applications Closed
          </div>
        )}
      </div>
    </div>
  );
}

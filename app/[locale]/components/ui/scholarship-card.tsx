"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, CalendarDays, Users, MapPin, Mail, Clock, Star } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/[locale]/components/ui/button";
import { type FundingType, daysRemaining, studentPays, coverageLabel } from "@/lib/scholarships-config";
import { cn } from "@/lib/utils";

interface ScholarshipCardProps {
  id: string;
  name: string;
  applicationsCount: number;
  deadline: string;
  winnersCount: number;
  eligibility: string;
  courseId: string;
  fundingType?: FundingType;
  tuitionAmount?: number;
  archived?: boolean;
}

function formatDeadline(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getYear(isoDate: string): string {
  const d = new Date(isoDate);
  return isNaN(d.getTime()) ? "2026" : String(d.getFullYear());
}

function CountdownBadge({ deadline }: { deadline: string }) {
  const days = daysRemaining(deadline);

  if (days < 0) {
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-200 text-gray-500">
        <Clock className="h-3 w-3" /> Closed
      </span>
    );
  }
  if (days === 0) {
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600 animate-pulse">
        <Clock className="h-3 w-3" /> Closes Today!
      </span>
    );
  }
  if (days <= 7) {
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-600">
        <Clock className="h-3 w-3" /> {days}d left
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
      <Clock className="h-3 w-3" /> {days} days left
    </span>
  );
}

export default function ScholarshipCard({
  name,
  applicationsCount,
  deadline,
  winnersCount,
  eligibility,
  courseId,
  fundingType = "full",
  tuitionAmount,
  archived = false,
}: ScholarshipCardProps) {
  const year = getYear(deadline);
  const days = daysRemaining(deadline);
  const closed = days < 0;
  const closingSoon = days >= 0 && days <= 7;
  const pays = tuitionAmount !== undefined ? studentPays(tuitionAmount, fundingType) : null;

  const requirements = eligibility
    .split(/[.,;]/)
    .map(s => s.trim())
    .filter(Boolean);

  const headerGradient = closed
    ? "linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)"
    : fundingType === "full"
    ? "linear-gradient(135deg, #1565C0 0%, #2196F3 60%, #42A5F5 100%)"
    : "linear-gradient(135deg, #b45309 0%, #F57C00 60%, #fb923c 100%)";

  return (
    <div className={cn(
      "flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-900 border dark:border-gray-800",
      closed ? "border-gray-200 opacity-80" : closingSoon ? "border-red-300" : "border-gray-100"
    )}>

      {/* ── Header ── */}
      <div className="relative px-6 pt-7 pb-12 text-white overflow-hidden" style={{ background: headerGradient }}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white/10" />

        {/* Closing Soon badge */}
        {closingSoon && !closed && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse shadow-md">
              ⚠ Closing Soon!
            </span>
          </div>
        )}

        {/* Archived badge */}
        {closed && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-gray-600 text-white">
              Archived
            </span>
          </div>
        )}

        <p className="text-3xl font-black leading-none tracking-tight">{year}</p>
        <p className="text-xl font-black uppercase leading-tight mt-0.5">Scholarship</p>
        <p className="text-xl font-black uppercase leading-tight">Program</p>

        {/* Funding type badge */}
        <div className="mt-2">
          <span className={cn(
            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide",
            fundingType === "full"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-white/20 text-white border border-white/30"
          )}>
            <Star className="h-3 w-3 fill-current" />
            {coverageLabel(fundingType)}
          </span>
        </div>

        <div className="absolute top-5 right-5 flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">SkillBridge</span>
          <span className="text-[9px] text-white/60">Institute of Technology</span>
        </div>
      </div>

      {/* ── Diamond logo ── */}
      <div className="relative flex justify-center -mt-10 mb-2">
        <div
          className="w-20 h-20 overflow-hidden shadow-lg border-4 border-white dark:border-gray-900"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        >
          <div className="w-full h-full flex items-center justify-center bg-white p-3">
            <Image src="/Logo.svg" alt="SkillBridge logo" width={56} height={56} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-3">

        {/* Program name */}
        <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-50 text-center leading-snug uppercase tracking-wide">
          {name}
        </h3>

        {/* Tuition breakdown */}
        {tuitionAmount !== undefined && pays !== null && (
          <div className={cn(
            "rounded-xl px-4 py-3 text-center border",
            fundingType === "full"
              ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
              : "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800"
          )}>
            <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
              <span className="text-gray-500 dark:text-gray-400 line-through text-xs">
                Original: ${tuitionAmount}
              </span>
              <span className="text-gray-400">→</span>
              <span className={cn("font-black text-base", fundingType === "full" ? "text-emerald-600" : "text-orange-600")}>
                {fundingType === "full" ? "You Pay: $0 🎉" : `You Pay: $${pays}`}
              </span>
            </div>
            <p className="text-[11px] mt-1 font-semibold text-gray-500">
              {fundingType === "full"
                ? "100% tuition covered"
                : `50% covered — save $${Math.round(tuitionAmount * 0.5)}`}
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Users className="h-3.5 w-3.5 text-[#2196F3] shrink-0" />
            <span><strong className="text-gray-800 dark:text-gray-200">{applicationsCount}</strong> applications</span>
          </div>
          <CountdownBadge deadline={deadline} />
        </div>

        {/* Requirements */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#2196F3] dark:text-blue-400 mb-2 border-b-2 border-[#F57C00] pb-0.5 w-fit">
            Requirements
          </p>
          <ul className="flex flex-col gap-1.5">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-[#F57C00] shrink-0" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Deadline */}
        <div className={cn(
          "flex items-center gap-2 text-xs rounded-lg px-3 py-2",
          closed
            ? "bg-gray-100 text-gray-500 dark:bg-gray-800"
            : closingSoon
            ? "bg-red-50 text-red-600 dark:bg-red-900/20"
            : "bg-blue-50 text-gray-500 dark:bg-blue-900/20"
        )}>
          <CalendarDays className={cn("h-3.5 w-3.5 shrink-0", closed ? "text-gray-400" : closingSoon ? "text-red-500" : "text-[#2196F3]")} />
          <span>
            {closed ? "Closed: " : "Deadline: "}
            <strong className={cn(closed ? "text-gray-500" : closingSoon ? "text-red-600" : "text-gray-800 dark:text-gray-200")}>
              {formatDeadline(deadline)}
            </strong>
          </span>
        </div>

        <div className="flex-1" />

        {/* Apply button */}
        {!closed ? (
          <Button
            className="w-full font-bold text-white focus-visible:ring-2 focus-visible:ring-[#2196F3]"
            style={{ background: fundingType === "full" ? "linear-gradient(90deg,#1565C0,#2196F3)" : "linear-gradient(90deg,#b45309,#F57C00)" }}
            asChild
          >
            <Link href={`/courses/${courseId}/ApplicationForm`}>Apply Now</Link>
          </Button>
        ) : (
          <Button disabled className="w-full font-bold bg-gray-200 text-gray-500 cursor-not-allowed">
            Applications Closed
          </Button>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 gap-2">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Addis Ababa, Ethiopia</span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />skillbridge@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

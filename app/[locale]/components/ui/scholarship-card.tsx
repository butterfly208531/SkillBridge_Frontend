import * as React from "react"
import Link from "next/link"
import { CheckCircle2, CalendarDays, Users, MapPin, Mail } from "lucide-react"
import Image from "next/image"
import { Button } from "@/app/[locale]/components/ui/button"

interface ScholarshipCardProps {
  id: string
  name: string
  applicationsCount: number
  deadline: string
  winnersCount: number
  eligibility: string
  courseId: string
}

function formatDeadline(isoDate: string): string {
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

// Derive a year from the deadline string
function getYear(isoDate: string): string {
  const d = new Date(isoDate)
  return isNaN(d.getTime()) ? "2025" : String(d.getFullYear())
}

export default function ScholarshipCard({
  name,
  applicationsCount,
  deadline,
  winnersCount,
  eligibility,
  courseId,
}: ScholarshipCardProps) {
  const year = getYear(deadline)

  // Split eligibility into bullet points (sentences or comma-separated)
  const requirements = eligibility
    .split(/[.,;]/)
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">

      {/* ── Header — dark teal block ── */}
      <div
        className="relative px-6 pt-7 pb-12 text-white overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1565C0 0%, #2196F3 60%, #42A5F5 100%)" }}
      >
        {/* Decorative blob top-right */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white/10" />

        <p className="text-3xl font-black leading-none tracking-tight">{year}</p>
        <p className="text-xl font-black uppercase leading-tight mt-0.5">Scholarship</p>
        <p className="text-xl font-black uppercase leading-tight">Program</p>

        {/* SkillBridge label */}
        <div className="absolute top-5 right-5 flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">SkillBridge</span>
          <span className="text-[9px] text-white/60">Institute of Technology</span>
        </div>
      </div>

      {/* ── Diamond logo clip ── */}
      <div className="relative flex justify-center -mt-10 mb-2">
        <div
          className="w-20 h-20 overflow-hidden shadow-lg border-4 border-white dark:border-gray-900"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        >
          <div className="w-full h-full flex items-center justify-center bg-white p-3">
            <Image
              src="/Logo.svg"
              alt="SkillBridge logo"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-4">

        {/* Program name */}
        <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-50 text-center leading-snug uppercase tracking-wide">
          {name}
        </h3>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Users className="h-3.5 w-3.5 text-[#2196F3] shrink-0" aria-hidden="true" />
            <span><strong className="text-gray-800 dark:text-gray-200">{applicationsCount}</strong> applications</span>
          </div>

        </div>

        {/* Eligibility / Requirements */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#2196F3] dark:text-blue-400 mb-2 border-b-2 border-[#F57C00] pb-0.5 w-fit">
            Requirements
          </p>
          <ul className="flex flex-col gap-1.5">
            {requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-[#F57C00] shrink-0" aria-hidden="true" />
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
          <CalendarDays className="h-3.5 w-3.5 text-[#2196F3] shrink-0" aria-hidden="true" />
          <span>Deadline: <strong className="text-gray-800 dark:text-gray-200">{formatDeadline(deadline)}</strong></span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Apply button */}
        <Button
          className="w-full font-bold text-white focus-visible:ring-2 focus-visible:ring-[#2196F3]"
          style={{ background: "linear-gradient(90deg, #1565C0, #2196F3)" }}
          asChild
        >
          <Link href={`/courses/${courseId}/ApplicationForm`}>Apply Now</Link>
        </Button>

        {/* Footer bar */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 gap-2">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            Addis Ababa, Ethiopia
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" aria-hidden="true" />
            skillbridge@gmail.com
          </span>
        </div>
      </div>
    </div>
  )
}

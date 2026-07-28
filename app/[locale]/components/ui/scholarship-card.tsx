import * as React from "react"
import Link from "next/link"
import { Users, CalendarDays, Trophy, CheckCircle } from "lucide-react"
import { Button } from "@/app/[locale]/components/ui/button"
import { cn } from "@/lib/utils"

interface ScholarshipCardProps {
  id: string
  name: string
  applicationsCount: number
  deadline: string
  winnersCount: number
  eligibility: string
  courseId: string
}

/** Format an ISO date string (e.g. "2025-08-31") to a readable form like "Aug 31, 2025". */
function formatDeadline(isoDate: string): string {
  const date = new Date(isoDate)
  if (isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function ScholarshipCard({
  name,
  applicationsCount,
  deadline,
  winnersCount,
  eligibility,
  courseId,
}: ScholarshipCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-900",
        "shadow-sm hover:shadow-lg transition-shadow duration-300",
        "p-5 gap-4"
      )}
    >
      {/* Card heading */}
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50 leading-snug">
        {name}
      </h3>

      {/* Detail rows */}
      <dl className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
        {/* Applications count */}
        <div className="flex items-start gap-2">
          <Users
            className="h-4 w-4 mt-0.5 text-blue-500 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="sr-only">Applications</dt>
            <dd>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {applicationsCount}
              </span>{" "}
              applications
            </dd>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-start gap-2">
          <CalendarDays
            className="h-4 w-4 mt-0.5 text-orange-500 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="sr-only">Deadline</dt>
            <dd>
              Deadline:{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {formatDeadline(deadline)}
              </span>
            </dd>
          </div>
        </div>

        {/* Winners count */}
        <div className="flex items-start gap-2">
          <Trophy
            className="h-4 w-4 mt-0.5 text-amber-500 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="sr-only">Winners</dt>
            <dd>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {winnersCount}
              </span>{" "}
              {winnersCount === 1 ? "winner" : "winners"}
            </dd>
          </div>
        </div>

        {/* Eligibility */}
        <div className="flex items-start gap-2">
          <CheckCircle
            className="h-4 w-4 mt-0.5 text-green-500 shrink-0"
            aria-hidden="true"
          />
          <div>
            <dt className="sr-only">Eligibility</dt>
            <dd>{eligibility}</dd>
          </div>
        </div>
      </dl>

      {/* Apply Now button */}
      <Button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-2 focus-visible:ring-blue-500"
        asChild
      >
        <Link href={`/courses/${courseId}/ApplicationForm`}>Apply Now</Link>
      </Button>
    </div>
  )
}

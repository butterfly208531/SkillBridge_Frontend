import * as React from "react"

interface SkeletonCardProps {
  variant?: "card" | "list"
}

export default function SkeletonCard({ variant = "card" }: SkeletonCardProps) {
  if (variant === "list") {
    return (
      <div className="flex flex-row rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse bg-white dark:bg-gray-900">
        {/* Image placeholder — left side */}
        <div className="w-32 h-full min-h-[120px] bg-gray-200 dark:bg-gray-700 shrink-0" />
        {/* Text content — right side */}
        <div className="flex-1 p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
        </div>
      </div>
    )
  }

  // Default "card" variant — matches BootcampCard layout
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse bg-white dark:bg-gray-900">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        {/* Description lines */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        {/* Badge row */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
        {/* Button placeholder */}
        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
    </div>
  )
}

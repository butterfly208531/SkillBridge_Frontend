import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock, CalendarDays, Monitor, BarChart2, Star } from "lucide-react"
import { Button } from "@/app/[locale]/components/ui/button"
import { Badge } from "@/app/[locale]/components/ui/badge"
import { cn } from "@/lib/utils"

interface BootcampCardProps {
  id: string
  image: string
  title: string
  description: string
  duration: string
  startDate?: string
  mode?: string
  level?: string
  category?: string
  rating?: number
  reviews?: number
  showViewDetails?: boolean
  fallbackImage?: string
}

// Category-specific Unsplash images so every card shows a relevant photo
const categoryImages: Record<string, string> = {
  "Development":              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=340&fit=crop",
  "ERP Development":          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=340&fit=crop",
  "ERP Functional Training":  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop",
  "Design":                   "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop",
  "Artificial Intelligence":  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=340&fit=crop",
  "AI":                       "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=340&fit=crop",
  "Data Science":             "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=600&h=340&fit=crop",
  "Automation":               "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=340&fit=crop",
  "Language":                 "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=340&fit=crop",
  "Business":                 "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=340&fit=crop",
  "Marketing":                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=340&fit=crop",
  "Mobile":                   "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=340&fit=crop",
}

const defaultFallback = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop"

export default function BootcampCard({
  id,
  image,
  title,
  description,
  duration,
  startDate,
  mode,
  level,
  category,
  rating,
  reviews,
  showViewDetails = false,
  fallbackImage,
}: BootcampCardProps) {
  const categoryFallback = (category && categoryImages[category]) ?? defaultFallback
  const [imgSrc, setImgSrc] = useState(image || categoryFallback)

  return (
    <div
      className={cn(
        "flex flex-col h-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-900",
        "shadow-sm hover:shadow-lg transition-shadow duration-300"
      )}
    >
      {/* Course image */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={imgSrc}
          alt={`${title} course thumbnail`}
          fill
          unoptimized
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImgSrc(fallbackImage ?? categoryFallback)}
        />
        {category && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-blue-600 text-white border-none text-xs font-medium"
            >
              {category}
            </Badge>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50 leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2">
          {duration && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {duration}
            </span>
          )}
          {startDate && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
              <CalendarDays className="h-3 w-3" aria-hidden="true" />
              {startDate}
            </span>
          )}
          {mode && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
              <Monitor className="h-3 w-3" aria-hidden="true" />
              {mode}
            </span>
          )}
          {level && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1">
              <BarChart2 className="h-3 w-3" aria-hidden="true" />
              {level}
            </span>
          )}
        </div>

        {/* Rating */}
        {(rating !== undefined || reviews !== undefined) && (
          <div className="flex items-center gap-1.5">
            {rating !== undefined && (
              <>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {rating.toFixed(1)}
                </span>
                <div className="flex" aria-label={`${rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </>
            )}
            {reviews !== undefined && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({reviews})
              </span>
            )}
          </div>
        )}

        {/* Spacer pushes buttons to bottom */}
        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-[#2196F3] text-[#2196F3] hover:bg-blue-50 dark:hover:bg-blue-950/30 focus-visible:ring-2 focus-visible:ring-blue-500"
            asChild
          >
            <Link href={`/courses/${id}`}>View Details</Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-[#2196F3] hover:bg-blue-500 text-white focus-visible:ring-2 focus-visible:ring-blue-400"
            asChild
          >
            <Link href={`/courses/${id}/ApplicationForm`}>Enroll Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

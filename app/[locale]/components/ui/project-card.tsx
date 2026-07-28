import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { User, ExternalLink, Github } from "lucide-react"
import { Badge } from "@/app/[locale]/components/ui/badge"
import { Button } from "@/app/[locale]/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  id: string
  title: string
  image: string
  technologies: string[]
  description: string
  category: string
  subCategory?: string
  studentName?: string
  demoUrl?: string
  githubUrl?: string
}

/** Map of category names to badge color classes */
const categoryColors: Record<string, string> = {
  ERP: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Web Development": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  AI: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Automation: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Python: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Mobile: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
}

export default function ProjectCard({
  title,
  image,
  technologies,
  description,
  category,
  subCategory,
  studentName,
  demoUrl,
  githubUrl,
}: ProjectCardProps) {
  const categoryColorClass =
    categoryColors[category] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700",
        "bg-white dark:bg-gray-900",
        "shadow-sm hover:shadow-lg transition-shadow duration-300"
      )}
    >
      {/* Project image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={`${title} project screenshot`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Category + sub-category badge overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span
            className={cn(
              "inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-xs font-medium",
              categoryColorClass
            )}
          >
            {category}
          </span>
          {subCategory && (
            <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-black/50 text-white">
              {subCategory}
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50 leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>

        {/* Technology badges */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <Badge
                key={tech}
                variant="outline"
                className="text-xs px-2 py-0.5 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Student name */}
        {studentName && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{studentName}</span>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action links */}
        {(demoUrl || githubUrl) && (
          <div className="flex gap-2 mt-1">
            {demoUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                asChild
              >
                <Link
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  Demo
                </Link>
              </Button>
            )}
            {githubUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                asChild
              >
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  GitHub
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

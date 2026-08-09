"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ExternalLink, Github, Code2, MapPin, Mail } from "lucide-react";
import { Button } from "@/app/[locale]/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  id: string;
  title: string;
  image: string;
  technologies: string[];
  description: string;
  category: string;
  subCategory?: string;
  studentName?: string;
  demoUrl?: string;
  githubUrl?: string;
}

/** Per-category gradient — mirrors the scholarship card's header gradient approach */
const categoryGradients: Record<string, string> = {
  ERP:               "linear-gradient(135deg, #5b21b6 0%, #7c3aed 60%, #a78bfa 100%)",
  "Web Development": "linear-gradient(135deg, #1565C0 0%, #2196F3 60%, #42A5F5 100%)",
  AI:                "linear-gradient(135deg, #065f46 0%, #059669 60%, #34d399 100%)",
  Automation:        "linear-gradient(135deg, #b45309 0%, #F57C00 60%, #fb923c 100%)",
  Python:            "linear-gradient(135deg, #854d0e 0%, #ca8a04 60%, #facc15 100%)",
  Mobile:            "linear-gradient(135deg, #9d174d 0%, #ec4899 60%, #f9a8d4 100%)",
};

const categoryAccents: Record<string, string> = {
  ERP:               "text-purple-500  border-purple-400  bg-purple-50  dark:bg-purple-900/20",
  "Web Development": "text-[#2196F3]   border-[#F57C00]   bg-blue-50    dark:bg-blue-900/20",
  AI:                "text-emerald-600 border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  Automation:        "text-[#F57C00]   border-orange-400  bg-orange-50  dark:bg-orange-900/20",
  Python:            "text-yellow-600  border-yellow-400  bg-yellow-50  dark:bg-yellow-900/20",
  Mobile:            "text-pink-500    border-pink-400    bg-pink-50    dark:bg-pink-900/20",
};

const categoryTagColors: Record<string, string> = {
  ERP:               "bg-purple-100 text-purple-700",
  "Web Development": "bg-blue-100   text-blue-700",
  AI:                "bg-green-100  text-green-700",
  Automation:        "bg-orange-100 text-orange-700",
  Python:            "bg-yellow-100 text-yellow-700",
  Mobile:            "bg-pink-100   text-pink-700",
};

export default function ProjectCard({
  id,
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
  const gradient   = categoryGradients[category] ?? "linear-gradient(135deg, #374151 0%, #6b7280 100%)";
  const accent     = categoryAccents[category]   ?? "text-gray-500 border-gray-400 bg-gray-50";
  const tagColor   = categoryTagColors[category] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">

      {/* ── Gradient Header ── */}
      <div className="relative px-6 pt-7 pb-12 text-white overflow-hidden" style={{ background: gradient }}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white/10" />

        {/* Category + sub-category badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            {category}
          </span>
          {subCategory && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/30 text-white/90">
              {subCategory}
            </span>
          )}
        </div>

        {/* Header text */}
        <p className="text-3xl font-black leading-none tracking-tight mt-6">Student</p>
        <p className="text-xl font-black uppercase leading-tight mt-0.5">Project</p>

        {/* SkillBridge label */}
        <div className="absolute top-5 right-5 flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">SkillBridge</span>
          <span className="text-[9px] text-white/60">Institute of Technology</span>
        </div>
      </div>

      {/* ── Diamond Logo ── */}
      <div className="relative flex justify-center -mt-10 mb-2">
        <div
          className="w-20 h-20 overflow-hidden shadow-lg border-4 border-white dark:border-gray-900"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white p-3">
              <Image src="/Logo.svg" alt="SkillBridge logo" width={56} height={56} className="w-full h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-3">

        {/* Title */}
        <h3 className="text-base font-extrabold text-gray-900 dark:text-gray-50 text-center leading-snug uppercase tracking-wide">
          {title}
        </h3>

        {/* Student name */}
        {studentName && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{studentName}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div>
            <p className={cn(
              "text-[11px] font-black uppercase tracking-widest mb-2 border-b-2 pb-0.5 w-fit",
              accent
            )}>
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map(tech => (
                <span key={tech} className={cn(
                  "flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold",
                  tagColor
                )}>
                  <Code2 className="h-2.5 w-2.5 shrink-0" />
                  {tech}
                </span>
              ))}
              {technologies.length > 5 && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-500">
                  +{technologies.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          <Button
            size="sm"
            className={cn(
              "flex-1 font-bold text-white focus-visible:ring-2 focus-visible:ring-[#2196F3]",
              !demoUrl && "opacity-40 cursor-not-allowed"
            )}
            style={{ background: demoUrl ? gradient : undefined }}
            asChild={!!demoUrl}
            disabled={!demoUrl}
          >
            {demoUrl ? (
              <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Live Demo
              </a>
            ) : (
              <span>
                <ExternalLink className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                Live Demo
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex-1 font-bold focus-visible:ring-2 focus-visible:ring-blue-500",
              !githubUrl && "opacity-40 cursor-not-allowed"
            )}
            asChild={!!githubUrl}
            disabled={!githubUrl}
          >
            {githubUrl ? (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                GitHub
              </a>
            ) : (
              <span>
                <Github className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                GitHub
              </span>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-[10px] text-gray-400 gap-2">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Addis Ababa, Ethiopia</span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />skillbridge@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

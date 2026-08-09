"use client";

import * as React from "react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
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

/** Accent color per category — used for the top header strip and CTA */
const categoryAccent: Record<string, string> = {
  ERP:               "#7c3aed",
  "Web Development": "#1E90FF",
  AI:                "#059669",
  Automation:        "#F57C00",
  Python:            "#ca8a04",
  Mobile:            "#ec4899",
};

const defaultAccent = "#F57C00";

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
  const accent = categoryAccent[category] ?? defaultAccent;

  // Split technologies into two columns, poster-style
  const mid   = Math.ceil(technologies.slice(0, 6).length / 2);
  const left  = technologies.slice(0, mid);
  const right = technologies.slice(mid, 6);

  return (
    <div
      className="flex flex-col overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-[#e8dece]"
      style={{ backgroundColor: "#FFF8F0", fontFamily: "sans-serif" }}
    >
      {/* ── TOP HEADER STRIP ─────────────────────────────────────── */}
      <div
        className="relative flex items-start justify-between px-4 pt-3 pb-2 text-white"
        style={{ backgroundColor: accent }}
      >
        {/* Category + sub-category */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 rounded px-2 py-0.5 w-fit">
            {category}
          </span>
          {subCategory && (
            <span className="text-[9px] font-semibold text-white/80">{subCategory}</span>
          )}
        </div>

        {/* SkillBridge badge */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest">SKILLBRIDGE</span>
          <span className="text-[8px] text-white/70">Institute of Technology</span>
        </div>
      </div>

      {/* ── HERO IMAGE + HEADLINE ─────────────────────────────────── */}
      <div className="relative flex" style={{ minHeight: 130 }}>

        {/* Bold left headline — poster style */}
        <div
          className="relative z-10 flex flex-col justify-center pl-4 pr-2"
          style={{ width: "52%" }}
        >
          <p
            className="font-black leading-tight uppercase"
            style={{ fontSize: "clamp(18px, 4vw, 28px)", color: accent }}
          >
            {/* Split title into at-most 3 words per line, poster feel */}
            {title.split(" ").reduce<string[][]>((acc, word) => {
              const last = acc[acc.length - 1];
              if (!last || last.length >= 2) {
                acc.push([word]);
              } else {
                last.push(word);
              }
              return acc;
            }, []).map((chunk, i) => (
              <span key={i} className="block">{chunk.join(" ")}</span>
            ))}
          </p>
          {studentName && (
            <p
              className="mt-1 text-[11px] font-semibold"
              style={{ color: accent, opacity: 0.85 }}
            >
              by {studentName}
            </p>
          )}
        </div>

        {/* Hero image — right side, bleeds to edge */}
        <div className="absolute right-0 top-0 bottom-0 overflow-hidden" style={{ width: "54%" }}>
          {/* Soft bleed gradient on the left so image fades into bg */}
          <div
            className="absolute inset-y-0 left-0 z-10 w-1/3"
            style={{ background: "linear-gradient(to right, #FFF8F0, transparent)" }}
          />
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: `${accent}18` }}
            >
              <Image src="/Logo.svg" alt="SkillBridge" width={48} height={48} className="opacity-30" />
            </div>
          )}
        </div>
      </div>

      {/* ── WHY CHOOSE / FEATURES CARD ───────────────────────────── */}
      <div
        className="mx-3 rounded-xl overflow-hidden"
        style={{ backgroundColor: "#f0e8d8", marginTop: -10, position: "relative", zIndex: 10 }}
      >
        {/* Label pill */}
        <div className="flex justify-center" style={{ marginTop: -10 }}>
          <span
            className="text-white text-[11px] font-bold rounded-full px-4 py-1"
            style={{ backgroundColor: accent }}
          >
            {description.length > 0 ? "About this project" : "Project details"}
          </span>
        </div>

        {/* Description */}
        <p className="text-[11px] text-gray-600 leading-relaxed px-4 pt-2 pb-1 line-clamp-2">
          {description}
        </p>

        {/* Tech stack — two columns, poster style */}
        {technologies.length > 0 && (
          <div className="flex gap-2 px-4 pb-3 pt-1">
            {/* Left column */}
            <div className="flex-1 space-y-1.5">
              {left.map((tech) => (
                <div key={tech} className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: accent }}
                  />
                  <span className="text-[11px] font-semibold text-gray-700 leading-tight">{tech}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            {right.length > 0 && (
              <div className="w-px bg-gray-300 mx-1 self-stretch" />
            )}

            {/* Right column */}
            {right.length > 0 && (
              <div className="flex-1 space-y-1.5">
                {right.map((tech) => (
                  <div key={tech} className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: accent }}
                    />
                    <span className="text-[11px] font-semibold text-gray-700 leading-tight">{tech}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CTA FOOTER STRIP ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-3 px-4 py-3 mt-3"
        style={{ backgroundColor: accent }}
      >
        {demoUrl ? (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold border-2 border-white text-white",
              "hover:bg-white transition-colors"
            )}
            style={{ color: "white" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            LIVE DEMO
          </a>
        ) : (
          <span className="flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold border-2 border-white/40 text-white/40">
            <ExternalLink className="h-3.5 w-3.5" />
            LIVE DEMO
          </span>
        )}

        {githubUrl ? (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold border-2 border-white text-white hover:bg-white transition-colors"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
          >
            <Github className="h-3.5 w-3.5" />
            GITHUB
          </a>
        ) : (
          <span className="flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-bold border-2 border-white/40 text-white/40">
            <Github className="h-3.5 w-3.5" />
            GITHUB
          </span>
        )}
      </div>
    </div>
  );
}

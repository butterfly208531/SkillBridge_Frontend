"use client";

import * as React from "react";
import Image from "next/image";
import { User, ExternalLink, Github, MapPin, Mail, Figma } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  technologies: string[];
  description: string;
  category: string;
  subCategory?: string;
  studentName?: string;
  demoUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
}

const BLUE = "#1E90FF";
const ORANGE = "#F57C00";

export default function ProjectCard({
  title,
  technologies,
  description,
  category,
  subCategory,
  studentName,
  demoUrl,
  githubUrl,
  figmaUrl,
}: ProjectCardProps) {
  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white"
      style={{ border: `1px solid ${BLUE}33` }}
    >
      {/* ── Header banner ── */}
      <div className="relative px-5 pt-5 pb-8" style={{ backgroundColor: BLUE }}>

        {/* Category pills */}
        <div className="flex flex-col gap-1">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow w-fit"
            style={{ backgroundColor: ORANGE }}
          >
            {category}
          </span>
          {subCategory && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm w-fit">
              {subCategory}
            </span>
          )}
        </div>

        {/* SkillBridge brand — top-right */}
        <div className="absolute top-3 right-3 bg-white rounded-xl px-2.5 py-1.5 shadow-md flex flex-col items-center">
          <div className="w-7 h-7 mb-0.5">
            <Image src="/Logo.svg" alt="SkillBridge" width={28} height={28} className="w-full h-full object-contain" />
          </div>
          <span className="text-[8px] font-black leading-none tracking-tight" style={{ color: BLUE }}>SKILLBRIDGE</span>
          <span className="text-[7px] leading-none" style={{ color: `${BLUE}80` }}>Institute of Technology</span>
        </div>

        {/* "Student Project" label */}
        <div className="mt-3">
          <p className="text-white font-extrabold leading-none" style={{ fontSize: 22 }}>Student</p>
          <p className="font-black uppercase leading-none tracking-wide" style={{ fontSize: 18, color: ORANGE }}>
            Project
          </p>
        </div>

        {/* Curved bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 bg-white"
          style={{ borderRadius: "60% 60% 0 0 / 80% 80% 0 0" }}
        />
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pt-3 pb-5 gap-3">

        {/* Title */}
        <h3
          className="text-[15px] font-extrabold text-center uppercase tracking-wide leading-snug"
          style={{ color: BLUE }}
        >
          {title}
        </h3>

        {/* Student name */}
        {studentName && (
          <div className="flex items-center justify-center gap-1.5 text-xs" style={{ color: BLUE }}>
            <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{studentName}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-[12px] line-clamp-3 leading-relaxed text-center" style={{ color: `${BLUE}99` }}>
          {description}
        </p>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ background: `linear-gradient(to right, transparent, ${BLUE}33, transparent)` }}
        />

        {/* Tech stack */}
        {technologies.length > 0 && (
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest pb-0.5 w-fit mb-2"
              style={{ color: ORANGE, borderBottom: `2px solid ${ORANGE}` }}
            >
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                  style={{
                    color: BLUE,
                    backgroundColor: `${BLUE}14`,
                    border: `1px solid ${BLUE}40`,
                  }}
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 5 && (
                <span
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
                  style={{
                    color: ORANGE,
                    backgroundColor: `${ORANGE}1A`,
                    border: `1px solid ${ORANGE}4D`,
                  }}
                >
                  +{technologies.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          {demoUrl ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-sm"
              style={{ backgroundColor: ORANGE }}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Live Demo
            </a>
          ) : (
            <span
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white opacity-40 cursor-not-allowed"
              style={{ backgroundColor: ORANGE }}
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Live Demo
            </span>
          )}

          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold bg-white transition-colors"
              style={{ color: BLUE, border: `2px solid ${BLUE}` }}
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </a>
          ) : (
            <span
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold bg-white opacity-40 cursor-not-allowed"
              style={{ color: BLUE, border: `2px solid ${BLUE}` }}
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </span>
          )}
        </div>

        {/* Figma button */}
        {figmaUrl && (
          <a
            href={figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white transition-colors shadow-sm"
            style={{ backgroundColor: BLUE }}
          >
            <Figma className="h-3.5 w-3.5" aria-hidden="true" />
            Figma Design
          </a>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-2.5 text-[10px] gap-2"
          style={{ borderTop: `1px solid ${BLUE}26`, color: `${BLUE}73` }}
        >
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" style={{ color: ORANGE }} />
            Addis Ababa, Ethiopia
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" style={{ color: BLUE }} />
            skillbridge@gmail.com
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import Image from "next/image";
import { User, ExternalLink, Github, MapPin, Mail } from "lucide-react";
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
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border border-blue-100 group">

      {/* ── Hero image with navy overlay ── */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        {/* Background image */}
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80"; }}
          />
        ) : (
          <div className="w-full h-full bg-[#1565C0]" />
        )}

        {/* Deep navy gradient overlay — matches the CollegeTrip dark-blue sweep */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(13,33,77,0.55) 0%, rgba(13,33,77,0.75) 55%, rgba(13,33,77,0.92) 100%)",
          }}
        />

        {/* Decorative curved bottom shape (white) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-10 bg-white"
          style={{ borderRadius: "60% 60% 0 0 / 80% 80% 0 0" }}
        />

        {/* Category pill — top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#F57C00] text-white shadow">
            {category}
          </span>
          {subCategory && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/30 backdrop-blur-sm">
              {subCategory}
            </span>
          )}
        </div>

        {/* SkillBridge brand — top-right */}
        <div className="absolute top-3 right-3 z-10 bg-white rounded-xl px-2.5 py-1.5 shadow-md flex flex-col items-center">
          <div className="w-7 h-7 mb-0.5">
            <Image src="/Logo.svg" alt="SkillBridge" width={28} height={28} className="w-full h-full object-contain" />
          </div>
          <span className="text-[8px] font-black text-[#1565C0] leading-none tracking-tight">SKILLBRIDGE</span>
          <span className="text-[7px] text-gray-400 leading-none">Institute of Technology</span>
        </div>

        {/* "Student Project" label — bottom-left, above the white curve */}
        <div className="absolute bottom-6 left-5 z-10">
          <p className="text-white font-extrabold leading-none" style={{ fontSize: 22 }}>Student</p>
          <p className="text-[#F57C00] font-black uppercase leading-none tracking-wide" style={{ fontSize: 18 }}>
            Project
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 px-5 pt-3 pb-5 gap-3">

        {/* Title */}
        <h3 className="text-[15px] font-extrabold text-[#0D214D] text-center uppercase tracking-wide leading-snug">
          {title}
        </h3>

        {/* Student name */}
        {studentName && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#1565C0]">
            <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{studentName}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-[12px] text-gray-600 line-clamp-3 leading-relaxed text-center">
          {description}
        </p>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

        {/* Tech stack */}
        {technologies.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#F57C00] border-b-2 border-[#F57C00] pb-0.5 w-fit mb-2">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-1.5">
              {technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#1565C0] border border-blue-200"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 5 && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-orange-50 text-[#F57C00] border border-orange-200">
                  +{technologies.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex-1" />

        {/* Action buttons — orange Live Demo, outlined GitHub */}
        <div className="flex gap-2 mt-1">
          {demoUrl ? (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white bg-[#F57C00] hover:bg-orange-500 transition-colors shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Live Demo
            </a>
          ) : (
            <span className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-white bg-[#F57C00] opacity-40 cursor-not-allowed">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Live Demo
            </span>
          )}

          {githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-[#1565C0] bg-white border-2 border-[#1565C0] hover:bg-blue-50 transition-colors"
            >
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </a>
          ) : (
            <span className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-bold text-[#1565C0] bg-white border-2 border-[#1565C0] opacity-40 cursor-not-allowed">
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              GitHub
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-blue-100 text-[10px] text-gray-400 gap-2">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#F57C00]" />
            Addis Ababa, Ethiopia
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-[#1565C0]" />
            skillbridge@gmail.com
          </span>
        </div>
      </div>
    </div>
  );
}

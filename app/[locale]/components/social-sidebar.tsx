"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SiX, SiTiktok, SiTelegram, SiYoutube } from "react-icons/si";
import { motion } from "framer-motion";

const socials = [
  { Icon: Facebook,   url: "https://www.facebook.com/profile.php?id=61574189453702",               label: "Facebook",  bg: "bg-[#1E90FF]" },
  { Icon: Instagram,  url: "https://www.instagram.com/skillbridgeinstituteoftech",                 label: "Instagram", bg: "bg-[#F57C00]" },
  { Icon: Linkedin,   url: "https://www.linkedin.com/company/skillbridge-institute-of-technology", label: "LinkedIn",  bg: "bg-[#1E90FF]" },
  { Icon: SiTelegram, url: "https://t.me/skillbridgeinstituteoftech",                              label: "Telegram",  bg: "bg-[#F57C00]" },
  { Icon: SiYoutube,  url: "https://www.youtube.com/@SkillBridgeInstituteOfTech",                  label: "YouTube",   bg: "bg-[#1E90FF]" },
  { Icon: SiTiktok,   url: "https://www.tiktok.com/@skillbridge417",                               label: "TikTok",    bg: "bg-[#F57C00]" },
  { Icon: SiX,        url: "https://x.com",                                                        label: "X",         bg: "bg-[#1E90FF]" },
];

export function SocialSidebar() {
  return (
    <>
      {/* Desktop only — hidden on mobile/tablet */}
      <div className="hidden xl:flex flex-col gap-1 fixed right-0 top-1/2 -translate-y-1/2 z-40">
        {socials.map(({ Icon, url, label, bg }, i) => (
          <motion.div
            key={label}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="flex justify-end"
          >
          <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={`group flex flex-row-reverse items-center h-9 w-9 hover:w-28 rounded-l-lg shadow-md overflow-hidden transition-[width] duration-300 ease-in-out ${bg}`}
            >
              {/* Icon — pinned to right */}
              <span className="flex items-center justify-center w-9 h-9 shrink-0">
                <Icon size={16} color="#fff" />
              </span>
              {/* Label — slides in from right */}
              <span className="text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-2">
                {label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </>
  );
}

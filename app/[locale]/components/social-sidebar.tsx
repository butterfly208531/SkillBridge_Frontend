"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SiX, SiTiktok, SiTelegram, SiYoutube } from "react-icons/si";
import { motion } from "framer-motion";

const BLUE   = "#1E90FF";
const ORANGE = "#F57C00";

const socials = [
  { Icon: Facebook,   url: "https://www.facebook.com/share/1BdDExr4ZH/",                          label: "Facebook",  color: BLUE   },
  { Icon: Instagram,  url: "https://www.instagram.com/skill.bridge.institute",                    label: "Instagram", color: ORANGE },
  { Icon: Linkedin,   url: "https://www.linkedin.com/company/skillbridge-institute-of-technology", label: "LinkedIn",  color: BLUE   },
  { Icon: SiTelegram, url: "https://t.me/skillbridgeinstituteoftech",                              label: "Telegram",  color: ORANGE },
  { Icon: SiYoutube,  url: "https://www.youtube.com/@SkillBridgeInstituteOfTech",                  label: "YouTube",   color: BLUE   },
  { Icon: SiTiktok,   url: "https://www.tiktok.com/@skillbridge_institute",                       label: "TikTok",    color: ORANGE },
  { Icon: SiX,        url: "https://x.com/Skillbridgedu",                                         label: "X",         color: BLUE   },
];

export function SocialSidebar() {
  return (
    <>
      {/* Desktop only — hidden on mobile/tablet */}
      <div className="hidden xl:flex flex-col gap-1 fixed right-0 top-1/2 -translate-y-1/2 z-40">
        {socials.map(({ Icon, url, label, color }, i) => (
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
              className="group flex flex-row-reverse items-center h-9 w-9 hover:w-28 rounded-l-lg shadow-md overflow-hidden transition-[width] duration-300 ease-in-out"
              style={{ backgroundColor: color }}
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

"use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { SiX, SiTiktok, SiTelegram, SiYoutube } from "react-icons/si";
import { motion } from "framer-motion";

const BLUE   = "#1E90FF";
const ORANGE = "#F57C00";

const socials = [
  { Icon: Facebook,   url: "https://www.facebook.com/profile.php?id=61574189453702",               label: "Facebook",  color: BLUE   },
  { Icon: Instagram,  url: "https://www.instagram.com/skillbridgeinstituteoftech",                 label: "Instagram", color: ORANGE },
  { Icon: Linkedin,   url: "https://www.linkedin.com/company/skillbridge-institute-of-technology", label: "LinkedIn",  color: BLUE   },
  { Icon: SiTelegram, url: "https://t.me/skillbridgeinstituteoftech",                              label: "Telegram",  color: ORANGE },
  { Icon: SiYoutube,  url: "https://www.youtube.com/@SkillBridgeInstituteOfTech",                  label: "YouTube",   color: BLUE   },
  { Icon: SiTiktok,   url: "https://www.tiktok.com/@skillbridge417",                               label: "TikTok",    color: ORANGE },
  { Icon: SiX,        url: "https://x.com",                                                        label: "X",         color: BLUE   },
];

export function SocialSidebar() {
  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
      className="hidden md:flex"
    >
      {socials.map(({ Icon, url, label, color }, i) => (
        <motion.div
          key={label}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
        >
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group flex items-center h-10 rounded-l-xl shadow-md overflow-hidden transition-all duration-300"
            style={{
              backgroundColor: color,
              width: "40px",
              flexDirection: "row-reverse",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.width = "120px";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.width = "40px";
            }}
          >
            {/* Icon — always on the right edge */}
            <span
              style={{
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={17} color="#fff" />
            </span>
            {/* Label — appears to the left of icon on hover */}
            <span
              className="text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pl-3"
            >
              {label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

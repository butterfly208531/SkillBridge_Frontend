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
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-1"
    >
      {socials.map(({ Icon, url, label, color }, i) => (
        <motion.div
          key={label}
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          whileHover={{ x: -6 }}
        >
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group flex flex-row-reverse items-center w-10 h-10 rounded-l-xl shadow-md overflow-hidden transition-all duration-200 hover:w-32"
            style={{ backgroundColor: color }}
          >
            <span className="flex items-center justify-center w-10 h-10 shrink-0">
              <Icon size={17} color="#fff" />
            </span>
            <span className="text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pl-2">
              {label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

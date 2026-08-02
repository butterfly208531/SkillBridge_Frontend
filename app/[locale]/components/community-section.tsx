"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Send, Youtube, Linkedin, Globe, Instagram, Facebook,
  Calendar, Trophy, Gift, LayoutGrid,
} from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import { CountUp } from "@/app/[locale]/components/ui/count-up";
import { communityConfig, communityFeatures } from "@/lib/community-config";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const platformIcons: Record<string, LucideIcon> = {
  telegram:  Send,
  youtube:   Youtube,
  linkedin:  Linkedin,
  hub:       LayoutGrid,
  instagram: Instagram,
  facebook:  Facebook,
  tiktok:    Globe,
};

// Alternate blue/orange per card for visual rhythm
const platformAccent: Record<string, { icon: string; bar: string; count: string; iconBg: string }> = {
  telegram:  { icon: "text-[#2196F3]", iconBg: "bg-blue-50 dark:bg-blue-900/20",   bar: "bg-[#2196F3]",  count: "text-[#2196F3]"  },
  youtube:   { icon: "text-[#F57C00]", iconBg: "bg-orange-50 dark:bg-orange-900/20", bar: "bg-[#F57C00]", count: "text-[#F57C00]" },
  linkedin:  { icon: "text-[#2196F3]", iconBg: "bg-blue-50 dark:bg-blue-900/20",   bar: "bg-[#2196F3]",  count: "text-[#2196F3]"  },
  hub:       { icon: "text-[#F57C00]", iconBg: "bg-orange-50 dark:bg-orange-900/20", bar: "bg-[#F57C00]", count: "text-[#F57C00]" },
  instagram: { icon: "text-[#F57C00]", iconBg: "bg-orange-50 dark:bg-orange-900/20", bar: "bg-[#F57C00]", count: "text-[#F57C00]" },
  facebook:  { icon: "text-[#2196F3]", iconBg: "bg-blue-50 dark:bg-blue-900/20",   bar: "bg-[#2196F3]",  count: "text-[#2196F3]"  },
  tiktok:    { icon: "text-[#2196F3]", iconBg: "bg-blue-50 dark:bg-blue-900/20",   bar: "bg-[#2196F3]",  count: "text-[#2196F3]"  },
};

const featureIcons: Record<string, LucideIcon> = {
  events:     Calendar,
  challenges: Trophy,
  referral:   Gift,
};

const featureAccent: Record<string, string> = {
  events:     "bg-[#2196F3]",
  challenges: "bg-[#F57C00]",
  referral:   "bg-[#2196F3]",
};

export function CommunitySection() {
  const t = useTranslations("communitySection");

  const telegramUrl = communityConfig.find((p) => p.key === "telegram")?.url ?? "#";
  const youtubeUrl  = communityConfig.find((p) => p.key === "youtube")?.url  ?? "#";
  const linkedinUrl = communityConfig.find((p) => p.key === "linkedin")?.url ?? "#";

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        {/* Fanned card deck layout */}
        <div className="relative flex justify-center items-center mb-12" style={{ height: "340px" }}>
          {communityConfig.map((platform, i) => {
            const Icon = platformIcons[platform.key] ?? Globe;
            const accent = platformAccent[platform.key] ?? { icon: "text-[#2196F3]", iconBg: "bg-blue-50", bar: "bg-[#2196F3]", count: "text-[#2196F3]" };
            const total = communityConfig.length;
            const mid = Math.floor(total / 2);
            const offset = i - mid;
            const rotate = offset * 8;
            const translateX = offset * 60;
            const translateY = Math.abs(offset) * 10;
            const zIndex = total - Math.abs(offset);

            return (
              <motion.a
                key={platform.key}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -16, scale: 1.06, zIndex: 50 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                viewport={{ once: true }}
                style={{
                  position: "absolute",
                  rotate: `${rotate}deg`,
                  translateX: `${translateX}px`,
                  translateY: `${translateY}px`,
                  zIndex,
                }}
                className={cn(
                  "flex flex-col gap-3 pt-5 pb-5 px-4 rounded-2xl overflow-hidden w-36",
                  "bg-white dark:bg-gray-900",
                  "border border-gray-100 dark:border-gray-800",
                  "shadow-lg cursor-pointer transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2196F3]"
                )}
              >
                <div className={cn("absolute top-0 left-0 right-0 h-[4px]", accent.bar)} />
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", accent.iconBg)}>
                  <Icon className={cn("h-5 w-5", accent.icon)} aria-hidden="true" />
                </div>
                <p className="text-xs font-bold text-gray-800 dark:text-gray-100 leading-tight">
                  {t(`platforms.${platform.key}.label`)}
                </p>
                {platform.statsValue && (
                  <>
                    <CountUp
                      end={parseInt(platform.statsValue, 10)}
                      suffix={platform.statsSuffix ?? ""}
                      duration={2}
                      className={cn("text-2xl font-black leading-none", accent.count)}
                    />
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 -mt-1">
                      {t(`platforms.${platform.key}.stat`)}
                    </span>
                  </>
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Feature highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {communityFeatures.map((feature, i) => {
            const Icon       = featureIcons[feature.key] ?? Calendar;
            const accentBg   = featureAccent[feature.key] ?? "bg-[#2196F3]";

            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={cn("p-3 rounded-xl shrink-0", accentBg)}>
                  <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-50 mb-1">
                    {t(`features.${feature.key}.title`)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {t(`features.${feature.key}.description`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button className="bg-[#2196F3] hover:bg-blue-500 text-white gap-2 h-11 px-7 rounded-full" asChild>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
              <Send className="h-4 w-4" aria-hidden="true" />
              {t("joinTelegram")}
            </a>
          </Button>
          <Button className="bg-[#F57C00] hover:bg-orange-500 text-white gap-2 h-11 px-7 rounded-full" asChild>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4" aria-hidden="true" />
              {t("subscribeYoutube")}
            </a>
          </Button>
          <Button className="bg-[#2196F3] hover:bg-blue-500 text-white gap-2 h-11 px-7 rounded-full" asChild>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              {t("followLinkedin")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

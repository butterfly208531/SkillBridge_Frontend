"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Send, Youtube, Linkedin, Globe, Instagram, Facebook,
  Calendar, Trophy, Gift, MessageCircle, LayoutGrid,
} from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import { CountUp } from "@/app/[locale]/components/ui/count-up";
import { communityConfig, communityFeatures } from "@/lib/community-config";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const platformIcons: Record<string, LucideIcon> = {
  telegram:    Send,
  youtube:     Youtube,
  linkedin:    Linkedin,
  hub:         LayoutGrid,
  discussions: MessageCircle,
  instagram:   Instagram,
  facebook:    Facebook,
  tiktok:      Globe,
};

const platformColors: Record<string, string> = {
  telegram:    "text-blue-500   bg-blue-50   dark:bg-blue-900/20",
  youtube:     "text-red-500    bg-red-50    dark:bg-red-900/20",
  linkedin:    "text-blue-700   bg-blue-50   dark:bg-blue-900/20",
  hub:         "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
  discussions: "text-green-500  bg-green-50  dark:bg-green-900/20",
  instagram:   "text-pink-500   bg-pink-50   dark:bg-pink-900/20",
  facebook:    "text-blue-600   bg-blue-50   dark:bg-blue-900/20",
  tiktok:      "text-gray-800   bg-gray-100  dark:bg-gray-800 dark:text-gray-200",
};

const featureIcons: Record<string, LucideIcon> = {
  events:     Calendar,
  challenges: Trophy,
  referral:   Gift,
};

const featureColors: Record<string, string> = {
  events:     "from-blue-500 to-blue-600",
  challenges: "from-orange-500 to-[#F57C00]",
  referral:   "from-purple-500 to-purple-600",
};

export function CommunitySection() {
  const t = useTranslations("communitySection");

  const telegramUrl  = communityConfig.find((p) => p.key === "telegram")?.url ?? "#";
  const youtubeUrl   = communityConfig.find((p) => p.key === "youtube")?.url  ?? "#";
  const linkedinUrl  = communityConfig.find((p) => p.key === "linkedin")?.url ?? "#";

  // Show only the 5 primary platforms prominently; rest shown as smaller tiles
  const primaryKeys = ["telegram", "youtube", "linkedin", "hub", "discussions"];
  const primary     = communityConfig.filter((p) => primaryKeys.includes(p.key));
  const secondary   = communityConfig.filter((p) => !primaryKeys.includes(p.key));

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        {/* Primary platform cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {primary.map((platform, i) => {
            const Icon       = platformIcons[platform.key] ?? Globe;
            const colorClass = platformColors[platform.key] ?? "text-gray-500 bg-gray-50";
            const count      = parseInt(platform.statsValue ?? "0", 10);
            const suffix     = platform.statsSuffix ?? "";

            return (
              <motion.a
                key={platform.key}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-200 dark:border-gray-700",
                  "bg-white dark:bg-gray-900",
                  "hover:shadow-md hover:border-[#2196F3] transition-all duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                )}
              >
                <div className={cn("p-3 rounded-xl", colorClass)}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-50 text-center leading-tight">
                  {t(`platforms.${platform.key}.label`)}
                </p>
                {platform.statsValue && (
                  <div className="text-center">
                    <CountUp
                      end={count}
                      suffix={suffix}
                      duration={2}
                      className="block text-lg font-bold text-[#2196F3]"
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t(`platforms.${platform.key}.stat`)}
                    </span>
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Secondary platform tiles */}
        {secondary.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {secondary.map((platform, i) => {
              const Icon       = platformIcons[platform.key] ?? Globe;
              const colorClass = platformColors[platform.key] ?? "text-gray-500 bg-gray-50";
              const count      = parseInt(platform.statsValue ?? "0", 10);
              const suffix     = platform.statsSuffix ?? "";

              return (
                <motion.a
                  key={platform.key}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700",
                    "bg-white dark:bg-gray-900",
                    "hover:shadow-md hover:border-[#2196F3] transition-all duration-300",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  )}
                >
                  <div className={cn("p-2 rounded-lg", colorClass)}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-gray-50">
                      {t(`platforms.${platform.key}.label`)}
                    </p>
                    {platform.statsValue && (
                      <div className="flex items-baseline gap-1">
                        <CountUp
                          end={count}
                          suffix={suffix}
                          duration={2}
                          className="text-sm font-bold text-[#2196F3]"
                        />
                        <span className="text-xs text-gray-400">
                          {t(`platforms.${platform.key}.stat`)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        {/* Feature highlight cards — Events, Challenges, Referral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {communityFeatures.map((feature, i) => {
            const Icon        = featureIcons[feature.key] ?? Globe;
            const gradientCls = featureColors[feature.key] ?? "from-gray-400 to-gray-500";

            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              >
                <div className={cn("p-3 rounded-xl bg-gradient-to-br shrink-0", gradientCls)}>
                  <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-1">
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
          <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2 h-11 px-6" asChild>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
              <Send className="h-4 w-4" aria-hidden="true" />
              {t("joinTelegram")}
            </a>
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white gap-2 h-11 px-6" asChild>
            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
              <Youtube className="h-4 w-4" aria-hidden="true" />
              {t("subscribeYoutube")}
            </a>
          </Button>
          <Button className="bg-blue-700 hover:bg-blue-800 text-white gap-2 h-11 px-6" asChild>
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

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  FolderOpen, Users, Monitor, Star, Users2, Briefcase,
  Building2, Award, TrendingUp, MessageCircle, BadgeCheck, Clock,
} from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { whyConfig } from "@/lib/why-config";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  FolderOpen, Users, Monitor, Star, Users2, Briefcase,
  Building2, Award, TrendingUp, MessageCircle, BadgeCheck, Clock,
};

export function WhySection() {
  const t = useTranslations("whySection");

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {whyConfig.map((feature, i) => {
            const Icon = iconMap[feature.iconName] ?? Star;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700",
                  "bg-white dark:bg-gray-900",
                  "hover:shadow-md hover:scale-105 hover:border-[#2196F3] transition-all duration-300"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  i % 2 === 0
                    ? "bg-blue-50 dark:bg-blue-900/30"
                    : "bg-orange-50 dark:bg-orange-900/20"
                )}>
                  <Icon
                    className={cn("h-5 w-5", i % 2 === 0 ? "text-[#2196F3]" : "text-[#F57C00]")}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t(`features.${feature.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

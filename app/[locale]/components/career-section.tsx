"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  FileText, Linkedin, Layout, Github, MessageSquare,
  Video, Globe, Heart, Building, Search,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import { careerConfig } from "@/lib/career-config";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  FileText, Linkedin, Layout, Github, MessageSquare,
  Video, Globe, Heart, Building, Search,
};

export function CareerSection() {
  const t = useTranslations("careerSection");

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {careerConfig.map((service, i) => {
            const Icon = iconMap[service.iconName] ?? FileText;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className={cn(
                  "flex flex-col items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700",
                  "bg-white dark:bg-gray-900",
                  "hover:shadow-md hover:border-[#2196F3] transition-all duration-300"
                )}
              >
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <Icon className="h-5 w-5 text-[#F57C00]" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 leading-snug">
                  {t(`services.${service.key}.title`)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {t(`services.${service.key}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button
            className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 h-11"
            asChild
          >
            <Link href="/booking">{t("bookButton")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, Bot, Users } from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import { hubConfig } from "@/lib/community-config";

export function HubSection() {
  const t = useTranslations("hubSection");
  const features = t.raw("features") as string[];

  return (
    <section className="py-16 bg-gradient-to-br from-[#2196F3]/5 to-[#F57C00]/5 dark:from-blue-950/30 dark:to-orange-950/20">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          {/* Left: description + CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
              {t("description")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="bg-[#2196F3] hover:bg-blue-500 text-white gap-2 h-11 px-6"
                asChild
              >
                <a href={hubConfig.hubUrl} target="_blank" rel="noopener noreferrer">
                  <Users className="h-4 w-4" aria-hidden="true" />
                  {t("joinHub")}
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-[#2196F3] text-[#2196F3] hover:bg-blue-50 dark:hover:bg-blue-950/30 gap-2 h-11 px-6"
                asChild
              >
                <a href={hubConfig.telegramBotUrl} target="_blank" rel="noopener noreferrer">
                  <Bot className="h-4 w-4" aria-hidden="true" />
                  {t("openBot")}
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Right: feature grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3"
          >
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
              >
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" aria-hidden="true" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

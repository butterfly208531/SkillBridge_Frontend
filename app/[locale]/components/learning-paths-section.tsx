"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code2, Database } from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { cn } from "@/lib/utils";

const paths = [
  {
    id: "softwareEngineering",
    icon: Code2,
    color: "#2196F3",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    stepColors: ["#2196F3", "#E91E8C", "#00BCD4", "#212121"],
  },
  {
    id: "erpConsultant",
    icon: Database,
    color: "#F57C00",
    borderColor: "border-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    stepColors: ["#F57C00", "#E91E8C", "#00BCD4", "#212121"],
  },
] as const;

export function LearningPathsSection() {
  const t = useTranslations("learningPaths");

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {paths.map((path, pi) => {
            const steps = t.raw(`${path.id}.steps`) as string[];
            const Icon = path.icon;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: pi * 0.15 }}
                viewport={{ once: true }}
                className={cn(
                  "rounded-2xl border-2 p-6 shadow-sm hover:shadow-xl transition-all duration-300",
                  path.bgColor,
                  path.borderColor
                )}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={cn("p-2.5 rounded-xl", path.iconBg)}>
                    <Icon className={cn("h-5 w-5", path.iconColor)} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-gray-50">
                    {t(`${path.id}.title`)}
                  </h3>
                </div>

                {/* Snake roadmap steps */}
                <div className="flex flex-col gap-0">
                  {steps.slice(0, -1).map((step, si) => {
                    const color = path.stepColors[si % path.stepColors.length];
                    const isEven = si % 2 === 0;
                    return (
                      <div key={si} className="relative">
                        {/* Step pill */}
                        <motion.div
                          initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: pi * 0.1 + si * 0.08 }}
                          viewport={{ once: true }}
                          className="flex items-center gap-3 py-3 px-4 rounded-full border-2 my-1"
                          style={{ borderColor: color, backgroundColor: `${color}12` }}
                        >
                          {/* Step circle with icon */}
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            {si + 1}
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {step}
                          </span>
                        </motion.div>

                        {/* Connector line — curved snake-like */}
                        {si < steps.length - 2 && (
                          <div
                            className="w-5 h-4 ml-4 rounded-bl-full border-b-2 border-l-2"
                            style={{ borderColor: path.stepColors[(si + 1) % path.stepColors.length] }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Outcome badge */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    {t("outcome")}:
                  </span>
                  <span className={cn("text-xs font-bold rounded-md px-2 py-1", path.badgeColor)}>
                    {t(`${path.id}.outcome`)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

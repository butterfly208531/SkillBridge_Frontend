"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Code2, Database, Brain, GraduationCap, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { cn } from "@/lib/utils";

const paths = [
  {
    id: "softwareEngineering",
    icon: Code2,
    gradient: "from-blue-500 to-cyan-400",
    border: "border-blue-200 hover:border-blue-400 dark:border-blue-800 dark:hover:border-blue-500",
    badge: "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    glow: "hover:shadow-blue-100 dark:hover:shadow-blue-900/20",
    stepDot: "bg-blue-500",
    stepLine: "bg-blue-200 dark:bg-blue-800",
    cardBg: "bg-blue-50/60 dark:bg-blue-950/30",
  },
  {
    id: "erpConsultant",
    icon: Database,
    gradient: "from-orange-500 to-amber-400",
    border: "border-orange-200 hover:border-orange-400 dark:border-orange-800 dark:hover:border-orange-500",
    badge: "bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    glow: "hover:shadow-orange-100 dark:hover:shadow-orange-900/20",
    stepDot: "bg-orange-500",
    stepLine: "bg-orange-200 dark:bg-orange-800",
    cardBg: "bg-orange-50/60 dark:bg-orange-950/30",
  },
  {
    id: "aiEngineer",
    icon: Brain,
    gradient: "from-purple-500 to-pink-400",
    border: "border-purple-200 hover:border-purple-400 dark:border-purple-800 dark:hover:border-purple-500",
    badge: "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    glow: "hover:shadow-purple-100 dark:hover:shadow-purple-900/20",
    stepDot: "bg-purple-500",
    stepLine: "bg-purple-200 dark:bg-purple-800",
    cardBg: "bg-purple-50/60 dark:bg-purple-950/30",
  },
  {
    id: "studyAbroad",
    icon: GraduationCap,
    gradient: "from-green-500 to-emerald-400",
    border: "border-green-200 hover:border-green-400 dark:border-green-800 dark:hover:border-green-500",
    badge: "bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    glow: "hover:shadow-green-100 dark:hover:shadow-green-900/20",
    stepDot: "bg-green-500",
    stepLine: "bg-green-200 dark:bg-green-800",
    cardBg: "bg-green-50/60 dark:bg-green-950/30",
  },
] as const;

export function LearningPathsSection() {
  const t = useTranslations("learningPaths");
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {paths.map((path, i) => {
            const steps = t.raw(`${path.id}.steps`) as string[];
            const Icon = path.icon;
            const isActive = activeCard === path.id;

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setActiveCard(path.id)}
                onMouseLeave={() => setActiveCard(null)}
                className={cn(
                  "relative flex flex-col rounded-2xl border-2 overflow-hidden",
                  path.cardBg,
                  "transition-all duration-300",
                  path.border,
                  isActive ? "shadow-xl scale-[1.02]" : "shadow-sm",
                  path.glow
                )}
              >
                {/* Top gradient bar */}
                <div className={cn("h-1.5 w-full bg-gradient-to-r", path.gradient)} />

                <div className="p-5 flex flex-col flex-1">
                  {/* Icon + Title */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className={cn("p-2.5 rounded-xl", path.iconBg)}>
                      <Icon className={cn("h-5 w-5", path.iconColor)} aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-50 leading-tight">
                      {t(`${path.id}.title`)}
                    </h3>
                  </div>

                  {/* Steps with visual connector */}
                  <ol className="flex flex-col gap-0 flex-1">
                    {steps.slice(0, -1).map((step, si) => {
                      const isLast = si === steps.length - 2;
                      return (
                        <li key={si} className="flex gap-3">
                          {/* Dot + line */}
                          <div className="flex flex-col items-center">
                            <div className={cn("w-2 h-2 rounded-full shrink-0 mt-1", path.stepDot)} />
                            {!isLast && (
                              <div className={cn("w-0.5 flex-1 my-0.5 min-h-[16px]", path.stepLine)} />
                            )}
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 pb-2 leading-snug">
                            {step}
                          </span>
                        </li>
                      );
                    })}
                  </ol>

                  {/* Final step — career outcome */}
                  <div className={cn(
                    "mt-3 pt-3 border-t border-gray-100 dark:border-gray-800",
                    "flex items-center gap-2"
                  )}>
                    <ArrowRight className={cn("h-4 w-4 shrink-0", path.iconColor)} aria-hidden="true" />
                    <span className={cn("text-xs font-bold rounded-md px-2 py-1", path.badge)}>
                      {t(`${path.id}.outcome`)}
                    </span>
                  </div>

                  {/* Career outcome label */}
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mt-2">
                    {t("outcome")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

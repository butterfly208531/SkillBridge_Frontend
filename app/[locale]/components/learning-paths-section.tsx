"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  BookOpen, Rocket, Cpu, Briefcase, Brain,
  GraduationCap, Network, Globe, Layers, FlaskConical,
} from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";

const STEP_ICONS = [BookOpen, Rocket, Cpu, Briefcase, Brain, GraduationCap, Network, FlaskConical, Globe, Layers];

const STEP_COLORS = [
  "#C8A96E", // gold/brown
  "#D63384", // pink/magenta
  "#20B2AA", // teal
  "#555555", // dark gray
  "#2196F3", // blue
  "#F57C00", // orange
];

const paths = [
  { id: "softwareEngineering", outcomeColor: "#2196F3" },
  { id: "erpConsultant", outcomeColor: "#F57C00" },
] as const;

function SnakePath({ pathId, outcomeColor }: { pathId: string; outcomeColor: string }) {
  const t = useTranslations("learningPaths");
  const allSteps = t.raw(`${pathId}.steps`) as string[];
  const steps = allSteps.slice(0, -1);

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <h3 className="text-lg font-bold mb-8 text-center" style={{ color: outcomeColor }}>
        {t(`${pathId}.title`)}
      </h3>

      <div className="relative w-full flex flex-col gap-0">
        {steps.map((step, si) => {
          const color = STEP_COLORS[si % STEP_COLORS.length];
          const Icon = STEP_ICONS[si % STEP_ICONS.length];
          const isEven = si % 2 === 0;

          return (
            <div key={si} className="relative">
              {/* Pill */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: si * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-center bg-white dark:bg-gray-800 shadow-lg"
                style={{
                  borderRadius: "999px",
                  border: `4px solid ${color}`,
                  minHeight: "80px",
                  padding: "10px 12px",
                }}
              >
                {/* Icon circle — alternates side */}
                {!isEven && (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-white dark:bg-gray-700 shadow-md mr-3"
                    style={{ border: `3px solid ${color}` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                )}

                <div className="flex-1 px-1">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color }}>
                    STEP {String(si + 1).padStart(2, "0")}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug">
                    {step}
                  </p>
                </div>

                {isEven && (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-white dark:bg-gray-700 shadow-md ml-3"
                    style={{ border: `3px solid ${color}` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                )}
              </motion.div>

              {/* Snake connector */}
              {si < steps.length - 1 && (
                <div className="relative h-10 w-full" aria-hidden="true">
                  <svg viewBox="0 0 220 40" className="w-full h-full" preserveAspectRatio="none">
                    {isEven ? (
                      <path
                        d="M 180 0 C 220 0 220 40 180 40"
                        fill="none"
                        stroke={STEP_COLORS[(si + 1) % STEP_COLORS.length]}
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    ) : (
                      <path
                        d="M 40 0 C 0 0 0 40 40 40"
                        fill="none"
                        stroke={STEP_COLORS[(si + 1) % STEP_COLORS.length]}
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
              )}
            </div>
          );
        })}

        {/* Outcome badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: steps.length * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mt-6 gap-2"
        >
          <div className="h-px flex-1 opacity-30" style={{ backgroundColor: outcomeColor }} />
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-lg"
            style={{ backgroundColor: outcomeColor }}
          >
            <GraduationCap className="h-4 w-4" />
            {t(`${pathId}.outcome`)}
          </div>
          <div className="h-px flex-1 opacity-30" style={{ backgroundColor: outcomeColor }} />
        </motion.div>
      </div>
    </div>
  );
}

export function LearningPathsSection() {
  const t = useTranslations("learningPaths");

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mt-8">
          {paths.map((path) => (
            <SnakePath key={path.id} pathId={path.id} outcomeColor={path.outcomeColor} />
          ))}
        </div>
      </div>
    </section>
  );
}

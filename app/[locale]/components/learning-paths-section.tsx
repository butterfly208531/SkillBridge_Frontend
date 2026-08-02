"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Code2, Database, Rocket, Globe, Brain, Layers,
  GraduationCap, Briefcase, BookOpen, FlaskConical,
  Network, Cpu,
} from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";

// Colors are set per-path using brand color only

// Icons to cycle through for each step
const STEP_ICONS = [BookOpen, Rocket, Cpu, Briefcase, Brain, GraduationCap, Network, FlaskConical, Globe, Layers];

const paths = [
  { id: "softwareEngineering", titleColor: "#2196F3", outcomeColor: "#2196F3" },
  { id: "erpConsultant",       titleColor: "#F57C00", outcomeColor: "#F57C00" },
] as const;

function SnakePath({ pathId, titleColor, outcomeColor }: { pathId: string; titleColor: string; outcomeColor: string }) {
  const t = useTranslations("learningPaths");
  const allSteps = t.raw(`${pathId}.steps`) as string[];
  // exclude the last item (it's the outcome/job title)
  const steps = allSteps.slice(0, -1);

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Path title */}
      <h3 className="text-lg font-bold mb-6 text-center" style={{ color: titleColor }}>
        {t(`${pathId}.title`)}
      </h3>

      <div className="relative w-full flex flex-col gap-0">
        {steps.map((step, si) => {
          // Alternate between blue and orange per step
          const stepColor = si % 2 === 0 ? "#2196F3" : "#F57C00";
          const color = { border: stepColor, icon: stepColor };
          const Icon = STEP_ICONS[si % STEP_ICONS.length];
          const isEven = si % 2 === 0; // even = icon on right, odd = icon on left

          return (
            <div key={si} className="relative">
              {/* Pill step */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: si * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-center rounded-full shadow-md"
                style={{
                  border: `3px solid ${color.border}`,
                  backgroundColor: "#ffffff",
                  minHeight: "72px",
                  padding: "10px 16px",
                }}
              >
                {/* Icon circle — alternates side */}
                {!isEven && (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm mr-4 bg-white border-2"
                    style={{ borderColor: color.border }}
                  >
                    <Icon className="h-5 w-5" style={{ color: color.icon }} aria-hidden="true" />
                  </div>
                )}

                {/* Text content */}
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: color.border }}>
                    STEP {String(si + 1).padStart(2, "0")}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug mt-0.5">
                    {step}
                  </p>
                </div>

                {isEven && (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ml-4 bg-white border-2"
                    style={{ borderColor: color.border }}
                  >
                    <Icon className="h-5 w-5" style={{ color: color.icon }} aria-hidden="true" />
                  </div>
                )}
              </motion.div>

              {/* Snake connector between steps */}
              {si < steps.length - 1 && (() => {
                const connectorColor = si % 2 === 0 ? "#2196F3" : "#F57C00";
                return (
                  <div className="relative h-8 w-full" aria-hidden="true">
                    {isEven ? (
                      <svg viewBox="0 0 200 32" className="w-full h-full" preserveAspectRatio="none">
                        <path
                          d="M 160 0 Q 190 16 160 32"
                          fill="none"
                          stroke={connectorColor}
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 200 32" className="w-full h-full" preserveAspectRatio="none">
                        <path
                          d="M 40 0 Q 10 16 40 32"
                          fill="none"
                          stroke={connectorColor}
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })}

        {/* Career outcome badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: steps.length * 0.1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mt-4 gap-2"
        >
          <div className="h-px flex-1" style={{ backgroundColor: outcomeColor, opacity: 0.3 }} />
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-bold shadow-md"
            style={{ backgroundColor: outcomeColor }}
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            {t(`${pathId}.outcome`)}
          </div>
          <div className="h-px flex-1" style={{ backgroundColor: outcomeColor, opacity: 0.3 }} />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mt-4">
          {paths.map((path) => (
            <SnakePath
              key={path.id}
              pathId={path.id}
              titleColor={path.titleColor}
              outcomeColor={path.outcomeColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

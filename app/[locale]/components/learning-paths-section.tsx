"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Search, Rocket, DollarSign, Trophy, Brain,
  GraduationCap, Network, Zap, Globe, Layers, Code2, Database,
} from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";

const STEP_ICONS = [Search, Rocket, DollarSign, Trophy, Brain, GraduationCap, Network, Zap, Globe, Layers, Code2, Database];
const COLORS = ["#2196F3", "#F57C00"];

const paths = [
  { id: "softwareEngineering", titleColor: "#2196F3", outcomeColor: "#2196F3" },
  { id: "erpConsultant",       titleColor: "#F57C00", outcomeColor: "#F57C00" },
] as const;

function SnakePath({ pathId, titleColor, outcomeColor }: { pathId: string; titleColor: string; outcomeColor: string }) {
  const t = useTranslations("learningPaths");
  const allSteps = t.raw(`${pathId}.steps`) as string[];
  const steps = allSteps.slice(0, -1);

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <h3 className="text-base font-bold mb-6 text-center" style={{ color: titleColor }}>
        {t(`${pathId}.title`)}
      </h3>

      <div className="relative w-full flex flex-col gap-0">
        {steps.map((step, si) => {
          const color = COLORS[si % 2];
          const Icon = STEP_ICONS[si % STEP_ICONS.length];
          const isEven = si % 2 === 0; // icon on right, odd = icon on left

          return (
            <div key={si} className="relative">
              {/* Outer colored track */}
              <motion.div
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: si * 0.1 }}
                viewport={{ once: true }}
                className="relative"
                style={{ padding: "6px", borderRadius: "50px", backgroundColor: color }}
              >
                {/* Inner white pill */}
                <div
                  className="relative flex items-center bg-white dark:bg-gray-50 shadow-inner"
                  style={{ borderRadius: "44px", minHeight: "68px", padding: "8px 10px" }}
                >
                  {/* Icon circle on left for odd */}
                  {!isEven && (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-white shadow-md border-2 mr-3"
                      style={{ borderColor: color }}
                    >
                      <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex-1 px-2">
                    <p className="text-sm font-bold text-gray-800 leading-snug">{step}</p>
                  </div>

                  {/* Icon circle on right for even */}
                  {isEven && (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 bg-white shadow-md border-2 ml-3"
                      style={{ borderColor: color }}
                    >
                      <Icon className="h-6 w-6" style={{ color }} />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Snake connector */}
              {si < steps.length - 1 && (
                <div className="relative h-10 w-full" aria-hidden="true">
                  {isEven ? (
                    <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M 150 0 Q 198 20 150 40"
                        fill="none"
                        stroke={COLORS[(si + 1) % 2]}
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 200 40" className="w-full h-full" preserveAspectRatio="none">
                      <path
                        d="M 50 0 Q 2 20 50 40"
                        fill="none"
                        stroke={COLORS[(si + 1) % 2]}
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
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
          <div className="h-0.5 flex-1 rounded" style={{ backgroundColor: outcomeColor, opacity: 0.4 }} />
          <div
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-bold shadow-lg"
            style={{ backgroundColor: outcomeColor }}
          >
            <GraduationCap className="h-4 w-4" />
            {t(`${pathId}.outcome`)}
          </div>
          <div className="h-0.5 flex-1 rounded" style={{ backgroundColor: outcomeColor, opacity: 0.4 }} />
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
            <SnakePath key={path.id} pathId={path.id} titleColor={path.titleColor} outcomeColor={path.outcomeColor} />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import ScholarshipCard from "@/app/[locale]/components/ui/scholarship-card";
import { scholarshipsConfig, scholarshipWinnersConfig } from "@/lib/scholarships-config";

export function ScholarshipsSection() {
  const t = useTranslations("scholarshipsSection");

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        {/* Scholarship cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {scholarshipsConfig.map((scholarship, i) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <ScholarshipCard
                id={scholarship.id}
                name={t(`scholarships.${scholarship.nameKey}.name`)}
                applicationsCount={scholarship.applicationsCount}
                deadline={scholarship.deadline}
                winnersCount={scholarship.winnersCount}
                eligibility={t(`scholarships.${scholarship.eligibilityKey}.eligibility`)}
                courseId={scholarship.courseId}
              />
            </motion.div>
          ))}
        </div>

        {/* Previous winners */}
        <div>
          <h3 className="text-center text-xl font-semibold text-gray-900 dark:text-gray-50 mb-6">
            {t("previousWinners")}
          </h3>
          <div className="flex flex-wrap justify-center gap-6">
            {scholarshipWinnersConfig.map((winner, i) => (
              <motion.div
                key={winner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#2196F3]">
                  <Image
                    src={winner.image}
                    alt={`${winner.name} scholarship winner`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{winner.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{winner.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

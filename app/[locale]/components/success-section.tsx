"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/app/[locale]/components/ui/count-up";
import { SectionHeading } from "./ui/section-heading";
import React from "react";
import { useTranslations } from "next-intl";
import { SuccessMetricsConfig } from "@/lib/success-config";

export function SuccessSection() {
  const t = useTranslations();

  const metricsList = t.raw("success.successMetrics") as Record<
    string,
    { value: string; label: string }
  >;

  const processedMetrics = SuccessMetricsConfig.map((config) => {
    const metricData = metricsList[config.key] || { value: "0", label: "" };
    const { value, label } = metricData;

    // Extract numeric part and suffix
    let numericValue: string | number = "";
    let suffix = "";

    const match = value.match(/^(\d+)(.*)$/);
    if (match) {
      numericValue = parseInt(match[1], 10);
      suffix = match[2];
    } else {
      numericValue = 0;
    }

    return {
      ...config,
      label,
      numericValue,
      suffix,
    };
  });

  return (
    <section className='py-16 dark:bg-gray-950'>
      <div className='container mx-auto px-4'>
        <SectionHeading
          title={t("success.title")}
          subtitle={t("success.subtitle")}
          center={true}
        />

        <div className='grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto py-4'>
          {processedMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className='text-center'
            >
              <div className=' flex items-center justify-center mx-auto mb-4'>
                {metric.icon && (
                  <metric.icon className='h-4 w-4 md:h-5 md:w-5 lg:h-7 lg:w-7 xl:h-8 xl:w-8 text-[#2396F3]' />
                )}
              </div>
              <CountUp
                end={metric.numericValue}
                suffix={metric.suffix}
                duration={2.5}
                className={`text-xl sm:text-2xl md:text-[27px] xl:text-3xl font-bold text-[#F57C00] mb-2`}
              />
              <p className='!text-[#646464]dark:text-[#2396F3]/80 text-sm md:text-base xl:text-lg tracking-wide font-semibold'>
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

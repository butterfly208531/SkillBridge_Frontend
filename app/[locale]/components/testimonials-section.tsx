"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { TestimonialsConfig } from "@/lib/testimonial-config";

const testimonialImages = [
  "/images/testimonials/pp1.png",
  "/images/testimonials/pp2.png",
  "/images/testimonials/pp3.png",
];

export function TestimonialsSection() {
  const t = useTranslations("successSection");
  const testimonials = t.raw("testimonials") as Record<
    string,
    { name: string; course: string; position: string; testimonial: string }
  >;

  const entries = Object.entries(testimonials).map(([, data], i) => ({
    ...data,
    image: testimonialImages[i % testimonialImages.length],
  }));

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4 p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <Quote className="h-6 w-6 text-[#2196F3] opacity-60" aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                &ldquo;{entry.testimonial}&rdquo;
              </p>
              <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                  <Image
                    src={entry.image}
                    alt={`${entry.name} photo`}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{entry.name}</p>
                  <p className="text-xs text-[#2196F3]">{entry.course}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{entry.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

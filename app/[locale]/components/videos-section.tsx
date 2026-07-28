"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, CalendarDays, Play } from "lucide-react";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { Button } from "@/app/[locale]/components/ui/button";
import { videosConfig } from "@/lib/videos-config";
import { hubConfig } from "@/lib/community-config";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function VideosSection() {
  const t = useTranslations("videosSection");

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videosConfig.slice(0, 6).map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true }}
              className="flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Thumbnail */}
              <div className="relative h-44 w-full overflow-hidden group">
                <Image
                  src={video.thumbnail}
                  alt={`${t(`videos.${video.titleKey}.title`)} thumbnail`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <Play className="h-5 w-5 text-[#2196F3] fill-[#2196F3]" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 line-clamp-2 leading-snug">
                  {t(`videos.${video.titleKey}.title`)}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {t(`videos.${video.descriptionKey}.description`)}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {video.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" aria-hidden="true" />
                    {formatDate(video.publishDate)}
                  </span>
                </div>

                <div className="flex-1" />

                <Button
                  size="sm"
                  className="w-full bg-[#2196F3] hover:bg-blue-500 text-white mt-2"
                  asChild
                >
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    {t("watch")}
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button variant="outline" className="border-[#2196F3] text-[#2196F3] hover:bg-blue-50 dark:hover:bg-blue-950/30 px-8 h-11" asChild>
            <a href={hubConfig.youtubeUrl} target="_blank" rel="noopener noreferrer">
              {t("viewAll")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

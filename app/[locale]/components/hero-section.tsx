"use client";

import Image from "next/image";
import { Button } from "@/app/[locale]/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CountUp } from "@/app/[locale]/components/ui/count-up";
import { Monitor, Video, Users } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  const floatingStats = [
    { icon: Monitor, value: "15+", label: "Online Courses",  position: "top-right" },
    { icon: Video,   value: "10+", label: "Video Courses",   position: "middle-left" },
    { icon: Users,   value: "20+", label: "Instructors",     position: "bottom-right" },
  ];

  return (
    <section className="container !mx-auto px-4 lg:px-0 lg:pl-8 pt-6 pb-16 relative flex gap-12 justify-center items-center">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-16 xl:gap-[10rem] 2xl:gap-64 items-center w-full">

        {/* Left column */}
        <div className="hero_left_section pt-4 md:pt-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-[3.2rem] xl:text-6xl 2xl:text-7xl font-montserrat font-extrabold leading-tight text-center md:text-left"
          >
            <span className="text-[#2196F3]">{t("span1")} {t("span2")}</span>
            <br />
            <span className="text-[#2196F3]">{t("span3")}</span>
            <br />
            <span className="text-[#F57C00]">{t("span4")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mt-6 text-sm md:text-base 2xl:text-lg text-center md:text-left"
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start"
          >
            <Button
              className="bg-[#2196F3] hover:bg-blue-500 text-white h-11 px-8 rounded-md font-semibold transition-transform hover:scale-105"
              asChild
            >
              <Link href="/signup">{t("getStarted")}</Link>
            </Button>

            <Button
              className="bg-[#F57C00] hover:bg-orange-500 text-white h-11 px-8 rounded-md font-semibold transition-transform hover:scale-105"
              asChild
            >
              <Link href="/contact">{t("contact")}</Link>
            </Button>
          </motion.div>
        </div>

        {/* Right column — circular image with floating cards */}
        <div className="hero_right_section relative hidden md:flex justify-center items-center mt-4">
          {/* Circle image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="w-[300px] h-[300px] lg:w-[380px] lg:h-[380px] xl:w-[420px] xl:h-[420px] 2xl:w-[490px] 2xl:h-[490px] rounded-full overflow-hidden border-2 border-[#2196F3]/30 shadow-xl"
          >
            <Image
              src="/images/hero/students-learning.jpg"
              alt="Students learning together at SkillBridge"
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          </motion.div>

          {/* Floating card — top right: Online Courses */}
          <motion.div
            initial={{ opacity: 0, x: 40, y: -40 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -top-4 right-0 lg:right-4 bg-white dark:bg-gray-800 rounded-xl p-3 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center min-w-[80px]"
          >
            {/* Spinner ring */}
            <div className="relative w-10 h-10 mb-1">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-gray-700" />
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#2196F3]"
                style={{ animation: "spin 2s linear infinite" }}
              />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">15+</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-0.5">Online Courses</span>
          </motion.div>

          {/* Floating card — middle left: Video Courses */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 -left-6 lg:-left-16 bg-white dark:bg-gray-800 rounded-xl px-3 py-3 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#2196F3] flex items-center justify-center shrink-0">
              <Monitor className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-base font-bold text-[#F57C00] leading-none">10+</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Video Courses</div>
            </div>
          </motion.div>

          {/* Floating card — bottom right: Instructors */}
          <motion.div
            initial={{ opacity: 0, y: 40, x: 40 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute bottom-0 right-0 lg:right-4 bg-white dark:bg-gray-800 rounded-xl px-3 py-3 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#2196F3] flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-base font-bold text-gray-900 dark:text-white leading-none">20+</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">Instructors</div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Spin animation keyframe */}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

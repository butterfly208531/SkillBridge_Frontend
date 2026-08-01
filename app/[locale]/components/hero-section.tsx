"use client";

import Image from "next/image";
import { Button } from "@/app/[locale]/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { CountUp } from "@/app/[locale]/components/ui/count-up";

type StatCard = {
  label: string;
  value: string;
  title?: string;
};

export function HeroSection() {
  const t = useTranslations("hero");
  const stats = t.raw("statCards") as StatCard[];

  return (
    <section className="container !mx-auto px-4 lg:px-0 lg:pl-8 pb-16 relative flex gap-12 justify-center items-center">
      <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-16 xl:gap-[13rem] 2xl:gap-72 min-[1710px]:gap-80 items-center">
        {/* Left column: text content */}
        <div className="hero_left_section pt-8 md:pt-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl min-[1710px]:text-[5rem] font-montserrat font-bold lg:font-extrabold leading-tight dark:text-white text-center md:text-left"
          >
            {t("headline")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mt-4 2xl:mt-8 text-sm md:text-lg 2xl:text-xl text-center md:text-left pt-8 md:pt-12"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap gap-4 mt-8 2xl:mt-12 justify-center md:justify-start 2xl:gap-12 min-[1710px]:gap-16"
          >
            {/* Primary CTA: Register Now → /courses */}
            <Button
              className="bg-[#2196F3] hover:bg-blue-500 dark:hover:bg-[#2196F3]/70 dark:text-white h-11 px-8 transition-transform hover:scale-105 scale-96 sm:scale-100 2xl:scale-110 min-[1710px]:h-14 min-[1710px]:text-lg"
              asChild
            >
              <Link href="/courses">{t("registerNow")}</Link>
            </Button>

            {/* Secondary CTA: Explore Bootcamps → /courses */}
            <Button
              variant="outline"
              className="bg-[#F57C00] text-white border-blue-100 hover:bg-orange-500 hover:text-white h-11 px-8 dark:bg-[#F57C00] dark:border-blue-800/30 dark:text-white dark:hover:bg-orange-500 transition-transform hover:scale-105 scale-96 sm:scale-100 2xl:scale-110 min-[1710px]:h-14 min-[1710px]:text-lg"
              asChild
            >
              <Link href="/courses">{t("exploreBootcamps")}</Link>
            </Button>
          </motion.div>


        </div>

        {/* Right column: hero image — hidden on mobile */}
        <div className="hero_right_section relative hidden md:block ml-12 lg:ml-0 mt-2 md:mt-8 lg:mt-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] xl:w-[460px] xl:h-[460px] 2xl:w-[540px] 2xl:h-[540px] min-[1710px]:h-[600px] min-[1710px]:w-[600px] rounded-full border-[1px] border-[#2196F3] overflow-hidden"
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

          {/* Floating stat card — top right */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -50 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -top-6 right-0 lg:-top-4 lg:right-20 2xl:right-28 2xl:top-6 min-[1710px]:right-20 bg-white dark:bg-gray-800 rounded-xl py-4 px-2 flex flex-col items-center shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2196F3]/80"
          >
            <div className="relative w-12 h-12 mb-2">
              <div className="absolute inset-0 rounded-full border-4"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
                style={{ transform: "rotate(45deg)" }}
              ></div>
            </div>
            <CountUp
              end={stats[0]?.value ?? "0"}
              className="md:text-xl lg:text-2xl 2xl:text-3xl font-bold text-gray-900 dark:text-white"
            />
            <p className="text-gray-500 dark:text-gray-400 !text-[10px] lg:text-sm 2xl:text-base text-center">
              {stats[0]?.label}
            </p>
          </motion.div>

          {/* Floating stat card — left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute top-1/2 -translate-y-1/2 -left-20 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl flex items-center gap-3 hover:shadow-2xl transition-all duration-300 border border-[#2196F3]/80"
          >
            <div className="w-10 h-10 rounded-lg bg-[#2196F3] flex items-center justify-center">
              <Image
                src="/images/hero/online.svg"
                alt="Online courses icon"
                width={32}
                height={32}
              />
            </div>
            <div>
              <CountUp
                end={stats[1]?.value ?? "0"}
                className="md:text-xl lg:text-2xl 2xl:text-3xl font-bold text-gray-800 dark:text-white"
              />
              <div className="text-gray-500 dark:text-gray-400 !text-[10px] lg:text-sm 2xl:text-base">
                {stats[1]?.label}
              </div>
            </div>
          </motion.div>

          {/* Floating stat card — bottom right */}
          <motion.div
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="absolute bottom-4 -right-6 lg:bottom-8 lg:right-8 2xl:right-24 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl flex items-center gap-3 hover:shadow-2xl transition-all duration-300 border border-[#2196F3]/80"
          >
            <div className="w-10 h-10 rounded-lg bg-[#2196F3] flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
                aria-hidden="true"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <CountUp
                end={stats[2]?.value ?? "0"}
                className="md:text-xl lg:text-2xl 2xl:text-3xl font-bold text-gray-800 dark:text-white"
              />
              <div className="text-gray-500 dark:text-gray-400 !text-[10px] lg:text-sm 2xl:text-base">
                {stats[2]?.label}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/app/[locale]/components/ui/button";

export function FinalCTASection() {
  const t = useTranslations("finalCTA");

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#93c5fd] to-[#1E90FF] dark:from-gray-900 dark:via-blue-900 dark:to-blue-950 relative overflow-hidden">
      {/* Orange accent blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F57C00] opacity-20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F57C00] opacity-15 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow mb-6 leading-tight">
            <span className="inline-block bg-[#F57C00] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Take the next step
            </span>
            <br />
            {t("headline")}
          </h2>
          <p className="text-white/90 text-base sm:text-lg mb-10 leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#4285F4] hover:bg-blue-50 font-semibold h-12 px-8 shadow-lg transition-all" asChild>
              <Link href="/courses">{t("registerBootcamp")}</Link>
            </Button>
            <Button size="lg" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#4285F4] font-semibold h-12 px-8 transition-all" asChild>
              <Link href="/contact">{t("contactAdmissions")}</Link>
            </Button>
            <Button size="lg" className="bg-[#F57C00] hover:bg-orange-500 text-white font-semibold h-12 px-8 shadow-lg transition-all" asChild>
              <Link href="/courses">{t("explorePrograms")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

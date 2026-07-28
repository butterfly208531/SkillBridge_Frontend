"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/app/[locale]/components/ui/button";

export function FinalCTASection() {
  const t = useTranslations("finalCTA");

  return (
    <section className="py-20 bg-gradient-to-r from-[#2196F3] to-[#1565C0] dark:from-blue-900 dark:to-blue-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#F57C00] rounded-full filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {t("headline")}
          </h2>
          <p className="text-blue-100 text-base sm:text-lg mb-10 leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-[#2196F3] hover:bg-blue-50 font-semibold h-12 px-8 shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/courses">{t("registerBootcamp")}</Link>
            </Button>
            <Button
              size="lg"
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#2196F3] font-semibold h-12 px-8 transition-all"
              asChild
            >
              <Link href="/contact">{t("contactAdmissions")}</Link>
            </Button>
            <Button
              size="lg"
              className="bg-[#F57C00] hover:bg-orange-500 text-white font-semibold h-12 px-8 shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/courses">{t("explorePrograms")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

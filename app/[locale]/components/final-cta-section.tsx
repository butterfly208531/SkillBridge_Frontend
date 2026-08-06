"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/app/[locale]/components/ui/button";

export function FinalCTASection() {
  const t = useTranslations("finalCTA");

  return (
    <div className="bg-[#1E90FF] px-4 pt-0 pb-0 -mb-1">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative bg-[#2196F3] rounded-2xl overflow-hidden px-8 py-14 text-center max-w-4xl mx-auto shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #1565C0 0%, #2196F3 60%, #42a5f5 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <span className="inline-block bg-[#F57C00] text-white text-xs font-bold px-3 py-1 rounded-full mb-5 tracking-wide uppercase">
              Take the next step
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              {t("headline")}
            </h2>
            <p className="text-white/85 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              {t("description")}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" className="bg-white text-[#1565C0] hover:bg-blue-50 font-bold h-11 px-7 shadow-md" asChild>
                <Link href="/courses">{t("registerBootcamp")}</Link>
              </Button>
              <Button size="lg" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1565C0] font-bold h-11 px-7 transition-all" asChild>
                <Link href="/contact">{t("contactAdmissions")}</Link>
              </Button>
              <Button size="lg" className="bg-[#F57C00] hover:bg-orange-500 text-white font-bold h-11 px-7 shadow-md" asChild>
                <Link href="/courses">{t("explorePrograms")}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

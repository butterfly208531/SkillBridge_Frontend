"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Button } from "@/app/[locale]/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  const t = useTranslations("finalCTA");

  return (
    <section className="py-12 px-4 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden px-8 py-16 text-center"
          style={{
            background: "linear-gradient(135deg, #1E90FF 0%, #1565C0 60%, #0D47A1 100%)",
          }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-8 w-24 h-24 rounded-full bg-white/5 -translate-y-1/2" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              {t("headline")}
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-10 leading-relaxed">
              {t("description")}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#1565C0] hover:bg-blue-50 font-bold h-12 px-8 shadow-lg rounded-full transition-all"
                asChild
              >
                <Link href="/courses">
                  {t("explorePrograms")} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1565C0] font-bold h-12 px-8 rounded-full transition-all"
                asChild
              >
                <Link href="/contact">{t("contactAdmissions")}</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

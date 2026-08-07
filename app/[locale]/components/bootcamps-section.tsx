"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import BootcampCard from "@/app/[locale]/components/ui/bootcamp-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { fetchCourses, type Course } from "@/lib/apI";
import { imagePaths } from "@/app/[locale]/data/image-paths";

// Static fallback — used only if API is down
const FALLBACK_BOOTCAMPS = [
  { id: "odoo-functional-erp", image: imagePaths.courses.design, title: "Odoo Functional ERP", shortDescription: "Master Odoo ERP modules — CRM, Sales, Inventory, HR, Accounting and more with real business scenarios.", duration: "8 weeks", startDate: "Aug 2025", mode: "Online" as const, level: "Beginner", category: { name: "ERP" }, rating: 4.7, studentsEnrolled: 40, imageUrl: imagePaths.courses.design },
  { id: "odoo-technical-development", image: imagePaths.courses.machineLearning, title: "Odoo Technical Development", shortDescription: "Build custom Odoo modules from scratch — models, views, ORM, reports, and deployment.", duration: "8 weeks", startDate: "Aug 2025", mode: "Online" as const, level: "Intermediate", category: { name: "ERP" }, rating: 4.9, studentsEnrolled: 50, imageUrl: imagePaths.courses.machineLearning },
  { id: "full-stack-development", image: imagePaths.courses.webDevelopment, title: "Full-Stack Development", shortDescription: "Learn React, Node.js, PostgreSQL and build 16+ real-world projects for your portfolio.", duration: "4 months", startDate: "Aug 2025", mode: "Online" as const, level: "Beginner", category: { name: "Development" }, rating: 4.8, studentsEnrolled: 50, imageUrl: imagePaths.courses.webDevelopment },
];

function courseToCardProps(c: any) {
  return {
    id: c.id || c._id || "",
    image: c.imageUrl || c.image || "",
    title: c.title || "",
    description: c.shortDescription || c.description || "",
    duration: c.duration || "",
    startDate: c.startDate ? new Date(c.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : undefined,
    mode: c.mode,
    level: c.level,
    category: c.category?.name || c.category || "",
    rating: c.rating,
    reviews: c.studentsEnrolled || c.reviews,
  };
}

export function BootcampsSection() {
  const t = useTranslations("bootcampsSection");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses()
      .then(data => setCourses(data.length > 0 ? data : FALLBACK_BOOTCAMPS))
      .catch(() => setCourses(FALLBACK_BOOTCAMPS))
      .finally(() => setLoading(false));
  }, []);

  const visible = courses.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 items-stretch">
            {visible.map((course, i) => (
              <motion.div
                key={course.id || course._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="h-full"
              >
                <BootcampCard {...courseToCardProps(course)} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Button
            className="bg-[#2196F3] hover:bg-[#1976D2] text-white px-8 h-11 transition-colors duration-200"
            asChild
          >
            <Link href="/courses">{t("viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

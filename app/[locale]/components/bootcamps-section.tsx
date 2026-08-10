"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import BootcampCard from "@/app/[locale]/components/ui/bootcamp-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { fetchCourses } from "@/lib/api";
import { getStoredCourses, getEffectiveImage } from "@/lib/courses-store";

// Static fallback — used only if API is completely down and no stored courses exist
const FALLBACK_BOOTCAMPS = [
  { id: "odoo-functional",    title: "Odoo Functional ERP",             shortDescription: "Master Odoo ERP modules — CRM, Sales, Inventory, HR, Accounting and more with real business scenarios.", duration: "8 weeks",  startDate: "Aug 2025", mode: "Online" as const, level: "Beginner",     category: { name: "ERP" },         rating: 4.7, studentsEnrolled: 40 },
  { id: "odoo-technical",     title: "Odoo Technical",                  shortDescription: "Build custom Odoo modules from scratch — models, views, ORM, reports, and deployment.",                duration: "8 weeks",  startDate: "Aug 2025", mode: "Online" as const, level: "Intermediate", category: { name: "ERP" },         rating: 4.9, studentsEnrolled: 50 },
  { id: "full-stack-web-dev", title: "Full-Stack Web Development",      shortDescription: "Learn React, Node.js, PostgreSQL and build 16+ real-world projects for your portfolio.",                duration: "4 months", startDate: "Aug 2025", mode: "Online" as const, level: "Beginner",     category: { name: "Development" }, rating: 4.8, studentsEnrolled: 50 },
  { id: "python-programming", title: "Python Programming",              shortDescription: "Learn Python from the ground up — data structures, OOP, file handling, and real-world scripting.",      duration: "3 months", startDate: "Aug 2025", mode: "Online" as const, level: "Beginner",     category: { name: "Development" }, rating: 4.7, studentsEnrolled: 45 },
  { id: "data-science-ml",    title: "Data Science & Machine Learning", shortDescription: "Master data analysis, visualization, and ML algorithms using Python, Pandas, and Scikit-learn.",        duration: "4 months", startDate: "Aug 2025", mode: "Online" as const, level: "Intermediate", category: { name: "AI" },          rating: 4.8, studentsEnrolled: 38 },
  { id: "digital-marketing",  title: "Digital Marketing",               shortDescription: "Learn SEO, social media marketing, Google Ads, content strategy, and analytics to grow brands online.", duration: "6 weeks",  startDate: "Aug 2025", mode: "Online" as const, level: "Beginner",     category: { name: "Business" },    rating: 4.6, studentsEnrolled: 35 },
];

function courseToCardProps(c: any) {
  return {
    id:          c.id || c._id || "",
    // getEffectiveImage: adminImageUrl → config image → imageUrl
    image:       getEffectiveImage({ id: c.id, slug: c.slug, title: c.title, imageUrl: c.imageUrl, adminImageUrl: c.adminImageUrl }),
    title:       c.title || "",
    description: c.shortDescription || c.description || "",
    duration:    c.duration || "",
    startDate:   c.startDate ? new Date(c.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : undefined,
    mode:        c.mode,
    level:       c.level,
    category:    c.category?.name || c.category || "",
    rating:      c.rating,
    reviews:     c.studentsEnrolled || c.reviews,
  };
}

export function BootcampsSection() {
  const t = useTranslations("bootcampsSection");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Start with locally-stored courses (includes admin uploads) immediately
    const stored = getStoredCourses();
    if (stored.length > 0) {
      setCourses(stored.map(c => ({
        id:              c.id,
        slug:            c.id,
        title:           c.title,
        shortDescription: c.shortDescription || "",
        duration:        c.duration,
        category:        { name: c.category },
        rating:          c.rating,
        imageUrl:        c.imageUrl,
        adminImageUrl:   c.adminImageUrl,
        status:          c.status,
        priority:        c.priority ?? 0,
      })));
      setLoading(false);
    }

    // Merge stored courses for priority info
    fetchCourses()
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const storedMap = Object.fromEntries(getStoredCourses().map(s => [s.id, s]));
          // Merge: API data wins for content; adminImageUrl + priority from store always win
          const merged = data.map((apiCourse: any) => {
            // Try to find matching stored course by slug or title
            const storedMatch = storedMap[apiCourse.slug || apiCourse.id]
              || Object.values(storedMap).find(s =>
                  s.title.toLowerCase() === (apiCourse.title || "").toLowerCase()
                );
            return {
              ...apiCourse,
              adminImageUrl: storedMatch?.adminImageUrl || undefined,
              priority:      storedMatch?.priority ?? 999,
            };
          });
          setCourses(merged);
        } else if (stored.length === 0) {
          setCourses(FALLBACK_BOOTCAMPS);
        }
      })
      .catch(() => {
        if (stored.length === 0) setCourses(FALLBACK_BOOTCAMPS);
      })
      .finally(() => setLoading(false));
  }, []);

  // Sort by priority (admin-set) first, then by rating as tiebreaker
  const visible = [...courses]
    .sort((a, b) => {
      const pa = a.priority ?? 999;
      const pb = b.priority ?? 999;
      if (pa !== pb) return pa - pb;
      return (b.rating ?? 0) - (a.rating ?? 0);
    })
    .slice(0, 6);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
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

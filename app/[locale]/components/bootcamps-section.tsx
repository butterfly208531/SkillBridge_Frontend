"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import BootcampCard from "@/app/[locale]/components/ui/bootcamp-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { fetchCourses } from "@/lib/api";
import { getStoredCourses, getEffectiveImage, isCoursesInitialized } from "@/lib/courses-store";
import { syncSharedCoursesToLocal } from "@/lib/courses-shared";

function courseToCardProps(c: any) {
  return {
    id:          c.id || c._id || "",
    // Admin-uploaded image wins, otherwise API image
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
    let cancelled = false;

    (async () => {
      // Pull admin-published courses from the shared cloud store into localStorage
      await syncSharedCoursesToLocal();

      // Start with locally-stored courses (includes admin uploads) immediately
      const stored = getStoredCourses();
      if (isCoursesInitialized() && !cancelled) {
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
      }
      setLoading(false);

      // Fetch from API — merge, never drop admin-saved local courses
      try {
        const data = await fetchCourses();
        if (Array.isArray(data)) {
          const storedNow = getStoredCourses();
          const storedMap = Object.fromEntries(storedNow.map(s => [s.id, s]));

          const toDisplay = (c: any) => ({
            id:               c.id,
            slug:             c.id,
            title:            c.title,
            shortDescription: c.shortDescription || "",
            duration:         c.duration,
            category:         { name: c.category },
            rating:           c.rating,
            imageUrl:         c.imageUrl,
            adminImageUrl:    c.adminImageUrl,
            status:           c.status,
            priority:         c.priority ?? 0,
          });

          // API data wins for content; adminImageUrl + priority from store always win
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

          // Keep admin-added local courses the backend doesn't have (including when API is empty)
          const matchedKeys = new Set(data.map((a: any) => (a.slug || a.id)));
          storedNow.forEach(s => {
            const alreadyInApi = matchedKeys.has(s.id)
              || data.some((a: any) => (a.title || "").toLowerCase() === (s.title || "").toLowerCase());
            if (!alreadyInApi) merged.push(toDisplay(s));
          });

          if (!cancelled) setCourses(merged);
        }
      } catch {
        // API unavailable — localStorage data already applied above
      }
    })();

    return () => { cancelled = true; };
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
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
            <BookOpen className="h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">We don&apos;t have any bootcamps right now. Please check back soon.</p>
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

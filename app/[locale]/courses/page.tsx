"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Navbar } from "../components/navbar";
import Footer from "@/app/[locale]/components/footer";
import BootcampCard from "@/app/[locale]/components/ui/bootcamp-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { Input } from "@/app/[locale]/components/ui/input";
import { fetchCourses } from "@/lib/api";
import { getStoredCourses, getEffectiveImage, isCoursesInitialized } from "@/lib/courses-store";
import { syncSharedCoursesToLocal } from "@/lib/courses-shared";
import { cn } from "@/lib/utils";

function courseToCardProps(c: any) {
  return {
    id: c.id || c._id || "",
    image: getEffectiveImage({
      id:           c.id,
      slug:         c.slug || c.id,
      title:        c.title,
      imageUrl:     c.imageUrl,
      adminImageUrl: c.adminImageUrl,
    }),
    title: c.title || "",
    description: c.shortDescription || c.description || "",
    duration: c.duration || "",
    startDate: c.startDate
      ? new Date(c.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
      : undefined,
    mode: c.mode,
    level: c.level,
    category: c.category?.name || c.category || "",
    rating: c.rating,
    reviews: c.studentsEnrolled || c.reviews,
    showViewDetails: true,
  };
}

export default function CoursesPage() {
  const t = useTranslations();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Pull admin-published courses from the shared cloud store into localStorage
      await syncSharedCoursesToLocal();

      // Always show local store data first (admin-managed courses)
      const stored = isCoursesInitialized() ? getStoredCourses() : [];
      if (cancelled) return;
      setCourses(stored.map(c => ({
        id:               c.id,
        slug:             c.id,
        title:            c.title,
        shortDescription: c.shortDescription || "",
        duration:         c.duration,
        category:         { name: c.category },
        rating:           c.rating,
        imageUrl:         c.imageUrl,
        adminImageUrl:    c.adminImageUrl,   // carry through so getEffectiveImage works
        startDate:        c.startDate || undefined,
        status:           c.status,
        priority:         c.priority ?? 0,
      })));
      setLoading(false);

      // Refresh from API in background — merge, never drop admin-saved local courses
      try {
        const data = await fetchCourses();
        const list = Array.isArray(data) ? data : [];
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
          startDate:        c.startDate || undefined,
          status:           c.status,
          priority:         c.priority ?? 0,
        });

        // API data wins for content; adminImageUrl + priority from store always win
        const merged = list.map((apiCourse: any) => {
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
        const matchedKeys = new Set(list.map((a: any) => (a.slug || a.id)));
        storedNow.forEach(s => {
          const alreadyInApi = matchedKeys.has(s.id)
            || list.some((a: any) => (a.title || "").toLowerCase() === (s.title || "").toLowerCase());
          if (!alreadyInApi) merged.push(toDisplay(s));
        });

        if (!cancelled) setCourses(merged);
      } catch {
        /* keep stored data */
      }
    })();

    return () => { cancelled = true; };
  }, []);

  // Build dynamic categories from real data
  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category?.name || c.category || "Other")))];

  const filtered = courses.filter(c => {
    // Only show active/published courses on the public page
    const isActive = !c.status || c.status === "active" || c.status === "Active" || c.status === "PUBLISHED";
    const cat = c.category?.name || c.category || "";
    const matchCat = activeCategory === "All" || cat === activeCategory;
    const matchSearch = !searchQuery ||
      (c.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.shortDescription || c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return isActive && matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    // Priority (admin-set) always comes first — lower number = higher position
    const pa = a.priority ?? 999;
    const pb = b.priority ?? 999;
    if (pa !== pb) return pa - pb;
    // Within the same priority tier, apply the user's chosen sort
    if (sortBy === "newest")
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    if (sortBy === "popular")
      return (b.studentsEnrolled || b.reviews || 0) - (a.studentsEnrolled || a.reviews || 0);
    return (b.rating ?? 0) - (a.rating ?? 0); // "rating" — default
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-[#1565C0] via-[#2196F3] to-[#42A5F5] dark:from-gray-900 dark:via-blue-950 dark:to-gray-900 py-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
            All Bootcamps
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            {t("coursePage.explore")}
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8 leading-relaxed">
            {t("coursePage.description")}
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder={t("coursePage.searchPlaceholder")}
              className="pl-12 h-13 rounded-2xl border-0 shadow-xl text-base bg-white dark:bg-gray-900 dark:text-gray-100 focus-visible:ring-2 focus-visible:ring-[#F57C00]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10">
        {/* Category tabs + sort */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  activeCategory === cat
                    ? "bg-[#2196F3] text-white border-[#2196F3] shadow-sm"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#2196F3] hover:text-[#2196F3]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant={sortBy === "rating" ? "default" : "outline"}
              onClick={() => setSortBy("rating")}
              className={cn("rounded-xl text-sm", sortBy === "rating" ? "bg-[#2196F3] text-white hover:bg-blue-600" : "")}>
              Top Rated
            </Button>
            <Button size="sm" variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              className={cn("rounded-xl text-sm", sortBy === "popular" ? "bg-[#2196F3] text-white hover:bg-blue-600" : "")}>
              {t("coursePage.sort")}
            </Button>
            <Button size="sm" variant={sortBy === "newest" ? "default" : "outline"}
              onClick={() => setSortBy("newest")}
              className={cn("rounded-xl text-sm", sortBy === "newest" ? "bg-[#2196F3] text-white hover:bg-blue-600" : "")}>
              {t("coursePage.newest")}
            </Button>
          </div>
        </div>

        {/* Result count */}
        {(searchQuery || activeCategory !== "All") && !loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {sorted.length} bootcamp{sorted.length !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        )}

        {/* Cards grid */}
        {!loading && sorted.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-base font-medium">{t("coursePage.noCourse")}</p>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {sorted.map((course, i) => (
              <BootcampCard key={course.id || course._id || i} {...courseToCardProps(course)} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

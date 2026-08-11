"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import ProjectCard from "@/app/[locale]/components/ui/project-card";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { projectsConfig, CATEGORY_MAP, type ProjectCategory, type ProjectConfig } from "@/lib/projects-config";
import { getStoredProjects, saveProjects, type StoredProject } from "@/lib/project-store";
import { syncSharedProjectsToLocal } from "@/lib/projects-shared";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 50;
const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const TOP_CATEGORIES = ["All", "ERP", "Web Development", "AI", "Automation", "Python", "Mobile"] as const;

function storedToConfig(p: StoredProject): ProjectConfig {
  return {
    id:           p.id,
    priority:     p.priority ?? 999,
    title:        p.title,
    description:  p.description,
    technologies: p.technologies,
    category:     p.category,
    subCategory:  p.subCategory,
    studentName:  p.studentName  || undefined,
    demoUrl:      p.demoUrl      || undefined,
    githubUrl:    p.githubUrl    || undefined,
  };
}

export default function ProjectsPage() {
  const t = useTranslations("projectsPage");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [projects, setProjects] = useState<ProjectConfig[]>(projectsConfig);

  useEffect(() => {
    (async () => {
      // Tier 0: shared store — admin edits on ANY device land here first
      await syncSharedProjectsToLocal();

      // Tier 1: localStorage
      const stored = getStoredProjects();
      if (stored.length > 0) {
        setProjects(stored.filter(p => p.status === "active").map(storedToConfig));
      }

      // Tier 2: API (authoritative)
      fetch(`${API}/projects`)
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => {
          const list: any[] = Array.isArray(d) ? d : d.data ?? [];
          if (list.length === 0) return;
          const mapped: StoredProject[] = list.map((p: any) => ({
            id:           p.id || p._id || "",
            priority:     Number(p.priority) || 0,
            title:        p.title || p.name || "",
            description:  p.description || "",
            technologies: Array.isArray(p.technologies) ? p.technologies : [],
            category:     p.category || "Web Development",
            subCategory:  p.subCategory || p.sub_category || "",
            studentName:  p.studentName || p.student || "",
            demoUrl:      p.demoUrl || p.demo || "",
            githubUrl:    p.githubUrl || p.github || "",
            status:       (p.status || "active").toLowerCase(),
          }));
          saveProjects(mapped);
          setProjects(mapped.filter(p => p.status === "active").map(storedToConfig));
        })
        .catch(() => {});
    })();
  }, []);

  const subCategories =
    activeCategory !== "All"
      ? ["All", ...(CATEGORY_MAP[activeCategory as ProjectCategory] ?? [])]
      : [];

  const sorted = [...projects].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  const filtered = sorted.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (activeSubCategory !== "All" && p.subCategory !== activeSubCategory) return false;
    return true;
  });

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory("All");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="pt-8 pb-20">
        <div className="container mx-auto px-4">
          <SectionHeading title={t("heading")} subtitle={t("subtitle")} center titleHex="#1E90FF" />

          {/* Top-level categories */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {TOP_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200",
                  "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F57C00]",
                  activeCategory === cat
                    ? "bg-[#F57C00] text-white border-[#F57C00] shadow-sm"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#F57C00] hover:text-[#F57C00]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sub-categories */}
          <AnimatePresence>
            {subCategories.length > 0 && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-wrap gap-2 justify-center mb-10 overflow-hidden"
              >
                {subCategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setActiveSubCategory(sub)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
                      "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
                      activeSubCategory === sub
                        ? "bg-[#F57C00] text-white border-[#F57C00]"
                        : "bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#F57C00]"
                    )}
                  >
                    {sub}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-16">{t("noProjects")}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.slice(0, visibleCount).map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 9) * 0.05 }}
                  >
                    <ProjectCard {...project} />
                  </motion.div>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                    className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-[#F57C00] hover:bg-orange-500 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F57C00]"
                  >
                    Load More ({filtered.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

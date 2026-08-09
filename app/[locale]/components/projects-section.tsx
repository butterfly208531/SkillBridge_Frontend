"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import ProjectCard from "@/app/[locale]/components/ui/project-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { projectsConfig, CATEGORY_MAP, type ProjectCategory, type ProjectConfig } from "@/lib/projects-config";
import { getStoredProjects, saveProjects, type StoredProject } from "@/lib/project-store";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const TOP_CATEGORIES = ["All", "ERP", "Web Development", "AI", "Automation", "Python", "Mobile"] as const;

/** Map a StoredProject back to the shape ProjectCard / ProjectConfig expects */
function storedToConfig(p: StoredProject): ProjectConfig {
  return {
    id:           p.id,
    title:        p.title,
    description:  p.description,
    image:        p.image,
    technologies: p.technologies,
    category:     p.category,
    subCategory:  p.subCategory,
    studentName:  p.studentName  || undefined,
    demoUrl:      p.demoUrl      || undefined,
    githubUrl:    p.githubUrl    || undefined,
  };
}

export function ProjectsSection() {
  const t = useTranslations("projectsSection");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");

  // Initialise from static config (server-safe) — localStorage/API loaded in useEffect
  const [projects, setProjects] = useState<ProjectConfig[]>(projectsConfig);

  useEffect(() => {
    // Tier 1: localStorage (covers same-browser admin edits instantly)
    const stored = getStoredProjects();
    if (stored.length > 0) {
      setProjects(stored.filter(p => p.status === "active").map(storedToConfig));
    }

    // Tier 2: backend API — if it has data, it is authoritative
    fetch(`${API}/projects`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list: any[] = Array.isArray(d) ? d : d.data ?? [];
        if (list.length === 0) return;
        const mapped: StoredProject[] = list.map((p: any) => ({
          id:           p.id || p._id || "",
          title:        p.title || p.name || "",
          description:  p.description || "",
          image:        p.image || p.imageUrl || "",
          technologies: Array.isArray(p.technologies) ? p.technologies : [],
          category:     p.category || "Web Development",
          subCategory:  p.subCategory || p.sub_category || "",
          studentName:  p.studentName || p.student || "",
          demoUrl:      p.demoUrl || p.demo || "",
          githubUrl:    p.githubUrl || p.github || "",
          status:       (p.status || "active").toLowerCase(),
        }));
        // Persist so next load is instant
        saveProjects(mapped);
        setProjects(mapped.filter(p => p.status === "active").map(storedToConfig));
      })
      .catch(() => {
        // API unavailable — localStorage / static config already applied above
      });
  }, []);

  const subCategories =
    activeCategory !== "All"
      ? ["All", ...(CATEGORY_MAP[activeCategory as ProjectCategory] ?? [])]
      : [];

  const filtered = projects.filter((p) => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (activeSubCategory !== "All" && p.subCategory !== activeSubCategory) return false;
    return true;
  });

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    setActiveSubCategory("All");
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        {/* Top-level category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {TOP_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                activeCategory === cat
                  ? "bg-[#2196F3] text-white border-[#2196F3]"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#2196F3]"
              )}
            >
              {cat === "All" ? t("all") : cat}
            </button>
          ))}
        </div>

        {/* Sub-category filter — shown only when a category is selected */}
        <AnimatePresence>
          {subCategories.length > 0 && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2 justify-center mb-8 overflow-hidden"
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

        {/* Cards */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t("noProjects")}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 3).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Button className="bg-[#2196F3] hover:bg-blue-500 text-white px-8 h-11" asChild>
            <Link href="/projects">{t("viewMore")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

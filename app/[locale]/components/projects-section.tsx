"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import ProjectCard from "@/app/[locale]/components/ui/project-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { projectsConfig, CATEGORY_MAP, type ProjectCategory } from "@/lib/projects-config";
import { cn } from "@/lib/utils";

const TOP_CATEGORIES = ["All", "ERP", "Web Development", "AI", "Automation", "Python", "Mobile"] as const;

export function ProjectsSection() {
  const t = useTranslations("projectsSection");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("All");

  const subCategories =
    activeCategory !== "All"
      ? ["All", ...(CATEGORY_MAP[activeCategory as ProjectCategory] ?? [])]
      : [];

  const filtered = projectsConfig.filter((p) => {
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
            {filtered.slice(0, 6).map((project, i) => (
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

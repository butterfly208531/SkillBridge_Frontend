"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Navbar } from "../components/navbar";
import Footer from "@/app/[locale]/components/footer";
import BootcampCard from "@/app/[locale]/components/ui/bootcamp-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { Input } from "@/app/[locale]/components/ui/input";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import { imagePaths } from "@/app/[locale]/data/image-paths";
import { cn } from "@/lib/utils";

const BOOTCAMPS = [
  { id: "odoo-functional-erp", image: imagePaths.courses.design, title: "Odoo Functional ERP", description: "Master Odoo ERP modules — CRM, Sales, Inventory, HR, Accounting and more with real business scenarios.", duration: "8 weeks", startDate: "Aug 2025", mode: "Online", level: "Beginner", category: "ERP", rating: 4.7, reviews: 40 },
  { id: "odoo-technical-development", image: imagePaths.courses.machineLearning, title: "Odoo Technical Development", description: "Build custom Odoo modules from scratch — models, views, ORM, reports, and deployment.", duration: "8 weeks", startDate: "Aug 2025", mode: "Online", level: "Intermediate", category: "ERP", rating: 4.9, reviews: 50 },
  { id: "full-stack-development", image: imagePaths.courses.webDevelopment, title: "Full-Stack Development", description: "Learn React, Node.js, PostgreSQL and build 16+ real-world projects for your portfolio.", duration: "4 months", startDate: "Aug 2025", mode: "Online", level: "Beginner", category: "Development", rating: 4.8, reviews: 50 },
  { id: "python-programming", image: imagePaths.courses.machineLearning, title: "Python Programming", description: "From basics to advanced Python — automation, data analysis, and scripting for real projects.", duration: "6 weeks", startDate: "Aug 2025", mode: "Online", level: "Beginner", category: "Development", rating: 4.8, reviews: 60 },
  { id: "ai-machine-learning", image: imagePaths.courses.machineLearning, title: "AI & Machine Learning", description: "Build intelligent models with Python, Scikit-learn, and TensorFlow on real datasets.", duration: "3 months", startDate: "Sep 2025", mode: "Online", level: "Intermediate", category: "AI", rating: 4.9, reviews: 35 },
  { id: "data-science", image: imagePaths.courses.machineLearning, title: "Data Science", description: "Master data analysis, visualization, and statistical modeling with Python.", duration: "10 weeks", startDate: "Sep 2025", mode: "Online", level: "Intermediate", category: "AI", rating: 4.7, reviews: 28 },
  { id: "n8n-automation", image: imagePaths.courses.webDevelopment, title: "n8n Automation", description: "Automate business workflows without code — integrate APIs, CRMs, and tools with n8n.", duration: "4 weeks", startDate: "Sep 2025", mode: "Online", level: "Beginner", category: "Automation", rating: 4.6, reviews: 22 },
  { id: "ielts-preparation", image: imagePaths.courses.design, title: "IELTS Preparation", description: "Achieve your target IELTS band score with expert guidance, practice tests, and personalized feedback.", duration: "8 weeks", startDate: "Aug 2025", mode: "Physical", level: "All Levels", category: "Language", rating: 4.7, reviews: 30 },
  { id: "toefl-preparation", image: imagePaths.courses.design, title: "TOEFL Preparation", description: "Comprehensive TOEFL prep covering Reading, Listening, Speaking, and Writing sections.", duration: "8 weeks", startDate: "Aug 2025", mode: "Physical", level: "All Levels", category: "Language", rating: 4.6, reviews: 18 },
  { id: "duolingo-preparation", image: imagePaths.courses.design, title: "Duolingo Preparation", description: "Prepare for the Duolingo English Test with targeted practice and proven strategies.", duration: "4 weeks", startDate: "Aug 2025", mode: "Online", level: "All Levels", category: "Language", rating: 4.5, reviews: 15 },
];

const CATEGORIES = ["All", "ERP", "Development", "AI", "Automation", "Language"];

export default function CoursesPage() {
  const t = useTranslations();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const filtered = BOOTCAMPS.filter(c => {
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    const matchSearch = !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) =>
    sortBy === "newest" ? a.id.localeCompare(b.id) : b.reviews - a.reviews
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-montserrat">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <SectionHeading
          title={t("coursePage.explore")}
          subtitle={t("coursePage.description")}
        />

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder={t("coursePage.searchPlaceholder")}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              className={sortBy === "popular" ? "bg-[#2196F3] text-white" : ""}
            >
              {t("coursePage.sort")}
            </Button>
            <Button
              variant={sortBy === "newest" ? "default" : "outline"}
              onClick={() => setSortBy("newest")}
              className={sortBy === "newest" ? "bg-[#2196F3] text-white" : ""}
            >
              {t("coursePage.newest")}
            </Button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                activeCategory === cat
                  ? "bg-[#2196F3] text-white border-[#2196F3]"
                  : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-[#2196F3] hover:text-[#2196F3]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            {t("coursePage.noCourse")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((course) => (
              <BootcampCard key={course.id} {...course} showViewDetails />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

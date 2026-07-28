"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { SectionHeading } from "@/app/[locale]/components/ui/section-heading";
import BootcampCard from "@/app/[locale]/components/ui/bootcamp-card";
import { Button } from "@/app/[locale]/components/ui/button";
import { imagePaths } from "@/app/[locale]/data/image-paths";

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

export function BootcampsSection() {
  const t = useTranslations("bootcampsSection");

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionHeading title={t("heading")} subtitle={t("subheading")} center />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {BOOTCAMPS.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <BootcampCard {...course} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            className="bg-[#2196F3] hover:bg-[#F57C00] text-white px-8 h-11 transition-colors duration-200"
            asChild
          >
            <Link href="/courses">{t("viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

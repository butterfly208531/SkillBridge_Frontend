import { imagePaths } from "@/app/[locale]/data/image-paths";
import { CoursesConfig } from "@/types";

// Default fallback images
const DEFAULT_COURSE_IMAGE = '/images/courses/default.jpg';
const DEFAULT_INSTRUCTOR_IMAGE = '/images/instructors/default.jpg';

export const coursesConfig: CoursesConfig[] = [
   {
      key: 1,
      title: "Odoo Functional ERP",
      category: "ERP",
      level: "Beginner",
      duration: "3 months",
      rating: 4.7,
      students: 40,
      status: "Active",
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor1 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "odoo-functional-erp"
   },
   {
      key: 2,
      title: "Odoo Technical Development",
      category: "ERP",
      level: "Intermediate",
      duration: "4 months",
      rating: 4.9,
      students: 50,
      status: "Active",
      image: imagePaths?.courses?.machineLearning || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor2 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "odoo-technical-development"
   },
   {
      key: 3,
      title: "Full-Stack Development",
      category: "Development",
      level: "Beginner",
      duration: "6 months",
      rating: 4.8,
      students: 50,
      status: "Active",
      image: imagePaths?.courses?.design || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor3 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "full-stack-development"
   },
   {
      key: 4,
      title: "Python Programming",
      category: "Development",
      level: "Beginner",
      duration: "3 months",
      rating: 4.8,
      students: 60,
      status: "Active",
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor1 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "python-programming"
   },
   {
      key: 5,
      title: "AI & Machine Learning",
      category: "AI",
      level: "Intermediate",
      duration: "4 months",
      rating: 4.9,
      students: 35,
      status: "Active",
      image: imagePaths?.courses?.design || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor2 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "ai-machine-learning"
   },
   {
      key: 6,
      title: "Data Science",
      category: "AI",
      level: "Intermediate",
      duration: "4 months",
      rating: 4.7,
      students: 28,
      status: "Active",
      image: imagePaths?.courses?.machineLearning || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor3 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "data-science"
   },
   {
      key: 7,
      title: "n8n Automation",
      category: "Automation",
      level: "Beginner",
      duration: "2 months",
      rating: 4.6,
      students: 22,
      status: "Active",
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor1 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "n8n-automation"
   },
   {
      key: 8,
      title: "IELTS Preparation",
      category: "Language",
      level: "All Levels",
      duration: "2 months",
      rating: 4.7,
      students: 30,
      status: "Active",
      image: imagePaths?.courses?.design || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor2 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "ielts-preparation"
   },
   {
      key: 9,
      title: "TOEFL Preparation",
      category: "Language",
      level: "All Levels",
      duration: "2 months",
      rating: 4.6,
      students: 18,
      status: "Active",
      image: imagePaths?.courses?.machineLearning || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor3 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "toefl-preparation"
   },
   {
      key: 10,
      title: "Duolingo Preparation",
      category: "Language",
      level: "All Levels",
      duration: "2 months",
      rating: 4.5,
      students: 15,
      status: "Active",
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      instructorImage: imagePaths?.instructors?.instructor2 || DEFAULT_INSTRUCTOR_IMAGE,
      slug: "duolingo-preparation"
   }
];

// Helper functions
export const getCourseBySlug = (slug: string) => {
   return coursesConfig.find(course => course.slug === slug) || null;
};

export const getCourseById = (id: number) => {
   return coursesConfig.find(course => course.key === id) || null;
};

export const getCoursesByCategory = (category: string) => {
   return coursesConfig.filter(course => course.category === category);
};

export const getFeaturedCourses = (limit: number = 6) => {
   return coursesConfig.slice(0, limit);
};

export const getCoursesByLevel = (level: string) => {
   return coursesConfig.filter(course => course.level === level);
};

export const searchCourses = (query: string) => {
   const searchTerm = query.toLowerCase();
   return coursesConfig.filter(course => 
      (course.title?.toLowerCase() ?? "").includes(searchTerm) ||
      (course.category?.toLowerCase() ?? "").includes(searchTerm) ||
      (course.level?.toLowerCase() ?? "").includes(searchTerm)
   );
};

export const getAllCategories = () => {
   const categories = new Set(coursesConfig.map(course => course.category));
   return Array.from(categories);
};

export const getAllLevels = () => {
   const levels = new Set(coursesConfig.map(course => course.level));
   return Array.from(levels);
};
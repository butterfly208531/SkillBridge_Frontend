import { CoursesConfig } from "@/types";

// Unique Unsplash images — one per course, no repeats
const COURSE_IMAGES = {
  python:          "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop",
  computerBasics:  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
  flutter:         "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
  fullstack:       "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop",
  datascience:     "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  odooFunctional:  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  odooTechnical:   "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop",
  cybersecurity:   "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  accounting:      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  digitalMarketing:"https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=600&h=400&fit=crop",
  ielts:           "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
  office365:       "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
};

export const coursesConfig: CoursesConfig[] = [
  {
    key: 1,
    title: "Python Programming",
    category: "Development",
    level: "Beginner",
    duration: "3 months",
    rating: 0,
    students: 0,
    status: "Active",
    //image: COURSE_IMAGES.python,
    slug: "python-programming",
  },
  {
    key: 2,
    title: "Basic Computer Skills",
    category: "IT",
    level: "Beginner",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
   // image: COURSE_IMAGES.computerBasics,
    slug: "basic-computer-skills",
  },
  {
    key: 3,
    title: "Flutter (Mobile App Dev)",
    category: "Development",
    level: "Intermediate",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    //image: COURSE_IMAGES.flutter,
    slug: "flutter-mobile-dev",
  },
  {
    key: 4,
    title: "Full-Stack Web Development",
    category: "Development",
    level: "Beginner",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    //image: COURSE_IMAGES.fullstack,
    slug: "full-stack-web-dev",
  },
  {
    key: 5,
    title: "Data Science & Machine Learning",
    category: "AI",
    level: "Intermediate",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    //image: COURSE_IMAGES.datascience,
    slug: "data-science-ml",
  },
  {
    key: 6,
    title: "Odoo Functional",
    category: "ERP",
    level: "Beginner",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    image: COURSE_IMAGES.odooFunctional,
    slug: "odoo-functional",
  },
  {
    key: 7,
    title: "Odoo Technical",
    category: "ERP",
    level: "Intermediate",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    image: COURSE_IMAGES.odooTechnical,
    slug: "odoo-technical",
  },
  {
    key: 8,
    title: "Cybersecurity",
    category: "IT",
    level: "Intermediate",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    image: COURSE_IMAGES.cybersecurity,
    slug: "cybersecurity",
  },
  {
    key: 9,
    title: "Accounting (Peachtree, Excel, QuickBooks)",
    category: "Business",
    level: "Beginner",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    image: COURSE_IMAGES.accounting,
    slug: "accounting-software",
  },
  {
    key: 10,
    title: "Digital Marketing",
    category: "Business",
    level: "Beginner",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    image: COURSE_IMAGES.digitalMarketing,
    slug: "digital-marketing",
  },
  {
    key: 11,
    title: "IELTS, TOEFL & Duolingo Preparation",
    category: "Language",
    level: "All Levels",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    image: COURSE_IMAGES.ielts,
    slug: "ielts-toefl-duolingo",
  },
  {
    key: 12,
    title: "Microsoft Office 365",
    category: "IT",
    level: "Beginner",
    duration: "—",
    rating: 0,
    students: 0,
    status: "Active",
    image: COURSE_IMAGES.office365,
    slug: "microsoft-office-365",
  },
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

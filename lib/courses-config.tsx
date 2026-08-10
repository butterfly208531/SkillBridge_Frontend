import { CoursesConfig } from "@/types";

// Local course images from /public/images/courses
const COURSE_IMAGES = {
  python:          "/images/courses/phyton.jpg",
  computerBasics:  "/images/courses/basicComputerskill.jpg",
  flutter:         "/images/courses/flutter.jpg",
  fullstack:       "/images/courses/fullStuck.jpg",
  datascience:     "/images/courses/dataSaince.jpg",
  odooFunctional:  "/images/courses/odooErpFunction.jpg",
  odooTechnical:   "/images/courses/odooTechnical.jpg",
  cybersecurity:   "/images/courses/cybercecurty.jpg",
  accounting:      "/images/courses/accounting.jpg",
  digitalMarketing:"/images/courses/digitalMarketing.jpg",
  ielts:           "/images/courses/tofl.jpg",
  office365:       "/images/courses/microsoft.jpg",
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

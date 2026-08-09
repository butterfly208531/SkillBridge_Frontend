export type ProjectCategory =
  | "ERP"
  | "Web Development"
  | "AI"
  | "Automation"
  | "Python"
  | "Mobile";

export type ProjectSubCategory =
  | "Odoo Modules"
  | "ERP Implementations"
  | "Portfolio Websites"
  | "E-Commerce Platforms"
  | "Business Websites"
  | "Chatbots"
  | "Machine Learning Applications"
  | "AI Assistants"
  | "n8n Workflows"
  | "Business Automation"
  | "API Integrations"
  | "Desktop Applications"
  | "Automation Scripts"
  | "Data Analysis Projects"
  | "Flutter Applications"
  | "React Native Projects";

export interface ProjectConfig {
  id: string;
  title: string;
  technologies: string[];
  description: string;
  category: ProjectCategory;
  subCategory: ProjectSubCategory;
  studentName?: string;
  demoUrl?: string;
  githubUrl?: string;
}

export const CATEGORY_MAP: Record<ProjectCategory, ProjectSubCategory[]> = {
  ERP: ["Odoo Modules", "ERP Implementations"],
  "Web Development": ["Portfolio Websites", "E-Commerce Platforms", "Business Websites"],
  AI: ["Chatbots", "Machine Learning Applications", "AI Assistants"],
  Automation: ["n8n Workflows", "Business Automation", "API Integrations"],
  Python: ["Desktop Applications", "Automation Scripts", "Data Analysis Projects"],
  Mobile: ["Flutter Applications", "React Native Projects"],
};

export const projectsConfig: ProjectConfig[] = [
  {
    id: "daynan-ecommerce",
    title: "Full-Stack E-Commerce App",
    technologies: ["React", "Node.js", "MongoDB", "Express"],
    description: "A complete full-stack e-commerce application with product management, cart, and checkout flow.",
    category: "Web Development",
    subCategory: "E-Commerce Platforms",
    studentName: "Daynan F.",
    githubUrl: "https://github.com/daynanf/E-commerce-Full-stack",
  },
  {
    id: "dagim-skillbridge-ecommerce",
    title: "SkillBridge E-Commerce Platform",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    description: "Full-stack e-commerce platform built for the SkillBridge community, featuring product listings and order management.",
    category: "Web Development",
    subCategory: "E-Commerce Platforms",
    studentName: "Dagim Mengestu",
    demoUrl: "https://skillbridge-ecomers-git-main-dagi-s-projects.vercel.app/",
    githubUrl: "https://github.com/Dagimmengestu5/skillbridge_ecomers",
  },
  {
    id: "semira-shop-fullstack",
    title: "SemOne Shop — Full-Stack E-Commerce",
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    description: "A full-stack e-commerce shop with product browsing, user authentication, and order processing.",
    category: "Web Development",
    subCategory: "E-Commerce Platforms",
    studentName: "Semira",
    githubUrl: "https://github.com/semira-smart/-SemOne-Shop-Full-Stack-E-commerce",
  },
  {
    id: "gursha-food-platform",
    title: "Gursha — Food Ordering Platform",
    technologies: ["Next.js", "React", "Tailwind CSS", "Node.js"],
    description: "Online food ordering platform with restaurant listings, menu browsing, and a streamlined checkout experience.",
    category: "Web Development",
    subCategory: "Business Websites",
    studentName: "Dag12y",
    demoUrl: "https://gursha-gamma.vercel.app/",
    githubUrl: "https://github.com/dag12y/Gursha",
  },
  {
    id: "eduflow-learning-platform",
    title: "EduFlow — Online Learning Platform",
    technologies: ["React", "Node.js", "MongoDB", "JWT"],
    description: "Full-stack learning platform with student, instructor, and admin roles, course management, and enrollment tracking.",
    category: "Web Development",
    subCategory: "Business Websites",
    studentName: "Sadiq Ameen",
    demoUrl: "https://devloperameen-safesesa-f441.vercel.app",
    githubUrl: "https://github.com/Devloperameen/Devloperameen-SAFESESA",
  },
  {
    id: "property-management",
    title: "Property Management System",
    technologies: ["React", "Node.js", "Express", "PostgreSQL"],
    description: "A web-based property management application for listing, tracking, and managing real estate properties.",
    category: "Web Development",
    subCategory: "Business Websites",
    studentName: "Amare Tilaye",
    githubUrl: "https://github.com/Amaretilaye/property_managment",
  },
];

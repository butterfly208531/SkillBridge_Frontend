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
  image: string;
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

// Unique Unsplash images — one per project, no repeats
const img = {
  // Daynan: shopping cart / online store
  daynanEcommerce:   "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  // Dagim: storefront / retail tech
  dagimEcommerce:    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=400&fit=crop",
  // Semira: clothing / fashion shop
  semiraShop:        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
  // Gursha: food / restaurant
  gurshaFood:        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  // EduFlow: online learning / education
  eduflowLearning:   "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
  // Property management: real estate / building
  propertyMgmt:      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
};

export const projectsConfig: ProjectConfig[] = [
  {
    id: "daynan-ecommerce",
    title: "Full-Stack E-Commerce App",
    image: img.daynanEcommerce,
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
    image: img.dagimEcommerce,
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
    image: img.semiraShop,
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
    image: img.gurshaFood,
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
    image: img.eduflowLearning,
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
    image: img.propertyMgmt,
    technologies: ["React", "Node.js", "Express", "PostgreSQL"],
    description: "A web-based property management application for listing, tracking, and managing real estate properties.",
    category: "Web Development",
    subCategory: "Business Websites",
    studentName: "Amare Tilaye",
    githubUrl: "https://github.com/Amaretilaye/property_managment",
  },
];

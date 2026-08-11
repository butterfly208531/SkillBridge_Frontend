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
  priority?: number;
  title: string;
  technologies: string[];
  description: string;
  category: ProjectCategory;
  subCategory: ProjectSubCategory;
  studentName?: string;
  demoUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
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
    priority: 1,
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
    priority: 2,
    title: "SkillBridge E-Commerce Platform",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js"],
    description: "Full-stack e-commerce platform built for the SkillBridge community, featuring product listings and order management.",
    category: "Web Development",
    subCategory: "E-Commerce Platforms",
    studentName: "Dagim Mengestu",
    demoUrl: "https://skillbridge-ecomers-git-main-dagi-s-projects.vercel.app/",
    githubUrl: "https://github.com/Dagimmengestu5/skillbridge_ecomers",
    figmaUrl: "https://www.figma.com/design/DF86BqoGDxOpsLLGOG1fDY/work-1?node-id=252-246&p=f&t=i3zkddVODaxtSDzb-0",
  },
  {
    id: "semira-shop-fullstack",
    priority: 3,
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
    priority: 4,
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
    priority: 5,
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
    priority: 6,
    title: "Property Management System",
    technologies: ["React", "Node.js", "Express", "PostgreSQL"],
    description: "A web-based property management application for listing, tracking, and managing real estate properties.",
    category: "Web Development",
    subCategory: "Business Websites",
    studentName: "Amare Tilaye",
    githubUrl: "https://github.com/Amaretilaye/property_managment",
  },
  {
    id: "portfolio-website-brook",
    priority: 7,
    title: "Personal Portfolio Website",
    technologies: ["HTML", "CSS", "JavaScript", "React"],
    description: "A modern personal portfolio showcasing projects, skills, and professional experience with smooth animations.",
    category: "Web Development",
    subCategory: "Portfolio Websites",
    studentName: "Brook Alemu",
  },
  {
    id: "task-automation-n8n",
    priority: 8,
    title: "Business Task Automation with n8n",
    technologies: ["n8n", "Webhooks", "REST API", "Notion"],
    description: "Automated business workflows using n8n, connecting Notion, Gmail, and Slack for seamless task management.",
    category: "Automation",
    subCategory: "n8n Workflows",
    studentName: "Yonas Bekele",
  },
  {
    id: "ai-chatbot-support",
    priority: 9,
    title: "AI Customer Support Chatbot",
    technologies: ["Python", "OpenAI API", "FastAPI", "React"],
    description: "An AI-powered customer support chatbot that handles FAQs, order tracking, and escalation to human agents.",
    category: "AI",
    subCategory: "Chatbots",
    studentName: "Hana Tesfaye",
  },
  {
    id: "odoo-hr-module",
    priority: 10,
    title: "Odoo HR Management Module",
    technologies: ["Odoo", "Python", "XML", "PostgreSQL"],
    description: "Custom Odoo module for HR management including employee records, leave tracking, and payroll integration.",
    category: "ERP",
    subCategory: "Odoo Modules",
    studentName: "Biruk Getachew",
  },
  {
    id: "flutter-expense-tracker",
    priority: 11,
    title: "Expense Tracker Mobile App",
    technologies: ["Flutter", "Dart", "Firebase", "Hive"],
    description: "Cross-platform mobile application for tracking daily expenses, budgeting, and generating spending reports.",
    category: "Mobile",
    subCategory: "Flutter Applications",
    studentName: "Tigist Haile",
  },
  {
    id: "python-data-analysis",
    priority: 12,
    title: "Sales Data Analysis Dashboard",
    technologies: ["Python", "Pandas", "Matplotlib", "Streamlit"],
    description: "Interactive data analysis dashboard built with Streamlit to visualize sales trends and key business metrics.",
    category: "Python",
    subCategory: "Data Analysis Projects",
    studentName: "Nahom Girma",
  },
  {
    id: "api-integration-automation",
    priority: 13,
    title: "CRM & Email Marketing Integration",
    technologies: ["Python", "HubSpot API", "Mailchimp", "FastAPI"],
    description: "Automated pipeline that syncs CRM contacts with Mailchimp for targeted email marketing campaigns.",
    category: "Automation",
    subCategory: "API Integrations",
    studentName: "Meron Desta",
  },
  {
    id: "ml-price-prediction",
    priority: 14,
    title: "House Price Prediction Model",
    technologies: ["Python", "Scikit-learn", "Pandas", "Flask"],
    description: "Machine learning model that predicts house prices based on location, size, and amenities using regression algorithms.",
    category: "AI",
    subCategory: "Machine Learning Applications",
    studentName: "Abel Worku",
  },
  {
    id: "erp-inventory-system",
    priority: 15,
    title: "ERP Inventory Management System",
    technologies: ["Odoo", "Python", "XML", "JavaScript"],
    description: "Full ERP inventory implementation for a retail business with stock tracking, reorder alerts, and supplier management.",
    category: "ERP",
    subCategory: "ERP Implementations",
    studentName: "Selam Kebede",
  },
];

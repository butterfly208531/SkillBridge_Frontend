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

// Contextually relevant Unsplash images per project type
const img = {
  odooInventory:  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
  odooHR:         "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop",
  erpRetail:      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  portfolio:      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
  ecommerce:      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  restaurant:     "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  chatbot:        "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
  mlPrediction:   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
  aiAssistant:    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop",
  n8nCRM:         "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
  invoiceAuto:    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  telegramBot:    "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=400&fit=crop",
  desktopApp:     "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
  dataDashboard:  "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?w=600&h=400&fit=crop",
  webScraper:     "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&h=400&fit=crop",
  flutterApp:     "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=400&fit=crop",
  rnFoodDelivery: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop",
};

export const projectsConfig: ProjectConfig[] = [
  {
    id: "odoo-inventory",
    title: "Odoo Inventory Management Module",
    image: img.odooInventory,
    technologies: ["Odoo", "Python", "XML", "PostgreSQL"],
    description: "Custom Odoo module for warehouse inventory with real-time tracking and automated reorder points.",
    category: "ERP",
    subCategory: "Odoo Modules",
    studentName: "Abebe Kebede",
    githubUrl: "https://github.com/skillbridge/odoo-inventory",
  },
  {
    id: "odoo-hr-module",
    title: "Odoo HR & Payroll Module",
    image: img.odooHR,
    technologies: ["Odoo", "Python", "XML"],
    description: "Custom HR module extending Odoo payroll with Ethiopian tax calculations and leave management.",
    category: "ERP",
    subCategory: "Odoo Modules",
    studentName: "Liya Tesfaye",
    githubUrl: "https://github.com/skillbridge/odoo-hr",
  },
  {
    id: "erp-retail-impl",
    title: "Retail Business ERP Implementation",
    image: img.erpRetail,
    technologies: ["Odoo 17", "PostgreSQL", "Python"],
    description: "Full Odoo ERP implementation for a retail chain covering POS, inventory, and accounting modules.",
    category: "ERP",
    subCategory: "ERP Implementations",
    studentName: "Dawit Girma",
    demoUrl: "https://demo.skillbridge.et/retail-erp",
  },
  {
    id: "portfolio-website",
    title: "Developer Portfolio Website",
    image: img.portfolio,
    technologies: ["React", "Tailwind CSS", "Framer Motion"],
    description: "Modern animated developer portfolio with project showcase, skills section, and contact form.",
    category: "Web Development",
    subCategory: "Portfolio Websites",
    studentName: "Biruk Alemu",
    demoUrl: "https://biruk.skillbridge.et",
    githubUrl: "https://github.com/skillbridge/portfolio",
  },
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    image: img.ecommerce,
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    description: "Full-featured e-commerce platform with product listings, cart management, and Stripe payment integration.",
    category: "Web Development",
    subCategory: "E-Commerce Platforms",
    studentName: "Tigist Haile",
    demoUrl: "https://demo.skillbridge.et/ecommerce",
    githubUrl: "https://github.com/skillbridge/ecommerce",
  },
  {
    id: "restaurant-website",
    title: "Restaurant Business Website",
    image: img.restaurant,
    technologies: ["Next.js", "Tailwind CSS", "Sanity CMS"],
    description: "Full business website for a local restaurant with menu, reservations, and online ordering.",
    category: "Web Development",
    subCategory: "Business Websites",
    studentName: "Selamawit Desta",
    demoUrl: "https://demo.skillbridge.et/restaurant",
    githubUrl: "https://github.com/skillbridge/restaurant-site",
  },
  {
    id: "chatbot-ai",
    title: "Customer Support Chatbot",
    image: img.chatbot,
    technologies: ["Python", "OpenAI API", "FastAPI", "React"],
    description: "AI-powered chatbot handling customer support queries using GPT-4 with context-aware responses.",
    category: "AI",
    subCategory: "Chatbots",
    studentName: "Yohannes Tadesse",
    githubUrl: "https://github.com/skillbridge/ai-chatbot",
  },
  {
    id: "ml-price-prediction",
    title: "House Price Prediction Model",
    image: img.mlPrediction,
    technologies: ["Python", "Scikit-learn", "Pandas", "Streamlit"],
    description: "Machine learning model predicting house prices based on location, size, and amenities.",
    category: "AI",
    subCategory: "Machine Learning Applications",
    studentName: "Mekdes Worku",
    githubUrl: "https://github.com/skillbridge/house-price-ml",
  },
  {
    id: "ai-study-assistant",
    title: "AI Study Assistant",
    image: img.aiAssistant,
    technologies: ["Python", "LangChain", "OpenAI", "Streamlit"],
    description: "Personalized AI assistant that summarizes study materials, generates quizzes, and tracks progress.",
    category: "AI",
    subCategory: "AI Assistants",
    studentName: "Natnael Girma",
    githubUrl: "https://github.com/skillbridge/ai-study-assistant",
    demoUrl: "https://demo.skillbridge.et/ai-assistant",
  },
  {
    id: "n8n-crm-automation",
    title: "CRM Lead Automation Workflow",
    image: img.n8nCRM,
    technologies: ["n8n", "HubSpot API", "Telegram Bot", "Google Sheets"],
    description: "Automated n8n workflow capturing leads from multiple sources and syncing to CRM with Telegram notifications.",
    category: "Automation",
    subCategory: "n8n Workflows",
    studentName: "Sara Mohammed",
    demoUrl: "https://demo.skillbridge.et/n8n-crm",
  },
  {
    id: "invoice-automation",
    title: "Invoice Generation Automation",
    image: img.invoiceAuto,
    technologies: ["Python", "n8n", "Google Drive API", "PDF"],
    description: "Automated system that generates, emails, and archives invoices from spreadsheet data.",
    category: "Automation",
    subCategory: "Business Automation",
    studentName: "Henok Bekele",
    githubUrl: "https://github.com/skillbridge/invoice-automation",
  },
  {
    id: "telegram-bot-integration",
    title: "Multi-Service Telegram Bot",
    image: img.telegramBot,
    technologies: ["Python", "Telegram Bot API", "REST APIs", "PostgreSQL"],
    description: "Telegram bot integrating weather, currency exchange, and news APIs for daily productivity updates.",
    category: "Automation",
    subCategory: "API Integrations",
    studentName: "Fitsum Alemu",
    githubUrl: "https://github.com/skillbridge/telegram-multi-bot",
  },
  {
    id: "student-management-desktop",
    title: "Student Management Desktop App",
    image: img.desktopApp,
    technologies: ["Python", "Tkinter", "SQLite"],
    description: "Desktop application for managing student records, grades, and attendance with report generation.",
    category: "Python",
    subCategory: "Desktop Applications",
    studentName: "Biniam Hailu",
    githubUrl: "https://github.com/skillbridge/student-mgmt",
  },
  {
    id: "data-analysis-sales",
    title: "Sales Data Analysis Dashboard",
    image: img.dataDashboard,
    technologies: ["Python", "Pandas", "Matplotlib", "Streamlit"],
    description: "Interactive sales analytics dashboard featuring trend analysis and forecasting.",
    category: "Python",
    subCategory: "Data Analysis Projects",
    studentName: "Dawit Girma",
    githubUrl: "https://github.com/skillbridge/sales-dashboard",
    demoUrl: "https://demo.skillbridge.et/sales-dashboard",
  },
  {
    id: "web-scraper-script",
    title: "Job Listings Web Scraper",
    image: img.webScraper,
    technologies: ["Python", "BeautifulSoup", "Selenium", "CSV"],
    description: "Automated script that scrapes job listings from multiple platforms and exports to a structured CSV file.",
    category: "Python",
    subCategory: "Automation Scripts",
    studentName: "Rahel Tsegaye",
    githubUrl: "https://github.com/skillbridge/job-scraper",
  },
  {
    id: "flutter-expense-tracker",
    title: "Personal Expense Tracker App",
    image: img.flutterApp,
    technologies: ["Flutter", "Dart", "Firebase", "Hive"],
    description: "Cross-platform mobile app for tracking personal expenses with category analysis and budget alerts.",
    category: "Mobile",
    subCategory: "Flutter Applications",
    studentName: "Hana Tesfaye",
    githubUrl: "https://github.com/skillbridge/flutter-expense",
  },
  {
    id: "rn-food-delivery",
    title: "Food Delivery Mobile App",
    image: img.rnFoodDelivery,
    technologies: ["React Native", "Expo", "Firebase", "Google Maps API"],
    description: "React Native food delivery app with real-time order tracking, restaurant listings, and push notifications.",
    category: "Mobile",
    subCategory: "React Native Projects",
    studentName: "Eyob Mulugeta",
    githubUrl: "https://github.com/skillbridge/rn-food-delivery",
    demoUrl: "https://demo.skillbridge.et/food-delivery",
  },
];

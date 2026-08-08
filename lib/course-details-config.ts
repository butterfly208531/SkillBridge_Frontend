import { imagePaths } from "@/app/[locale]/data/image-paths";

// Default fallback images
const DEFAULT_COURSE_IMAGE = '/images/courses/default.jpg';

export const courseDetailsConfig: Record<string, { 
  image: string;
  instructorImage?: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  price?: string;
  syllabus?: string[];
  prerequisites?: string[];
}> = {
   "odoo-functional-erp": {
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      title: "Odoo Functional ERP",
      description: "Master Odoo ERP functional modules including Sales, Purchase, Inventory, and Accounting. Learn to configure and customize Odoo for business needs.",
      duration: "3 months",
      level: "Beginner",
      price: "$299",
      syllabus: [
         "Introduction to Odoo ERP",
         "Sales Management",
         "Purchase Management",
         "Inventory Management",
         "Accounting Basics",
         "CRM Integration"
      ],
      prerequisites: ["Basic business knowledge", "Computer literacy"]
   },
   "odoo-technical-development": {
      image: imagePaths?.courses?.machineLearning || DEFAULT_COURSE_IMAGE,
      title: "Odoo Technical Development",
      description: "Learn Odoo development including module creation, customization, API integration, and advanced technical concepts.",
      duration: "4 months",
      level: "Intermediate",
      price: "$399",
      syllabus: [
         "Python Fundamentals for Odoo",
         "Odoo Architecture",
         "Module Development",
         "View Creation",
         "Security and Access Rights",
         "API Development"
      ],
      prerequisites: ["Python basics", "Database knowledge"]
   },
   "full-stack-development": {
      image: imagePaths?.courses?.design || DEFAULT_COURSE_IMAGE,
      title: "Full-Stack Development",
      description: "Complete full-stack development course covering frontend, backend, database, and deployment.",
      duration: "6 months",
      level: "Beginner",
      price: "$499",
      syllabus: [
         "HTML, CSS, JavaScript",
         "React.js",
         "Node.js",
         "MongoDB",
         "REST APIs",
         "Deployment"
      ],
      prerequisites: ["Basic computer knowledge"]
   },
   "python-programming": {
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      title: "Python Programming",
      description: "Comprehensive Python programming course from basics to advanced topics.",
      duration: "3 months",
      level: "Beginner",
      price: "$249",
      syllabus: [
         "Python Basics",
         "Data Structures",
         "Functions and Modules",
         "File Handling",
         "Error Handling",
         "OOP in Python"
      ],
      prerequisites: ["No prior programming experience needed"]
   },
   "ai-machine-learning": {
      image: imagePaths?.courses?.design || DEFAULT_COURSE_IMAGE,
      title: "AI & Machine Learning",
      description: "Master artificial intelligence and machine learning concepts with hands-on projects.",
      duration: "4 months",
      level: "Intermediate",
      price: "$449",
      syllabus: [
         "Introduction to AI/ML",
         "Supervised Learning",
         "Unsupervised Learning",
         "Deep Learning",
         "NLP",
         "Computer Vision"
      ],
      prerequisites: ["Python basics", "Mathematics background"]
   },
   "data-science": {
      image: imagePaths?.courses?.machineLearning || DEFAULT_COURSE_IMAGE,
      title: "Data Science",
      description: "Learn data science including data analysis, visualization, and predictive modeling.",
      duration: "4 months",
      level: "Intermediate",
      price: "$399",
      syllabus: [
         "Data Analysis",
         "Data Visualization",
         "Statistical Analysis",
         "Machine Learning",
         "Big Data Tools"
      ],
      prerequisites: ["Python basics", "Statistics knowledge"]
   },
   "n8n-automation": {
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      title: "n8n Automation",
      description: "Learn to automate workflows using n8n, a powerful open-source automation tool.",
      duration: "2 months",
      level: "Beginner",
      price: "$199",
      syllabus: [
         "Introduction to n8n",
         "Workflow Creation",
         "API Integration",
         "Webhooks",
         "Email Automation",
         "Custom Nodes"
      ],
      prerequisites: ["Basic web knowledge"]
   },
   "ielts-preparation": {
      image: imagePaths?.courses?.design || DEFAULT_COURSE_IMAGE,
      title: "IELTS Preparation",
      description: "Comprehensive IELTS preparation covering all four modules: Listening, Reading, Writing, and Speaking.",
      duration: "2 months",
      level: "All Levels",
      price: "$199",
      syllabus: [
         "Listening Skills",
         "Reading Skills",
         "Writing Tasks",
         "Speaking Practice",
         "Mock Tests"
      ],
      prerequisites: ["Basic English proficiency"]
   },
   "toefl-preparation": {
      image: imagePaths?.courses?.machineLearning || DEFAULT_COURSE_IMAGE,
      title: "TOEFL Preparation",
      description: "Complete TOEFL preparation with focus on academic English skills.",
      duration: "2 months",
      level: "All Levels",
      price: "$199",
      syllabus: [
         "Reading Comprehension",
         "Listening Skills",
         "Speaking Tasks",
         "Writing Tasks",
         "Practice Tests"
      ],
      prerequisites: ["Basic English proficiency"]
   },
   "duolingo-preparation": {
      image: imagePaths?.courses?.webDevelopment || DEFAULT_COURSE_IMAGE,
      title: "Duolingo Preparation",
      description: "Prepare for the Duolingo English Test with comprehensive practice materials.",
      duration: "2 months",
      level: "All Levels",
      price: "$149",
      syllabus: [
         "Test Overview",
         "Reading Practice",
         "Speaking Practice",
         "Writing Practice",
         "Listening Practice",
         "Mock Tests"
      ],
      prerequisites: ["Basic English proficiency"]
   }
};

// Helper function to safely get course details
export const getCourseDetails = (slug: string) => {
   const course = courseDetailsConfig[slug];
   
   if (!course) {
      return {
         image: DEFAULT_COURSE_IMAGE,
         title: "Course Not Found",
         description: "The requested course could not be found.",
         duration: "N/A",
         level: "N/A"
      };
   }
   
   return course;
};

// Helper to get all course slugs
export const getAllCourseSlugs = () => {
   return Object.keys(courseDetailsConfig);
};

// Helper to check if course exists
export const courseExists = (slug: string): boolean => {
   return !!courseDetailsConfig[slug];
};

export type JobType   = "Full-Time" | "Part-Time" | "Contract" | "Internship" | "Remote";
export type JobLevel  = "Entry Level" | "Mid Level" | "Senior" | "Lead" | "Any Level";
export type JobStatus = "open" | "closed" | "draft";
export type JobApplicationMode = "both" | "form" | "link";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  level: JobLevel;
  salary?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  applyUrl: string;
  deadline?: string;
  status: JobStatus;
  postedAt: string;
  category: string;
  logo?: string;
  applicationMode?: JobApplicationMode;
}

export const jobsConfig: Job[] = [
  {
    id: "job-001",
    title: "Junior Full-Stack Developer",
    company: "TechEthiopia",
    location: "Addis Ababa, Ethiopia",
    type: "Full-Time",
    level: "Entry Level",
    salary: "$800 – $1,200 / month",
    description: "We are looking for a passionate Junior Full-Stack Developer to join our growing team. You will work on exciting web applications using React and Node.js.",
    requirements: ["1+ year experience with React", "Basic Node.js knowledge", "Understanding of REST APIs", "Git version control"],
    responsibilities: ["Build responsive web interfaces", "Collaborate with backend team", "Write clean maintainable code", "Participate in code reviews"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-09-30",
    status: "open",
    postedAt: "2026-08-01",
    category: "Development",
  },
  {
    id: "job-002",
    title: "Odoo ERP Consultant",
    company: "LogiSoft Solutions",
    location: "Addis Ababa, Ethiopia",
    type: "Full-Time",
    level: "Mid Level",
    salary: "$1,000 – $1,500 / month",
    description: "Join LogiSoft as an Odoo ERP Consultant and help businesses streamline their operations through customized Odoo implementations.",
    requirements: ["2+ years Odoo experience", "Knowledge of accounting modules", "Python basics", "Strong communication skills"],
    responsibilities: ["Implement Odoo modules for clients", "Train end users", "Customize Odoo workflows", "Provide ongoing support"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-09-15",
    status: "open",
    postedAt: "2026-08-02",
    category: "ERP",
  },
  {
    id: "job-003",
    title: "Data Analyst Intern",
    company: "Kifiya Financial",
    location: "Addis Ababa, Ethiopia",
    type: "Internship",
    level: "Entry Level",
    salary: "$300 – $500 / month",
    description: "Kickstart your data career with Kifiya Financial. You will analyze financial data and create dashboards to support business decisions.",
    requirements: ["Python or SQL knowledge", "Basic statistics understanding", "Excel proficiency", "Currently enrolled or recent graduate"],
    responsibilities: ["Clean and analyze datasets", "Build data visualizations", "Support senior analysts", "Prepare weekly reports"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-08-31",
    status: "open",
    postedAt: "2026-08-03",
    category: "Data Science",
  },
  {
    id: "job-004",
    title: "AI/ML Engineer",
    company: "DataSpace Analytics",
    location: "Remote",
    type: "Remote",
    level: "Senior",
    salary: "$2,500 – $4,000 / month",
    description: "DataSpace is hiring a senior AI/ML Engineer to build and deploy machine learning models that power our analytics platform.",
    requirements: ["3+ years ML experience", "Python & TensorFlow expertise", "MLOps knowledge", "Experience with cloud platforms"],
    responsibilities: ["Design and train ML models", "Deploy models to production", "Optimize model performance", "Mentor junior engineers"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-10-15",
    status: "open",
    postedAt: "2026-08-04",
    category: "AI",
  },
  {
    id: "job-005",
    title: "n8n Automation Specialist",
    company: "AutoFlow Agency",
    location: "Remote",
    type: "Contract",
    level: "Mid Level",
    salary: "$500 – $1,000 / month",
    description: "We need an n8n specialist to build automated workflows for our clients integrating CRMs, communication tools, and APIs.",
    requirements: ["Hands-on n8n experience", "API integration knowledge", "Webhook configuration", "Problem-solving mindset"],
    responsibilities: ["Build n8n automation workflows", "Integrate third-party APIs", "Document workflows", "Support client onboarding"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-09-01",
    status: "open",
    postedAt: "2026-08-04",
    category: "Automation",
  },
  {
    id: "job-006",
    title: "UI/UX Designer",
    company: "CreativeLab ET",
    location: "Addis Ababa, Ethiopia",
    type: "Full-Time",
    level: "Mid Level",
    salary: "$700 – $1,200 / month",
    description: "CreativeLab is looking for a talented UI/UX Designer to craft beautiful, user-centered digital experiences for web and mobile.",
    requirements: ["Figma proficiency", "2+ years design experience", "Portfolio required", "Understanding of design systems"],
    responsibilities: ["Create wireframes and prototypes", "Conduct user research", "Collaborate with developers", "Maintain design system"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-09-20",
    status: "open",
    postedAt: "2026-08-05",
    category: "Design",
  },
  {
    id: "job-007",
    title: "Flutter Developer",
    company: "AppBuild Ethiopia",
    location: "Addis Ababa, Ethiopia",
    type: "Full-Time",
    level: "Entry Level",
    salary: "$600 – $1,000 / month",
    description: "AppBuild is seeking a Flutter Developer to build cross-platform mobile applications for fintech and e-commerce clients.",
    requirements: ["Flutter & Dart knowledge", "Firebase experience", "REST API integration", "Published app is a plus"],
    responsibilities: ["Develop Flutter mobile apps", "Integrate backend APIs", "Write unit tests", "Submit apps to stores"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-10-01",
    status: "open",
    postedAt: "2026-08-06",
    category: "Development",
  },
  {
    id: "job-008",
    title: "IELTS Trainer",
    company: "SkillBridge Institute",
    location: "Addis Ababa, Ethiopia",
    type: "Part-Time",
    level: "Any Level",
    salary: "$400 – $700 / month",
    description: "SkillBridge is hiring experienced IELTS trainers to deliver high-quality preparation sessions to our students.",
    requirements: ["IELTS Band 7.5+ or CELTA", "1+ year teaching experience", "Strong communication skills", "Passion for education"],
    responsibilities: ["Deliver IELTS prep sessions", "Grade mock tests", "Provide student feedback", "Develop learning materials"],
    applyUrl: "https://forms.google.com/",
    deadline: "2026-09-10",
    status: "open",
    postedAt: "2026-08-06",
    category: "Language",
  },
];

export const JOB_CATEGORIES = ["All", "Development", "ERP", "Data Science", "AI", "Automation", "Design", "Language"];
export const JOB_TYPES: JobType[]  = ["Full-Time", "Part-Time", "Contract", "Internship", "Remote"];
export const JOB_LEVELS: JobLevel[] = ["Entry Level", "Mid Level", "Senior", "Lead", "Any Level"];

export const categoryColor: Record<string, string> = {
  Development:    "bg-[#1E90FF]/10 text-[#1E90FF]",
  ERP:            "bg-[#F57C00]/10 text-[#F57C00]",
  "Data Science": "bg-[#1E90FF]/10 text-[#1E90FF]",
  AI:             "bg-[#F57C00]/10 text-[#F57C00]",
  Automation:     "bg-[#1E90FF]/10 text-[#1E90FF]",
  Design:         "bg-[#F57C00]/10 text-[#F57C00]",
  Language:       "bg-[#1E90FF]/10 text-[#1E90FF]",
};

export const typeColor: Record<JobType, string> = {
  "Full-Time":  "bg-[#1E90FF]/10 text-[#1E90FF]",
  "Part-Time":  "bg-[#F57C00]/10 text-[#F57C00]",
  "Contract":   "bg-[#F57C00]/10 text-[#F57C00]",
  "Internship": "bg-[#1E90FF]/10 text-[#1E90FF]",
  "Remote":     "bg-[#F57C00]/10 text-[#F57C00]",
};

export function daysUntilDeadline(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}

export function isJobClosed(job: Job): boolean {
  if (job.status === "closed") return true;
  if (job.deadline) return daysUntilDeadline(job.deadline) < 0;
  return false;
}

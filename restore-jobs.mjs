/**
 * One-off restore script: re-inserts the 8 seed jobs into the Supabase
 * `jobs` table (which was wiped by the delete-all-then-failed-upsert bug).
 * Rows are inserted WITHOUT application_mode because that column does not
 * exist yet (Postgres 42703). Run: node restore-jobs.mjs
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iiqmjillefmnidyrcsdy.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_yhy1LLR9ABTihCIWbD1JJg_jSAzLGEq";

const jobs = [
  { id: "job-001", title: "Junior Full-Stack Developer", company: "TechEthiopia", location: "Addis Ababa, Ethiopia", type: "Full-Time", level: "Entry Level", salary: "$800 – $1,200 / month", description: "We are looking for a passionate Junior Full-Stack Developer to join our growing team. You will work on exciting web applications using React and Node.js.", requirements: ["1+ year experience with React", "Basic Node.js knowledge", "Understanding of REST APIs", "Git version control"], responsibilities: ["Build responsive web interfaces", "Collaborate with backend team", "Write clean maintainable code", "Participate in code reviews"], applyUrl: "https://forms.google.com/", deadline: "2026-09-30", status: "open", postedAt: "2026-08-01", category: "Development" },
  { id: "job-002", title: "Odoo ERP Consultant", company: "LogiSoft Solutions", location: "Addis Ababa, Ethiopia", type: "Full-Time", level: "Mid Level", salary: "$1,000 – $1,500 / month", description: "Join LogiSoft as an Odoo ERP Consultant and help businesses streamline their operations through customized Odoo implementations.", requirements: ["2+ years Odoo experience", "Knowledge of accounting modules", "Python basics", "Strong communication skills"], responsibilities: ["Implement Odoo modules for clients", "Train end users", "Customize Odoo workflows", "Provide ongoing support"], applyUrl: "https://forms.google.com/", deadline: "2026-09-15", status: "open", postedAt: "2026-08-02", category: "ERP" },
  { id: "job-003", title: "Data Analyst Intern", company: "Kifiya Financial", location: "Addis Ababa, Ethiopia", type: "Internship", level: "Entry Level", salary: "$300 – $500 / month", description: "Kickstart your data career with Kifiya Financial. You will analyze financial data and create dashboards to support business decisions.", requirements: ["Python or SQL knowledge", "Basic statistics understanding", "Excel proficiency", "Currently enrolled or recent graduate"], responsibilities: ["Clean and analyze datasets", "Build data visualizations", "Support senior analysts", "Prepare weekly reports"], applyUrl: "https://forms.google.com/", deadline: "2026-08-31", status: "open", postedAt: "2026-08-03", category: "Data Science" },
  { id: "job-004", title: "AI/ML Engineer", company: "DataSpace Analytics", location: "Remote", type: "Remote", level: "Senior", salary: "$2,500 – $4,000 / month", description: "DataSpace is hiring a senior AI/ML Engineer to build and deploy machine learning models that power our analytics platform.", requirements: ["3+ years ML experience", "Python & TensorFlow expertise", "MLOps knowledge", "Experience with cloud platforms"], responsibilities: ["Design and train ML models", "Deploy models to production", "Optimize model performance", "Mentor junior engineers"], applyUrl: "https://forms.google.com/", deadline: "2026-10-15", status: "open", postedAt: "2026-08-04", category: "AI" },
];

const rows = jobs.map(j => ({
  id: j.id, title: j.title, company: j.company, location: j.location,
  type: j.type, level: j.level, salary: j.salary, description: j.description,
  requirements: j.requirements, responsibilities: j.responsibilities,
  apply_url: j.applyUrl, deadline: j.deadline, status: j.status,
  posted_at: j.postedAt, category: j.category,
}));

export { SUPABASE_URL, SUPABASE_KEY, rows };

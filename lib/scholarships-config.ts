export type FundingType = "full" | "half";

export interface ScholarshipConfig {
  id: string;
  nameKey: string;
  displayName: string;       // proper human-readable name
  courseName: string;        // proper course display name
  courseId: string;
  applicationsCount: number;
  deadline: string;
  winnersCount: number;
  eligibilityKey: string;
  eligibility: string;       // human-readable eligibility text
  fundingType: FundingType;
  tuitionAmount: number;
  applicationFormUrl?: string;
}

export interface ScholarshipWinner {
  id: string;
  name: string;
  image: string;
  scholarshipKey: string;
  year: number;
}

export const scholarshipsConfig: ScholarshipConfig[] = [
  {
    id: "full-stack",
    nameKey: "fullStack",
    displayName: "Full-Stack Scholarship",
    courseName: "Full-Stack Development",
    courseId: "full-stack-development",
    applicationsCount: 42,
    deadline: "2026-09-30",
    winnersCount: 3,
    eligibilityKey: "fullStack",
    eligibility: "Top performer in Python and Web Development courses",
    fundingType: "full",
    tuitionAmount: 500,
  },
  {
    id: "odoo-functional",
    nameKey: "odooFunctional",
    displayName: "Odoo Functional Scholarship",
    courseName: "Odoo Functional ERP",
    courseId: "odoo-functional-erp",
    applicationsCount: 28,
    deadline: "2026-09-30",
    winnersCount: 2,
    eligibilityKey: "odooFunctional",
    eligibility: "Strong interest in ERP and business processes",
    fundingType: "half",
    tuitionAmount: 400,
  },
  {
    id: "python",
    nameKey: "python",
    displayName: "Python Scholarship",
    courseName: "Python Programming",
    courseId: "python-programming",
    applicationsCount: 56,
    deadline: "2026-10-15",
    winnersCount: 3,
    eligibilityKey: "python",
    eligibility: "Demonstrated programming aptitude and financial need",
    fundingType: "full",
    tuitionAmount: 350,
  },
  {
    id: "ai",
    nameKey: "ai",
    displayName: "AI & Machine Learning Scholarship",
    courseName: "AI & Machine Learning",
    courseId: "ai-machine-learning",
    applicationsCount: 35,
    deadline: "2026-08-14",
    winnersCount: 2,
    eligibilityKey: "ai",
    eligibility: "Background in mathematics and programming",
    fundingType: "half",
    tuitionAmount: 600,
  },
  {
    id: "data-science",
    nameKey: "dataScience",
    displayName: "Data Science Scholarship",
    courseName: "Data Science",
    courseId: "data-science",
    applicationsCount: 20,
    deadline: "2026-07-31",
    winnersCount: 2,
    eligibilityKey: "dataScience",
    eligibility: "Strong analytical skills and interest in data-driven decision making",
    fundingType: "full",
    tuitionAmount: 450,
  },
];

export const scholarshipWinnersConfig: ScholarshipWinner[] = [
  { id: "winner-1", name: "Abebe Kebede",     image: "/images/testimonials/pp1.png", scholarshipKey: "fullStack",      year: 2024 },
  { id: "winner-2", name: "Tigist Haile",     image: "/images/testimonials/pp2.png", scholarshipKey: "odooFunctional", year: 2024 },
  { id: "winner-3", name: "Sara Mohammed",    image: "/images/testimonials/pp3.png", scholarshipKey: "ai",             year: 2024 },
  { id: "winner-4", name: "Yohannes Tadesse", image: "/images/testimonials/pp1.png", scholarshipKey: "python",         year: 2025 },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns days remaining until deadline (negative if past) */
export function daysRemaining(deadline: string): number {
  const now  = new Date();
  const dead = new Date(deadline);
  return Math.ceil((dead.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/** true when deadline has passed */
export function isClosed(deadline: string): boolean {
  return daysRemaining(deadline) < 0;
}

/** What the student pays based on funding type */
export function studentPays(tuitionAmount: number, fundingType: FundingType): number {
  return fundingType === "full" ? 0 : Math.round(tuitionAmount * 0.5);
}

/** Coverage label */
export function coverageLabel(fundingType: FundingType): string {
  return fundingType === "full" ? "Fully Funded" : "Half Funded";
}

export type FundingType = "full" | "half";

export interface ScholarshipConfig {
  id: string;
  nameKey: string;
  courseId: string;
  applicationsCount: number;
  deadline: string;
  winnersCount: number;
  eligibilityKey: string;
  fundingType: FundingType;
  tuitionAmount: number;
  applicationFormUrl?: string; // custom URL set by admin (Google Form, Typeform, etc.)
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
    courseId: "full-stack-development",
    applicationsCount: 42,
    deadline: "2026-09-30",
    winnersCount: 3,
    eligibilityKey: "fullStack",
    fundingType: "full",
    tuitionAmount: 25000,
  },
  {
    id: "odoo-functional",
    nameKey: "odooFunctional",
    courseId: "odoo-functional-erp",
    applicationsCount: 28,
    deadline: "2026-09-30",
    winnersCount: 2,
    eligibilityKey: "odooFunctional",
    fundingType: "half",
    tuitionAmount: 20000,
  },
  {
    id: "python",
    nameKey: "python",
    courseId: "python-programming",
    applicationsCount: 56,
    deadline: "2026-10-15",
    winnersCount: 3,
    eligibilityKey: "python",
    fundingType: "full",
    tuitionAmount: 18000,
  },
  {
    id: "ai",
    nameKey: "ai",
    courseId: "ai-machine-learning",
    applicationsCount: 35,
    deadline: "2026-08-14",   // closing soon — < 7 days from Aug 7
    winnersCount: 2,
    eligibilityKey: "ai",
    fundingType: "half",
    tuitionAmount: 30000,
  },
  {
    id: "data-science",
    nameKey: "dataScience",
    courseId: "data-science",
    applicationsCount: 20,
    deadline: "2026-07-31",   // already past → archived
    winnersCount: 2,
    eligibilityKey: "dataScience",
    fundingType: "full",
    tuitionAmount: 22000,
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

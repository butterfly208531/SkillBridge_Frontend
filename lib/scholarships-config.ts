export interface ScholarshipConfig {
  id: string;
  nameKey: string;
  courseId: string;
  applicationsCount: number;
  deadline: string;
  winnersCount: number;
  eligibilityKey: string;
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
    deadline: "2025-08-31",
    winnersCount: 3,
    eligibilityKey: "fullStack",
  },
  {
    id: "odoo-functional",
    nameKey: "odooFunctional",
    courseId: "odoo-functional-erp",
    applicationsCount: 28,
    deadline: "2025-08-31",
    winnersCount: 2,
    eligibilityKey: "odooFunctional",
  },
  {
    id: "python",
    nameKey: "python",
    courseId: "python-programming",
    applicationsCount: 56,
    deadline: "2025-09-15",
    winnersCount: 3,
    eligibilityKey: "python",
  },
  {
    id: "ai",
    nameKey: "ai",
    courseId: "ai-machine-learning",
    applicationsCount: 35,
    deadline: "2025-09-15",
    winnersCount: 2,
    eligibilityKey: "ai",
  },
];

export const scholarshipWinnersConfig: ScholarshipWinner[] = [
  {
    id: "winner-1",
    name: "Abebe Kebede",
    image: "/images/testimonials/pp1.png",
    scholarshipKey: "fullStack",
    year: 2024,
  },
  {
    id: "winner-2",
    name: "Tigist Haile",
    image: "/images/testimonials/pp2.png",
    scholarshipKey: "odooFunctional",
    year: 2024,
  },
  {
    id: "winner-3",
    name: "Sara Mohammed",
    image: "/images/testimonials/pp3.png",
    scholarshipKey: "ai",
    year: 2024,
  },
  {
    id: "winner-4",
    name: "Yohannes Tadesse",
    image: "/images/testimonials/pp1.png",
    scholarshipKey: "python",
    year: 2025,
  },
];

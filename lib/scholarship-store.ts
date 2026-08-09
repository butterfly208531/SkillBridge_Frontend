/**
 * Client-side scholarship store using localStorage.
 * Admin writes → public pages read.
 * Falls back to scholarships-config.ts if no admin data saved.
 */

import { scholarshipsConfig, scholarshipWinnersConfig, type ScholarshipConfig, type FundingType } from "./scholarships-config";

const STORAGE_KEY         = "sb_scholarships_v1";
const WINNERS_STORAGE_KEY = "sb_scholarship_winners_v1";

// ── Winner store ─────────────────────────────────────────────────────────────

export interface StoredWinner {
  id: string;
  name: string;
  image: string;     // URL — "" falls back to initials avatar on public page
  scholarship: string; // display name of the scholarship
  year: number;
  status: "active" | "inactive";
}

/** Read all winners — returns admin-saved data or falls back to static config */
export function getStoredWinners(): StoredWinner[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WINNERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  // Fallback: derive from static config
  return scholarshipWinnersConfig.map(w => ({
    id:         w.id,
    name:       w.name,
    image:      w.image,
    scholarship: w.scholarshipKey.replace(/([A-Z])/g, " $1").trim() + " Scholarship",
    year:       w.year,
    status:     "active" as const,
  }));
}

/** Save winners to localStorage */
export function saveWinners(data: StoredWinner[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WINNERS_STORAGE_KEY, JSON.stringify(data));
}

export interface StoredScholarship {
  id: string;
  name: string;
  courseId: string;
  course: string;
  applicationsCount: number;
  winnersCount: number;
  deadline: string;
  eligibility: string;
  status: string;
  fundingType: FundingType;
  tuitionAmount: number;
  applicationFormUrl: string; // empty = use default course form
}

function configToStored(s: ScholarshipConfig, name: string, eligibility: string): StoredScholarship {
  return {
    id: s.id,
    name,
    courseId: s.courseId,
    course: s.courseId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    applicationsCount: s.applicationsCount,
    winnersCount: s.winnersCount,
    deadline: s.deadline,
    eligibility,
    status: "active",
    fundingType: s.fundingType,
    tuitionAmount: s.tuitionAmount,
    applicationFormUrl: s.applicationFormUrl || "",
  };
}

/** Read all scholarships — returns admin-saved data or falls back to config */
export function getStoredScholarships(): StoredScholarship[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

/** Save scholarships to localStorage */
export function saveScholarships(data: StoredScholarship[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Get the application form URL for a specific scholarship ID */
export function getApplicationFormUrl(scholarshipId: string, fallbackCourseId: string): string {
  const stored = getStoredScholarships();
  const match = stored.find(s => s.id === scholarshipId);
  if (match?.applicationFormUrl) return match.applicationFormUrl;
  return `/courses/${fallbackCourseId}/ApplicationForm`;
}

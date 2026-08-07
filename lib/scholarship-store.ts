/**
 * Client-side scholarship store using localStorage.
 * Admin writes → public pages read.
 * Falls back to scholarships-config.ts if no admin data saved.
 */

import { scholarshipsConfig, type ScholarshipConfig, type FundingType } from "./scholarships-config";

const STORAGE_KEY = "sb_scholarships_v1";

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

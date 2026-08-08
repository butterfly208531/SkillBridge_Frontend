/**
 * Client-side jobs store using localStorage.
 * Admin writes → public pages read.
 * Falls back to jobsConfig if no admin data saved.
 */

import { jobsConfig, type Job } from "./jobs-config";

const STORAGE_KEY = "sb_jobs_v1";

/** Read all jobs — returns admin-saved data or falls back to empty array */
export function getStoredJobs(): Job[] {
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

/** Save jobs to localStorage */
export function saveJobs(data: Job[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Get jobs for public display — API data saved by admin, then localStorage, then static config */
export function getPublicJobs(): Job[] {
  const stored = getStoredJobs();
  return stored.length > 0 ? stored : jobsConfig;
}

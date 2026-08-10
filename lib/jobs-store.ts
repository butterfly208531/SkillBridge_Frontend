/**
 * Client-side jobs store using localStorage.
 * Admin writes → public pages read.
 * Falls back to jobsConfig if no admin data saved.
 */

import { jobsConfig, type Job } from "./jobs-config";

const STORAGE_KEY = "sb_jobs_v1";
const INIT_KEY    = "sb_jobs_init_v1";

/** Read all jobs from localStorage — returns the raw saved array (may be empty) */
export function getStoredJobs(): Job[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * True once admin has published jobs data (even an empty list).
 * Used to distinguish "no data yet" (fall back to static config)
 * from "admin deleted everything" (show empty state).
 */
export function isJobsInitialized(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(INIT_KEY) === "1") return true;
    return getStoredJobs().length > 0;
  } catch {
    return false;
  }
}

/** Save jobs to localStorage */
export function saveJobs(data: Job[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(INIT_KEY, "1");
}

/** Get jobs for public display — stored data once admin has initialized, else static config */
export function getPublicJobs(): Job[] {
  return isJobsInitialized() ? getStoredJobs() : jobsConfig;
}

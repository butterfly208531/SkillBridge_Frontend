/**
 * Shared cloud store for jobs (jsonblob.com — free, no account, CORS-enabled).
 *
 * The admin writes the full jobs list here so public pages on ANY device
 * can read it. This makes admin adds/edits/deletes visible everywhere instead
 * of only in the admin's own browser localStorage.
 *
 * Flow:
 *   - Admin mutates a job  -> pushSharedJobs(getStoredJobs())
 *   - Public page loads    -> syncSharedJobsToLocal() then reads localStorage
 *
 * localStorage stays the fast local cache; the shared blob is the portable source.
 */

import { getStoredJobs, saveJobs } from "./jobs-store";
import type { Job } from "./jobs-config";

// Public jsonblob ID for the SkillBridge jobs store. Recreate a blob at
// https://jsonblob.com and paste its UUID here if this one ever needs replacing.
export const SHARED_JOBS_URL =
  "https://jsonblob.com/api/jsonBlob/019feda5-47a8-7b2f-9755-946971691527";

const FETCH_TIMEOUT_MS = 8000;

interface SharedPayload {
  jobs: Job[];
}

async function httpJson(method: "GET" | "PUT", body?: SharedPayload): Promise<SharedPayload> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHARED_JOBS_URL, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Shared store returned ${res.status}`);
    return (await res.json()) as SharedPayload;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Write the full jobs list to the shared cloud store.
 * Returns true on success, false if the store is unreachable.
 */
export async function pushSharedJobs(jobs: Job[]): Promise<boolean> {
  try {
    await httpJson("PUT", { jobs });
    return true;
  } catch {
    return false;
  }
}

/**
 * Pull the latest admin-published jobs from the shared store into localStorage
 * so existing components that read getStoredJobs() automatically see admin
 * changes from other devices. Never throws — a failed fetch keeps local data.
 */
export async function syncSharedJobsToLocal(): Promise<void> {
  try {
    const data = await httpJson("GET");
    if (Array.isArray(data.jobs)) saveJobs(data.jobs);
  } catch {
    // store unreachable — keep local data as-is
  }
}

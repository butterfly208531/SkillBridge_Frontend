/**
 * Shared cloud store for jobs (Supabase-backed).
 * Admin writes → public pages read via the `jobs` table.
 * localStorage stays the fast local cache; Supabase is the portable source.
 */

import { getStoredJobs, saveJobs } from "./jobs-store";
import type { Job } from "./jobs-config";
import { getJobsSupabase, pushJobsSupabase } from "./jobs-supabase";

/**
 * Write the full jobs list to Supabase.
 * Returns true on success, false if Supabase is unreachable/not configured.
 */
export async function pushSharedJobs(jobs: Job[]): Promise<boolean> {
  return pushJobsSupabase(jobs);
}

/**
 * Pull the latest admin-published jobs from Supabase into localStorage.
 * Never throws — a failed fetch keeps local data.
 */
export async function syncSharedJobsToLocal(): Promise<void> {
  try {
    const jobs = await getJobsSupabase();
    if (jobs === null) return; // fetch failed / not configured — keep local data
    saveJobs(jobs); // honor empty lists so deleted jobs stay deleted
  } catch {
    // store unreachable — keep local data as-is
  }
}

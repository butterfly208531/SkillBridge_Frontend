/**
 * Supabase-backed jobs store — replaces the jsonblob shared store.
 * Admin writes → public pages read, all through the `jobs` table.
 */

import { supabase } from "./supabase";
import type { Job, JobStatus, JobApplicationMode } from "./jobs-config";

function mapRow(row: any): Job {
  return {
    id: row.id,
    title: row.title,
    company: row.company ?? "",
    location: row.location ?? "",
    type: row.type ?? "Full-Time",
    level: row.level ?? "Any Level",
    salary: row.salary ?? "",
    description: row.description ?? "",
    requirements: row.requirements ?? [],
    responsibilities: row.responsibilities ?? [],
    applyUrl: row.apply_url ?? "",
    deadline: row.deadline ?? "",
    status: (row.status ?? "open") as JobStatus,
    postedAt: row.posted_at ?? "",
    category: row.category ?? "",
    logo: row.logo ?? "",
    applicationMode: (row.application_mode as JobApplicationMode) || "both",
  };
}

function mapJob(j: Job): any {
  return {
    id: j.id,
    title: j.title,
    company: j.company,
    location: j.location,
    type: j.type,
    level: j.level,
    salary: j.salary,
    description: j.description,
    requirements: j.requirements,
    responsibilities: j.responsibilities,
    apply_url: j.applyUrl,
    deadline: j.deadline,
    status: j.status,
    posted_at: j.postedAt,
    category: j.category,
    logo: j.logo,
    application_mode: j.applicationMode ?? "both",
  };
}

export async function getJobsSupabase(): Promise<Job[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("jobs").select("*");
  if (error) {
    console.warn("Supabase jobs read failed:", error.message);
    return null;
  }
  return (data ?? []).map(mapRow);
}

/**
 * Push the FULL jobs list. The pushed list is authoritative: any jobs that
 * were deleted from the admin panel are also removed from Supabase, so an
 * empty list here truly clears the table.
 *
 * Safety: rows are WRITTEN FIRST and stale rows are deleted AFTER a
 * successful write. The previous delete-all-then-upsert order could wipe
 * the whole table when the upsert failed (e.g. before the application_mode
 * column was added), which made every job disappear from the public site.
 */
export async function pushJobsSupabase(jobs: Job[]): Promise<boolean> {
  if (!supabase) return false;

  const toRows = (stripApplicationMode: boolean) =>
    jobs.map(j => {
      const m = mapJob(j);
      // If the application_mode column doesn't exist yet, omit it so the
      // write still succeeds and jobs are never lost.
      if (stripApplicationMode) delete m.application_mode;
      return m;
    });

  // 1. Write/refresh the published rows (upsert) — never delete anything first.
  if (jobs.length > 0) {
    const { error } = await supabase.from("jobs").upsert(toRows(false));
    if (error) {
      // Retry without application_mode if that column is missing (42703/PGRST204).
      if (error.message?.toLowerCase().includes("application_mode")) {
        const { error: retryErr } = await supabase.from("jobs").upsert(toRows(true));
        if (retryErr) {
          console.warn("Supabase jobs write failed:", retryErr.message);
          return false;
        }
      } else {
        console.warn("Supabase jobs write failed:", error.message);
        return false;
      }
    }
  }

  // 2. Delete only the rows that are no longer part of the published list.
  const { data: existing, error: readErr } = await supabase.from("jobs").select("id");
  if (readErr) {
    console.warn("Supabase jobs read failed:", readErr.message);
    return false;
  }
  const keepIds = new Set(jobs.map(j => j.id));
  const staleIds = (existing ?? []).map((r: { id: string }) => r.id).filter(id => !keepIds.has(id));
  if (staleIds.length > 0) {
    const { error: delErr } = await supabase.from("jobs").delete().in("id", staleIds);
    if (delErr) {
      console.warn("Supabase jobs delete failed:", delErr.message);
      return false;
    }
  }
  return true;
}

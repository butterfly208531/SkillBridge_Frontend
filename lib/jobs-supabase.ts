/**
 * Supabase-backed jobs store — replaces the jsonblob shared store.
 * Admin writes → public pages read, all through the `jobs` table.
 */

import { supabase } from "./supabase";
import type { Job, JobStatus } from "./jobs-config";

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
 */
export async function pushJobsSupabase(jobs: Job[]): Promise<boolean> {
  if (!supabase) return false;
  const { error: delErr } = await supabase.from("jobs").delete().neq("id", "~~noop~~");
  if (delErr) {
    console.warn("Supabase jobs clear failed:", delErr.message);
    return false;
  }
  if (jobs.length === 0) return true;
  const { error } = await supabase.from("jobs").upsert(jobs.map(mapJob));
  if (error) {
    console.warn("Supabase jobs write failed:", error.message);
    return false;
  }
  return true;
}

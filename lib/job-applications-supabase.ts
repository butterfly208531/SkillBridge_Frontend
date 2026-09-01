/**
 * Supabase-backed job applications store. Job application submissions are written to
 * the `job_applications` table so the admin panel on ANY device can read them.
 */

import { supabase } from "./supabase";

export interface StoredJobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  telegramHandle: string;
  address: string;
  gender: string;
  nationality: string;
  university: string;
  dateOfBirth: string;
  jobId: string;
  jobTitle: string;
  company: string;
  coverLetter: string;
  marketingSource: string;
  submittedAt: string;
  status: string;
  read: boolean;
}

function mapRow(row: any): StoredJobApplication {
  return {
    id: row.id,
    fullName: row.full_name ?? "",
    email: row.email ?? "",
    phone: row.phone ?? "",
    telegramHandle: row.telegram_handle ?? "",
    address: row.address ?? "",
    gender: row.gender ?? "",
    nationality: row.nationality ?? "",
    university: row.university ?? "",
    dateOfBirth: row.date_of_birth ?? "",
    jobId: row.job_id ?? "",
    jobTitle: row.job_title ?? "",
    company: row.company ?? "",
    coverLetter: row.cover_letter ?? "",
    marketingSource: row.marketing_source ?? "",
    submittedAt: row.submitted_at ?? "",
    status: row.status ?? "new",
    read: row.read ?? false,
  };
}

function mapApplication(a: StoredJobApplication): any {
  return {
    id: a.id,
    full_name: a.fullName,
    email: a.email,
    phone: a.phone,
    telegram_handle: a.telegramHandle,
    address: a.address,
    gender: a.gender,
    nationality: a.nationality,
    university: a.university,
    date_of_birth: a.dateOfBirth,
    job_id: a.jobId,
    job_title: a.jobTitle,
    company: a.company,
    cover_letter: a.coverLetter,
    marketing_source: a.marketingSource,
    submitted_at: a.submittedAt,
    status: a.status,
    read: a.read,
  };
}

export async function getJobApplicationsSupabase(): Promise<StoredJobApplication[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) {
    console.warn("Supabase job applications read failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export async function addJobApplicationSupabase(app: StoredJobApplication): Promise<boolean> {
  if (!supabase) return false;
  let { error } = await supabase.from("job_applications").upsert(mapApplication(app));
  if (error) {
    console.warn("Supabase job application write failed:", error.message);
    return false;
  }
  return true;
}

export async function updateJobApplicationSupabase(
  id: string,
  updates: Partial<Pick<StoredJobApplication, "status" | "read">>,
): Promise<boolean> {
  if (!supabase) return false;
  const row: any = {};
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.read !== undefined) row.read = updates.read;
  const { error } = await supabase.from("job_applications").update(row).eq("id", id);
  if (error) {
    console.warn("Supabase job application update failed:", error.message);
    return false;
  }
  return true;
}

export async function deleteJobApplicationSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("job_applications").delete().eq("id", id);
  if (error) {
    console.warn("Supabase job application delete failed:", error.message);
    return false;
  }
  return true;
}

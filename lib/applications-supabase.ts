/**
 * Supabase-backed applications store. Application submissions are written to
 * the `applications` table so the admin panel on ANY device can read them —
 * even when the backend API is down.
 */

import { supabase } from "./supabase";

export interface StoredApplication {
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
  courseSlug: string;
  courseName: string;
  courseType: string;
  paymentMethod: string;
  marketingSource: string;
  submittedAt: string;
  status: string;
  read: boolean;
}

function mapRow(row: any): StoredApplication {
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
    courseSlug: row.course_slug ?? "",
    courseName: row.course_name ?? "",
    courseType: row.course_type ?? "",
    paymentMethod: row.payment_method ?? "",
    marketingSource: row.marketing_source ?? "",
    submittedAt: row.submitted_at ?? "",
    status: row.status ?? "new",
    read: row.read ?? false,
  };
}

function mapApplication(a: StoredApplication): any {
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
    course_slug: a.courseSlug,
    course_name: a.courseName,
    course_type: a.courseType,
    payment_method: a.paymentMethod,
    marketing_source: a.marketingSource,
    submitted_at: a.submittedAt,
    status: a.status,
    read: a.read,
  };
}

export async function getApplicationsSupabase(): Promise<StoredApplication[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("submitted_at", { ascending: false });
  if (error) {
    console.warn("Supabase applications read failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapRow);
}

export async function addApplicationSupabase(app: StoredApplication): Promise<boolean> {
  if (!supabase) return false;
  let { error } = await supabase.from("applications").upsert(mapApplication(app));
  if (error) {
    // Cleaner first write fails a column, strip it and retry so submissions
    // are never blocked (e.g. course_type / payment_method not yet added).
    if (error.message?.toLowerCase().includes("course_type") || error.message?.toLowerCase().includes("payment_method")) {
      const row = mapApplication(app);
      delete row.course_type;
      delete row.payment_method;
      const { error: retryErr } = await supabase.from("applications").upsert(row);
      if (retryErr) {
        console.warn("Supabase application write failed:", retryErr.message);
        return false;
      }
      return true;
    }
    console.warn("Supabase application write failed:", error.message);
    return false;
  }
  return true;
}

export async function updateApplicationSupabase(
  id: string,
  updates: Partial<Pick<StoredApplication, "status" | "read">>,
): Promise<boolean> {
  if (!supabase) return false;
  const row: any = {};
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.read !== undefined) row.read = updates.read;
  const { error } = await supabase.from("applications").update(row).eq("id", id);
  if (error) {
    console.warn("Supabase application update failed:", error.message);
    return false;
  }
  return true;
}

export async function deleteApplicationSupabase(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) {
    console.warn("Supabase application delete failed:", error.message);
    return false;
  }
  return true;
}

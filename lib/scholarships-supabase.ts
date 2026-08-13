/**
 * Supabase-backed scholarships + winners store — replaces the jsonblob shared store.
 * Admin writes → public pages read, through the `scholarships` and
 * `scholarship_winners` tables.
 */

import { supabase } from "./supabase";
import type {
  StoredScholarship,
  StoredWinner,
} from "./scholarship-store";
import type { FundingType } from "./scholarships-config";

function mapScholarshipRow(row: any): StoredScholarship {
  return {
    id: row.id,
    name: row.name,
    courseId: row.course_id ?? "",
    course: row.course ?? "",
    applicationsCount: Number(row.applications_count ?? 0),
    winnersCount: Number(row.winners_count ?? 0),
    deadline: row.deadline ?? "",
    eligibility: row.eligibility ?? "",
    status: row.status ?? "active",
    fundingType: (row.funding_type ?? "full") as FundingType,
    tuitionAmount: Number(row.tuition_amount ?? 0),
    applicationFormUrl: row.application_form_url ?? "",
  };
}

function mapScholarship(s: StoredScholarship): any {
  return {
    id: s.id,
    name: s.name,
    course_id: s.courseId,
    course: s.course,
    applications_count: s.applicationsCount,
    winners_count: s.winnersCount,
    deadline: s.deadline,
    eligibility: s.eligibility,
    status: s.status,
    funding_type: s.fundingType,
    tuition_amount: s.tuitionAmount,
    application_form_url: s.applicationFormUrl,
  };
}

function mapWinnerRow(row: any): StoredWinner {
  return {
    id: row.id,
    name: row.name,
    image: row.image ?? "",
    scholarship: row.scholarship ?? "",
    year: Number(row.year ?? 0),
    status: (row.status ?? "active") as "active" | "inactive",
  };
}

function mapWinner(w: StoredWinner): any {
  return {
    id: w.id,
    name: w.name,
    image: w.image,
    scholarship: w.scholarship,
    year: w.year,
    status: w.status,
  };
}

export async function getScholarshipsSupabase(): Promise<{
  scholarships: StoredScholarship[];
  winners: StoredWinner[];
} | null> {
  if (!supabase) return null;
  const [scholarshipsRes, winnersRes] = await Promise.all([
    supabase.from("scholarships").select("*"),
    supabase.from("scholarship_winners").select("*"),
  ]);
  if (scholarshipsRes.error) {
    console.warn("Supabase scholarships read failed:", scholarshipsRes.error.message);
    return null;
  }
  if (winnersRes.error) {
    console.warn("Supabase scholarship winners read failed:", winnersRes.error.message);
    return null;
  }
  return {
    scholarships: (scholarshipsRes.data ?? []).map(mapScholarshipRow),
    winners: (winnersRes.data ?? []).map(mapWinnerRow),
  };
}

/**
 * Push the FULL scholarships + winners lists. The pushed lists are
 * authoritative: anything deleted from the admin panel is also removed from
 * Supabase, so empty lists truly clear the tables.
 */
export async function pushScholarshipsSupabase(
  scholarships: StoredScholarship[],
  winners: StoredWinner[],
): Promise<boolean> {
  if (!supabase) return false;
  const [sDel, wDel] = await Promise.all([
    supabase.from("scholarships").delete().neq("id", "~~noop~~"),
    supabase.from("scholarship_winners").delete().neq("id", "~~noop~~"),
  ]);
  if (sDel.error) {
    console.warn("Supabase scholarships clear failed:", sDel.error.message);
    return false;
  }
  if (wDel.error) {
    console.warn("Supabase scholarship winners clear failed:", wDel.error.message);
    return false;
  }
  if (scholarships.length === 0 && winners.length === 0) return true;
  const [sRes, wRes] = await Promise.all([
    supabase.from("scholarships").upsert(scholarships.map(mapScholarship)),
    supabase.from("scholarship_winners").upsert(winners.map(mapWinner)),
  ]);
  if (sRes.error) {
    console.warn("Supabase scholarships write failed:", sRes.error.message);
    return false;
  }
  if (wRes.error) {
    console.warn("Supabase scholarship winners write failed:", wRes.error.message);
    return false;
  }
  return true;
}

/**
 * Supabase-backed course store — replaces the jsonblob shared store.
 *
 * Admin writes the full courses list to the `courses` table in Supabase and
 * public pages on ANY device read it from there. The built-in seed
 * (lib/courses-seed.ts) stays as the offline/fallback source so the site is
 * never empty, even if Supabase is unreachable or the keys aren't configured.
 *
 * Flow:
 *   - Admin mutates a course  -> pushCoursesSupabase(getStoredCourses())
 *   - Public page loads       -> getCoursesSupabase() then merges into localStorage
 */

import { supabase } from "./supabase";
import type { StoredCourse } from "./courses-store";

interface CourseRow {
  id: string;
  title: string;
  duration: string | null;
  category: string | null;
  category_id: string | null;
  status: string | null;
  image_url: string | null;
  admin_image_url: string | null;
  rating: number | null;
  short_description: string | null;
  learning_outcomes: string[] | null;
  price_original: number | null;
  price_discounted: number | null;
  start_date: string | null;
  created_at: string | null;
  priority: number | null;
  level: string | null;
  mode: string | null;
}

function mapRow(row: CourseRow): StoredCourse {
  return {
    id: row.id,
    title: row.title,
    duration: row.duration ?? "",
    category: row.category ?? "",
    categoryId: row.category_id ?? "",
    status: row.status === "draft" ? "draft" : "active",
    imageUrl: row.image_url ?? "",
    adminImageUrl: row.admin_image_url ?? undefined,
    rating: Number(row.rating ?? 0),
    shortDescription: row.short_description ?? "",
    learningOutcomes: row.learning_outcomes ?? [],
    priceOriginal: Number(row.price_original ?? 0),
    priceDiscounted: Number(row.price_discounted ?? 0),
    startDate: row.start_date ?? "",
    createdAt: row.created_at ?? "",
    priority: Number(row.priority ?? 0),
    level: row.level ?? "",
    mode: row.mode ?? "",
  };
}

function mapCourse(c: StoredCourse): CourseRow {
  return {
    id: c.id,
    title: c.title,
    duration: c.duration,
    category: c.category,
    category_id: c.categoryId,
    status: c.status,
    image_url: c.imageUrl,
    admin_image_url: c.adminImageUrl ?? null,
    rating: c.rating,
    short_description: c.shortDescription,
    learning_outcomes: c.learningOutcomes,
    price_original: c.priceOriginal,
    price_discounted: c.priceDiscounted,
    start_date: c.startDate,
    created_at: c.createdAt,
    priority: c.priority,
    level: c.level ?? null,
    mode: c.mode ?? null,
  };
}

/**
 * Read all published courses from Supabase, ordered by priority.
 * Returns [] if Supabase isn't configured or the fetch fails.
 */
export async function getCoursesSupabase(): Promise<StoredCourse[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("priority", { ascending: true });
  if (error) {
    console.warn("Supabase read failed:", error.message);
    return [];
  }
  return (data ?? []).map((row) => mapRow(row as CourseRow));
}

/**
 * Push the FULL courses list to Supabase. The pushed list is authoritative:
 * courses deleted from the admin panel are also removed from Supabase, so
 * deletions stick on every device. Returns true on success.
 */
export async function pushCoursesSupabase(courses: StoredCourse[]): Promise<boolean> {
  if (!supabase) return false;
  const { error: delErr } = await supabase.from("courses").delete().neq("id", "~~noop~~");
  if (delErr) {
    console.warn("Supabase courses clear failed:", delErr.message);
    return false;
  }
  if (courses.length === 0) return true;
  const { error } = await supabase
    .from("courses")
    .upsert(courses.map(mapCourse));
  if (error) {
    console.warn("Supabase write failed:", error.message);
    return false;
  }
  return true;
}

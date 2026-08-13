/**
 * Shared cloud store for courses (Supabase-backed).
 *
 * The admin writes the full courses list to the Supabase `courses` table here
 * so public pages on ANY device can read it. This is what makes admin-added
 * courses visible everywhere instead of only in the admin's own browser
 * localStorage.
 *
 * Flow:
 *   - Admin mutates a course  -> pushSharedCourses(getStoredCourses())
 *   - Public page loads       -> syncSharedCoursesToLocal() then reads localStorage
 *
 * localStorage stays the fast local cache; Supabase is the portable source.
 * If Supabase isn't configured or is unreachable, the built-in seed
 * (lib/courses-seed.ts) still guarantees the public pages show the 15 courses.
 */

import { getStoredCourses, saveCourses, type StoredCourse } from "./courses-store";
import { getCoursesSupabase, pushCoursesSupabase } from "./courses-supabase";

// Small in-memory cache so the homepage's multiple sections don't hammer Supabase.
let cached: { at: number; courses: StoredCourse[] } = { at: 0, courses: [] };
const CACHE_TTL_MS = 60_000;

/**
 * Write the full courses list to Supabase. Returns true on success, false if
 * Supabase is unreachable/not configured.
 *
 * The pushed list is authoritative: Supabase rows are replaced with the full
 * list, so admin deletions are honoured instead of being re-added. (The admin
 * pages sync from Supabase before every push, so a stale device can't wipe
 * another device's newer courses in practice.)
 */
export async function pushSharedCourses(courses: StoredCourse[]): Promise<boolean> {
  const ok = await pushCoursesSupabase(courses);
  if (ok) cached = { at: Date.now(), courses };
  return ok;
}

/**
 * Pull the latest admin-published courses from Supabase into localStorage so
 * existing components that read getStoredCourses() automatically see admin
 * courses from other devices. Admin-only local fields (adminImageUrl, priority)
 * are preserved. Never throws — a failed fetch simply keeps local data.
 */
export async function syncSharedCoursesToLocal(): Promise<void> {
  let shared: StoredCourse[];
  try {
    if (Date.now() - cached.at < CACHE_TTL_MS) {
      shared = cached.courses;
    } else {
      shared = await getCoursesSupabase();
      cached = { at: Date.now(), courses: shared };
    }
  } catch {
    return; // store unreachable — keep local data as-is
  }

  const local = getStoredCourses();
  const localMap = new Map(local.map(c => [c.id, c]));
  const merged = shared.map(c => {
    const l = localMap.get(c.id);
    if (!l) return c;
    return {
      ...c,
      adminImageUrl: l.adminImageUrl || c.adminImageUrl,
      // The shared store is the published truth — its priority order wins so a
      // device holding stale priorities can't clobber another device's reorder.
      priority: c.priority ?? l.priority,
    };
  });
  saveCourses(merged);
}

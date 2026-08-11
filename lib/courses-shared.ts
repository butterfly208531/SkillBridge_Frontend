/**
 * Shared cloud store for courses (jsonblob.com — free, no account, CORS-enabled).
 *
 * The admin writes the full courses list here so public pages on ANY device
 * can read it. This is what makes admin-added courses visible everywhere
 * instead of only in the admin's own browser localStorage.
 *
 * Flow:
 *   - Admin mutates a course  -> pushSharedCourses(getStoredCourses())
 *   - Public page loads       -> syncSharedCoursesToLocal() then reads localStorage
 *
 * localStorage stays the fast local cache; the shared blob is the portable source.
 */

import { getStoredCourses, saveCourses, type StoredCourse } from "./courses-store";

// Public jsonblob ID for the SkillBridge courses store. Recreate a blob at
// https://jsonblob.com and paste its UUID here if this one ever needs replacing.
export const SHARED_COURSES_URL =
  "https://jsonblob.com/api/jsonBlob/019fed7c-89d1-7f48-ab57-51864b9e9216";

const FETCH_TIMEOUT_MS = 8000;

// Small in-memory cache so the homepage's multiple sections don't hammer the store.
let cached: { at: number; courses: StoredCourse[] } = { at: 0, courses: [] };
const CACHE_TTL_MS = 60_000;

interface SharedPayload {
  courses: StoredCourse[];
}

async function httpJson(method: "GET" | "PUT", body?: SharedPayload): Promise<SharedPayload> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHARED_COURSES_URL, {
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
 * Write the full courses list to the shared cloud store.
 * Returns true on success, false if the store is unreachable.
 */
export async function pushSharedCourses(courses: StoredCourse[]): Promise<boolean> {
  try {
    await httpJson("PUT", { courses });
    cached = { at: Date.now(), courses };
    return true;
  } catch {
    return false;
  }
}

/**
 * Pull the latest admin-published courses from the shared store into localStorage
 * so existing components that read getStoredCourses() automatically see admin
 * courses from other devices. Admin-only local fields (adminImageUrl, priority)
 * are preserved. Never throws — a failed fetch simply keeps local data.
 */
export async function syncSharedCoursesToLocal(): Promise<void> {
  let shared: StoredCourse[];
  try {
    if (Date.now() - cached.at < CACHE_TTL_MS) {
      shared = cached.courses;
    } else {
      const data = await httpJson("GET");
      shared = Array.isArray(data.courses) ? data.courses : [];
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

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
 *
 * NOTE on size: jsonblob's anonymous API rejects request bodies larger than
 * 10 KB (HTTP 413). The courses list is therefore spread across several blob
 * URLs; each push/read touches every URL and the full list is re-assembled in
 * order. Add a new blob URL to SHARED_COURSES_URLS when the list outgrows the
 * current set (create it with: curl -X POST -H "Content-Type: application/json" \
 *   --data '{"courses":[]}' https://jsonblob.com/api/jsonBlob).
 */

import { getStoredCourses, saveCourses, type StoredCourse } from "./courses-store";

// Public jsonblob IDs for the SkillBridge courses store. Recreate a blob at
// https://jsonblob.com and paste its UUID here if one ever needs replacing.
// Order matters: chunk 0 lives in the first URL, chunk 1 in the second, etc.
export const SHARED_COURSES_URLS = [
  "https://jsonblob.com/api/jsonBlob/019fed7c-89d1-7f48-ab57-51864b9e9216",
  "https://jsonblob.com/api/jsonBlob/019fef36-adae-752e-9766-993d656ccf25",
];

// Stay comfortably under jsonblob's 10 KB request-body limit (10240 bytes).
const MAX_CHUNK_BYTES = 9000;

const FETCH_TIMEOUT_MS = 8000;

// Small in-memory cache so the homepage's multiple sections don't hammer the store.
let cached: { at: number; courses: StoredCourse[] } = { at: 0, courses: [] };
const CACHE_TTL_MS = 60_000;

interface SharedPayload {
  courses: StoredCourse[];
}

async function httpJson(
  url: string,
  method: "GET" | "PUT",
  body?: SharedPayload,
): Promise<SharedPayload> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
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
 * Split the courses list into chunks that each fit under jsonblob's 10 KB
 * request-body limit, keeping the global order intact.
 */
function chunkCourses(courses: StoredCourse[]): StoredCourse[][] {
  const chunks: StoredCourse[][] = [];
  let current: StoredCourse[] = [];
  for (const course of courses) {
    const candidate = [...current, course];
    if (current.length > 0 && JSON.stringify({ courses: candidate }).length > MAX_CHUNK_BYTES) {
      chunks.push(current);
      current = [course];
    } else {
      current = candidate;
    }
  }
  if (current.length) chunks.push(current);
  return chunks;
}

/**
 * Write the full courses list to the shared cloud store, chunked across the
 * blob URLs. Returns true on success, false if the store is unreachable or the
 * list needs more blobs than we currently have.
 */
export async function pushSharedCourses(courses: StoredCourse[]): Promise<boolean> {
  const chunks = chunkCourses(courses);
  if (chunks.length > SHARED_COURSES_URLS.length) {
    return false; // list outgrew the blob set — add another SHARED_COURSES_URLS entry
  }
  try {
    await Promise.all(
      chunks.map((coursesChunk, i) => httpJson(SHARED_COURSES_URLS[i], "PUT", { courses: coursesChunk })),
    );
    // Clear any trailing blobs we no longer use so stale courses can't reappear.
    for (let i = chunks.length; i < SHARED_COURSES_URLS.length; i++) {
      await httpJson(SHARED_COURSES_URLS[i], "PUT", { courses: [] }).catch(() => {});
    }
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
      const results = await Promise.all(
        SHARED_COURSES_URLS.map((url) => httpJson(url, "GET").catch(() => null)),
      );
      shared = results
        .filter((r): r is SharedPayload => r !== null)
        .flatMap((r) => (Array.isArray(r.courses) ? r.courses : []));
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

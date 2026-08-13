import { SEED_COURSES } from "./courses-seed";

/**
 * Client-side courses store using localStorage.
 * Admin writes → public pages read.
 *
 * Public pages should prefer getPublicCourses(): it starts from the built-in
 * SEED_COURSES so a device with empty/corrupt localStorage still shows the 15
 * courses, then overlays admin edits (from the shared store / localStorage).
 * Images only come from what the admin uploaded (adminImageUrl) or the backend
 * API (imageUrl) — never from config.
 */

const STORAGE_KEY = "sb_courses_v1";
const INIT_KEY    = "sb_courses_init_v1";

export interface StoredCourse {
  id: string;
  title: string;
  duration: string;
  category: string;
  categoryId: string;
  status: "active" | "draft";
  imageUrl: string;        // API / seeded image
  adminImageUrl?: string;  // explicitly set by admin — always wins
  rating: number;
  shortDescription: string;
  learningOutcomes: string[];  // "What You Will Learn" bullet points
  priceOriginal: number;
  priceDiscounted: number;
  startDate: string;
  createdAt: string;
  /** Display order on public pages. Lower number = higher position. Default 0. */
  priority: number;
  /** Optional extra fields carried in stored/shared data. */
  level?: string;
  mode?: string;
}

/**
 * Resolve the best image for a course to show on public pages.
 * Admin-uploaded image wins; otherwise fall back to the API image.
 * Config/static images are never used.
 */
export function getEffectiveImage(course: {
  id?: string;
  slug?: string;
  title?: string;
  imageUrl?: string;
  adminImageUrl?: string;
}): string {
  if (course.adminImageUrl) return course.adminImageUrl;
  return course.imageUrl || "";
}

// ── public API ─────────────────────────────────────────────

/**
 * Read all courses for the public site. Always returns a non-empty list:
 * it starts from the built-in seed courses, then overlays any admin-saved
 * localStorage data (matched by id or title) so edits/prices/images win.
 * Admin-added courses that aren't in the seed are appended too.
 */
export function getPublicCourses(): StoredCourse[] {
  const stored = getStoredCourses();
  if (stored.length === 0) return [...SEED_COURSES];

  const storedMap = new Map(stored.map((c) => [c.id, c]));
  const byTitle = new Map(
    stored.map((c) => [c.title.toLowerCase().trim(), c]),
  );

  const merged: StoredCourse[] = SEED_COURSES.map((seed) => {
    const override =
      storedMap.get(seed.id) ||
      byTitle.get(seed.title.toLowerCase().trim()) ||
      null;
    if (!override) return seed;
    return {
      ...seed,
      ...override,
      // id must stay stable across devices; title-matched overrides may carry
      // a different local id — keep the seed id for consistent routing.
      id: seed.id,
    };
  });

  // Append admin-created courses that don't match any seed course.
  // (Previously this loop was dead code: storedMap.has(s.id) is always true
  // for the very courses being iterated, so admin-added courses never showed.)
  for (const s of stored) {
    const matchesSeed =
      SEED_COURSES.some((c) => c.id === s.id) ||
      SEED_COURSES.some(
        (c) => c.title.toLowerCase().trim() === s.title.toLowerCase().trim()
      );
    if (!matchesSeed) {
      merged.push(s);
    }
  }

  return merged;
}

/** Read all courses saved by admin — returns the raw saved array (may be empty) */
export function getStoredCourses(): StoredCourse[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

/**
 * True once admin has published courses data (even an empty list).
 * Used to distinguish "no data yet" from "admin deleted everything".
 */
export function isCoursesInitialized(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(INIT_KEY) === "1") return true;
    return getStoredCourses().length > 0;
  } catch {
    return false;
  }
}

/** Save the full courses array to localStorage */
export function saveCourses(data: StoredCourse[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(INIT_KEY, "1");
}

/** Add a new course and persist */
export function addCourse(course: Omit<StoredCourse, "id" | "createdAt">): StoredCourse {
  const newCourse: StoredCourse = {
    ...course,
    id:        `course-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const all = getStoredCourses();
  saveCourses([newCourse, ...all]);
  return newCourse;
}

/** Update an existing course by id and persist */
export function updateCourse(id: string, updates: Partial<StoredCourse>): boolean {
  const all = getStoredCourses();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], ...updates };
  saveCourses(all);
  return true;
}

/** Delete a course by id and persist */
export function deleteCourse(id: string): boolean {
  const all = getStoredCourses();
  const next = all.filter(c => c.id !== id);
  if (next.length === all.length) return false;
  saveCourses(next);
  return true;
}

/** Toggle a course's status between active and draft */
export function toggleCourseStatus(id: string): boolean {
  const all = getStoredCourses();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return false;
  all[idx].status = all[idx].status === "active" ? "draft" : "active";
  saveCourses(all);
  return true;
}

/**
 * Move a course one position up (lower priority number) or down.
 * Operates on the same priority-sorted sequence the public page shows, then
 * re-normalises priorities to 0..n-1 so a move always has a visible effect
 * even when courses share the same priority value.
 */
export function moveCourse(id: string, direction: "up" | "down"): boolean {
  const all = [...getStoredCourses()].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return false;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return false;
  // Swap the actual courses, not just their priority values
  const tmp = all[idx];
  all[idx] = all[swapIdx];
  all[swapIdx] = tmp;
  // Re-normalise so the new order is fully reflected in the priority field
  all.forEach((c, i) => { c.priority = i; });
  saveCourses(all);
  return true;
}

/**
 * Client-side courses store using localStorage.
 * Admin writes → public pages read.
 * Falls back to coursesConfig static data if no admin data saved yet.
 *
 * Image priority (highest → lowest):
 *   1. adminImageUrl  — explicitly uploaded/saved by admin in the modal
 *   2. config image   — curated Unsplash image from coursesConfig (matched by slug/title)
 *   3. imageUrl       — whatever the backend API returned
 */

import { coursesConfig } from "./courses-config";

const STORAGE_KEY = "sb_courses_v1";

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
}

// ── config image lookups ───────────────────────────────────

const configImageBySlug: Record<string, string> = {};
const configImageByTitle: Record<string, string> = {};
coursesConfig.forEach(c => {
  if (c.slug  && c.image) configImageBySlug[c.slug.toLowerCase()]              = c.image;
  if (c.title && c.image) configImageByTitle[c.title.toLowerCase().trim()]     = c.image;
});

/**
 * Look up our curated config image for any course by slug or title
 * (also handles partial/keyword mismatches like "Odoo Functional ERP" → "Odoo Functional").
 */
export function getConfigImage(title: string, slugOrId: string): string | null {
  const s = slugOrId.toLowerCase();
  const t = title.toLowerCase().trim();
  if (configImageBySlug[s])  return configImageBySlug[s];
  if (configImageByTitle[t]) return configImageByTitle[t];
  for (const [ct, img] of Object.entries(configImageByTitle)) {
    if (t.includes(ct) || ct.includes(t)) return img;
  }
  return null;
}

/**
 * Resolve the best image for a course to show on public pages.
 * Call this everywhere instead of reading imageUrl directly.
 */
export function getEffectiveImage(course: {
  id?: string;
  slug?: string;
  title?: string;
  imageUrl?: string;
  adminImageUrl?: string;
}): string {
  // 1. Admin-uploaded image always wins
  if (course.adminImageUrl) return course.adminImageUrl;
  // 2. Curated config image (consistent branding)
  const configImg = getConfigImage(course.title || "", course.slug || course.id || "");
  if (configImg) return configImg;
  // 3. Whatever the API/store has
  return course.imageUrl || "";
}

// ── helpers ────────────────────────────────────────────────

function defaultCourses(): StoredCourse[] {
  return coursesConfig.map(c => ({
    id:               c.slug ?? String(c.key),
    title:            c.title ?? "",
    duration:         c.duration || "—",
    category:         c.category ?? "",
    categoryId:       c.category ?? "",
    status:           (c.status?.toLowerCase() === "active" ? "active" : "draft") as "active" | "draft",
    imageUrl:         c.image || "",
    adminImageUrl:    undefined,
    rating:           c.rating ?? 0,
    shortDescription: "",
    learningOutcomes: [],
    priceOriginal:    0,
    priceDiscounted:  0,
    startDate:        "",
    createdAt:        new Date().toISOString(),
  }));
}

/**
 * Patch stale imageUrls: only replace the old default placeholder.
 * Never overwrite adminImageUrl or real external URLs the admin set.
 */
function patchImages(courses: StoredCourse[]): StoredCourse[] {
  return courses.map(c => {
    if (c.adminImageUrl) return c; // admin image — never touch
    const isPlaceholder = !c.imageUrl || c.imageUrl === "/images/courses/default.jpg";
    if (isPlaceholder) {
      const fresh = configImageBySlug[c.id] || getConfigImage(c.title, c.id);
      if (fresh) return { ...c, imageUrl: fresh };
    }
    return c;
  });
}

// ── public API ─────────────────────────────────────────────

/** Read all courses saved by admin, or fall back to static config */
export function getStoredCourses(): StoredCourse[] {
  if (typeof window === "undefined") return defaultCourses();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const patched = patchImages(parsed);
        if (patched.some((c, i) => c.imageUrl !== parsed[i].imageUrl)) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(patched));
        }
        return patched;
      }
    }
  } catch {}
  return defaultCourses();
}

/** Save the full courses array to localStorage */
export function saveCourses(data: StoredCourse[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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

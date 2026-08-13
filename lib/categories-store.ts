/**
 * Client-side categories store using localStorage.
 * Admin manages course categories here (add / edit / delete).
 *
 * Categories are seeded from the built-in course categories so the list is
 * never empty on a fresh device. The store mirrors the pattern used by
 * courses-store / scholarship-store.
 */

const STORAGE_KEY = "sb_categories_v1";
const INIT_KEY    = "sb_categories_init_v1";

export interface StoredCategory {
  id: string;
  name: string;
  color: string;       // tailwind badge key, e.g. "blue" | "purple" ...
  description: string;
  createdAt: string;
}

export const CATEGORY_COLORS = [
  "blue", "purple", "amber", "cyan", "emerald", "pink", "teal", "red", "indigo", "orange",
] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const categoryColorClass: Record<string, string> = {
  blue:     "bg-[#1E90FF]/10 text-[#1E90FF]",
  purple:   "bg-purple-100 text-purple-600",
  amber:    "bg-amber-100 text-amber-600",
  cyan:     "bg-cyan-100 text-cyan-600",
  emerald:  "bg-emerald-100 text-emerald-600",
  pink:     "bg-pink-100 text-pink-600",
  teal:     "bg-teal-100 text-teal-600",
  red:      "bg-red-100 text-red-500",
  indigo:   "bg-indigo-100 text-indigo-600",
  orange:   "bg-orange-100 text-orange-600",
};

const SEED_CATEGORIES: Omit<StoredCategory, "createdAt">[] = [
  { id: "Development", name: "Development", color: "amber", description: "" },
  { id: "AI",          name: "AI",          color: "purple", description: "" },
  { id: "ERP",         name: "ERP",         color: "blue", description: "" },
  { id: "IT",          name: "IT",          color: "cyan", description: "" },
  { id: "Business",    name: "Business",    color: "emerald", description: "" },
  { id: "Language",    name: "Language",    color: "pink", description: "" },
  { id: "Automation",  name: "Automation",  color: "teal", description: "" },
];

// ── public API ─────────────────────────────────────────────

/** Read all categories saved by admin. Seeds on first use so the list is never empty. */
export function getStoredCategories(): StoredCategory[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as StoredCategory[];
    }
  } catch {}
  const seeded = seed();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded)); } catch {}
  return seeded;
}

/** True once the categories list has been persisted (even an empty one). */
export function isCategoriesInitialized(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(INIT_KEY) === "1";
  } catch {
    return false;
  }
}

/** Save the full categories array to localStorage */
export function saveCategories(data: StoredCategory[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(INIT_KEY, "1");
}

/** Add a new category and persist. Returns the created category. */
export function addCategory(input: { name: string; color?: string; description?: string }): StoredCategory {
  const all = getStoredCategories();
  const name = input.name.trim();
  const existing = all.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  const usedColors = new Set(all.map(c => c.color));
  const color = input.color && !usedColors.has(input.color)
    ? input.color
    : (CATEGORY_COLORS.find(c => !usedColors.has(c)) ?? CATEGORY_COLORS[all.length % CATEGORY_COLORS.length]);

  const created: StoredCategory = {
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    name,
    color,
    description: input.description?.trim() ?? "",
    createdAt: new Date().toISOString(),
  };
  saveCategories([...all, created]);
  return created;
}

/** Update an existing category by id and persist. */
export function updateCategory(id: string, patch: Partial<Pick<StoredCategory, "name" | "color" | "description">>): boolean {
  const all = getStoredCategories();
  const idx = all.findIndex(c => c.id === id);
  if (idx === -1) return false;
  const name = patch.name?.trim();
  all[idx] = {
    ...all[idx],
    ...patch,
    ...(name ? { name, id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") } : {}),
  };
  saveCategories(all);
  return true;
}

/** Delete a category by id and persist. Returns false if it didn't exist. */
export function deleteCategory(id: string): boolean {
  const all = getStoredCategories();
  const next = all.filter(c => c.id !== id);
  if (next.length === all.length) return false;
  saveCategories(next);
  return true;
}

/** Get a category's name from its id (for dropdowns). */
export function getCategoryName(id: string): string {
  const cat = getStoredCategories().find(c => c.id === id);
  return cat?.name || id;
}

/** All category names, sorted alphabetically — for the course form dropdown. */
export function getAllCategoryNames(): string[] {
  return getStoredCategories().map(c => c.name).sort();
}

/** Name → color class map for rendering badges, built from stored categories. */
export function getCategoryColorClass(nameOrId: string): string {
  const all = getStoredCategories();
  const cat = all.find(c => c.name === nameOrId) || all.find(c => c.id === nameOrId);
  return categoryColorClass[cat?.color ?? ""] ?? "bg-gray-100 text-gray-500";
}

function seed(): StoredCategory[] {
  const now = new Date().toISOString();
  return SEED_CATEGORIES.map(c => ({ ...c, description: "", createdAt: now }));
}

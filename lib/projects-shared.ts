/**
 * Shared cloud store for projects (jsonblob.com — free, no account, CORS-enabled).
 *
 * The admin writes the full projects list here so public pages on ANY device
 * can read it. This makes admin adds/edits/deletes visible everywhere instead
 * of only in the admin's own browser localStorage.
 *
 * Flow:
 *   - Admin mutates a project -> pushSharedProjects(getStoredProjects())
 *   - Public page loads       -> syncSharedProjectsToLocal() then reads localStorage
 *
 * localStorage stays the fast local cache; the shared blob is the portable source.
 */

import { getStoredProjects, saveProjects, type StoredProject } from "./project-store";

// Public jsonblob ID for the SkillBridge projects store. Recreate a blob at
// https://jsonblob.com and paste its UUID here if this one ever needs replacing.
export const SHARED_PROJECTS_URL =
  "https://jsonblob.com/api/jsonBlob/019fedb0-a645-7a9e-ac07-da4ae7741aad";

const FETCH_TIMEOUT_MS = 8000;

interface SharedPayload {
  projects: StoredProject[];
}

async function httpJson(method: "GET" | "PUT", body?: SharedPayload): Promise<SharedPayload> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(SHARED_PROJECTS_URL, {
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
 * Write the full projects list to the shared cloud store.
 * Returns true on success, false if the store is unreachable.
 */
export async function pushSharedProjects(projects: StoredProject[]): Promise<boolean> {
  try {
    await httpJson("PUT", { projects });
    return true;
  } catch {
    return false;
  }
}

/**
 * Pull the latest admin-published projects from the shared store into localStorage
 * so existing components that read getStoredProjects() automatically see admin
 * changes from other devices. Never throws — a failed fetch keeps local data.
 */
export async function syncSharedProjectsToLocal(): Promise<void> {
  try {
    const data = await httpJson("GET");
    if (Array.isArray(data.projects)) saveProjects(data.projects);
  } catch {
    // store unreachable — keep local data as-is
  }
}

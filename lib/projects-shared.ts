/**
 * Shared cloud store for projects (Supabase-backed).
 * Admin writes → public pages read via the `projects` table.
 * localStorage stays the fast local cache; Supabase is the portable source.
 */

import { getStoredProjects, saveProjects, type StoredProject } from "./project-store";
import { getProjectsSupabase, pushProjectsSupabase } from "./projects-supabase";

/**
 * Write the full projects list to Supabase.
 * Returns true on success, false if Supabase is unreachable/not configured.
 */
export async function pushSharedProjects(projects: StoredProject[]): Promise<boolean> {
  return pushProjectsSupabase(projects);
}

/**
 * Pull the latest admin-published projects from Supabase into localStorage.
 * Never throws — a failed fetch keeps local data.
 */
export async function syncSharedProjectsToLocal(): Promise<void> {
  try {
    const projects = await getProjectsSupabase();
    if (projects === null) return; // fetch failed / not configured — keep local data
    saveProjects(projects); // honor empty lists so deleted projects stay deleted
  } catch {
    // store unreachable — keep local data as-is
  }
}

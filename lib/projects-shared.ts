/**
 * Shared cloud store for projects (Supabase-backed).
 * Admin writes → public pages read via the `projects` table.
 * localStorage stays the fast local cache; Supabase is the portable source.
 */

import { getStoredProjects, saveProjects, type StoredProject } from "./project-store";
import { getProjectsSupabase, pushProjectsSupabase } from "./projects-supabase";

/**
 * Remove duplicate projects by id before they are stored or re-published.
 */
export function dedupeProjects(projects: StoredProject[]): StoredProject[] {
  const byId = new Map<string, StoredProject>();
  for (const project of projects) {
    if (!byId.has(project.id)) byId.set(project.id, project);
  }
  return [...byId.values()];
}

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

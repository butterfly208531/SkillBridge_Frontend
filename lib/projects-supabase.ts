/**
 * Supabase-backed projects store — replaces the jsonblob shared store.
 * Admin writes → public pages read, through the `projects` table.
 */

import { supabase } from "./supabase";
import type { StoredProject } from "./project-store";
import type { ProjectCategory, ProjectSubCategory } from "./projects-config";

function mapRow(row: any): StoredProject {
  return {
    id: row.id,
    priority: Number(row.priority ?? 0),
    title: row.title,
    description: row.description ?? "",
    technologies: row.technologies ?? [],
    category: (row.category ?? "development") as ProjectCategory,
    subCategory: (row.sub_category ?? "web") as ProjectSubCategory,
    studentName: row.student_name ?? "",
    demoUrl: row.demo_url ?? "",
    githubUrl: row.github_url ?? "",
    status: (row.status ?? "active") as "active" | "archived",
  };
}

function mapProject(p: StoredProject): any {
  return {
    id: p.id,
    priority: p.priority,
    title: p.title,
    description: p.description,
    technologies: p.technologies,
    category: p.category,
    sub_category: p.subCategory,
    student_name: p.studentName,
    demo_url: p.demoUrl,
    github_url: p.githubUrl,
    status: p.status,
  };
}

export async function getProjectsSupabase(): Promise<StoredProject[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("priority", { ascending: true });
  if (error) {
    console.warn("Supabase projects read failed:", error.message);
    return null;
  }
  return (data ?? []).map(mapRow);
}

/**
 * Push the FULL projects list. The pushed list is authoritative: projects
 * deleted from the admin panel are also removed from Supabase, so an empty
 * list here truly clears the table.
 */
export async function pushProjectsSupabase(projects: StoredProject[]): Promise<boolean> {
  if (!supabase) return false;
  const { error: delErr } = await supabase.from("projects").delete().neq("id", "~~noop~~");
  if (delErr) {
    console.warn("Supabase projects clear failed:", delErr.message);
    return false;
  }
  if (projects.length === 0) return true;
  const { error } = await supabase.from("projects").upsert(projects.map(mapProject));
  if (error) {
    console.warn("Supabase projects write failed:", error.message);
    return false;
  }
  return true;
}

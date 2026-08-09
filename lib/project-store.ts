/**
 * Client-side project store using localStorage.
 * Admin writes → public pages read.
 * Falls back to projectsConfig if no admin data saved.
 */

import { projectsConfig, type ProjectConfig, type ProjectCategory, type ProjectSubCategory } from "./projects-config";

const STORAGE_KEY = "sb_projects_v1";

export interface StoredProject {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: ProjectCategory;
  subCategory: ProjectSubCategory;
  studentName: string;
  demoUrl: string;
  githubUrl: string;
  status: "active" | "archived";
}

function configToStored(p: ProjectConfig): StoredProject {
  return {
    id:          p.id,
    title:       p.title,
    description: p.description,
    image:       p.image,
    technologies: p.technologies,
    category:    p.category,
    subCategory: p.subCategory,
    studentName: p.studentName ?? "",
    demoUrl:     p.demoUrl    ?? "",
    githubUrl:   p.githubUrl  ?? "",
    status:      "active",
  };
}

/** Read all projects — returns admin-saved data or empty array */
export function getStoredProjects(): StoredProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [];
}

/** Save projects to localStorage */
export function saveProjects(data: StoredProject[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Seed localStorage from static config if not yet set */
export function seedProjectsIfEmpty(): void {
  if (getStoredProjects().length === 0) {
    saveProjects(projectsConfig.map(configToStored));
  }
}

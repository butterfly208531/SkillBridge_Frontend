"use client";

import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, FolderOpen, Users, Globe,
  Github, RefreshCw, Loader2, X,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";
import { projectsConfig, CATEGORY_MAP, type ProjectCategory, type ProjectSubCategory } from "@/lib/projects-config";
import {
  getStoredProjects, saveProjects, seedProjectsIfEmpty, type StoredProject,
} from "@/lib/project-store";
import { pushSharedProjects, syncSharedProjectsToLocal, dedupeProjects } from "@/lib/projects-shared";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const ALL_CATEGORIES: ProjectCategory[] = [
  "ERP", "Web Development", "AI", "Automation", "Python", "Mobile",
];

const categoryColors: Record<ProjectCategory, string> = {
  ERP:               "bg-purple-100 text-purple-700",
  "Web Development": "bg-blue-100 text-blue-700",
  AI:                "bg-green-100 text-green-700",
  Automation:        "bg-orange-100 text-orange-700",
  Python:            "bg-yellow-100 text-yellow-700",
  Mobile:            "bg-pink-100 text-pink-700",
};

const FALLBACK: StoredProject[] = projectsConfig.map(p => ({
  id:           p.id,
  priority:     p.priority ?? 0,
  title:        p.title,
  description:  p.description,
  technologies: p.technologies,
  category:     p.category,
  subCategory:  p.subCategory,
  studentName:  p.studentName ?? "",
  demoUrl:      p.demoUrl    ?? "",
  githubUrl:    p.githubUrl  ?? "",
  status:       "active" as const,
}));

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCat, setFilterCat] = useState<ProjectCategory | "All">("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<StoredProject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };
    // Pull the latest published list from the shared store so this admin panel
    // shows changes made by admins on other devices.
    await syncSharedProjectsToLocal();
    const local = getStoredProjects();

    try {
      const res = await fetch(`${API}/projects`, { headers });
      if (res.ok) {
        const d = await res.json();
        const data: any[] = Array.isArray(d) ? d : d.data ?? [];
        if (data.length > 0) {
          // The API must never re-scramble admin ordering: keep the priority
          // already published in the shared/local store; new API-only projects
          // go to the END instead of jumping to the front.
          const localMap = Object.fromEntries(local.map(s => [s.id, s]));
          const localMax = local.length ? Math.max(0, ...local.map(s => s.priority ?? 0)) : 0;
          let offset = 1;
          const mapped: StoredProject[] = data.map((p: any) => {
            const stored = localMap[p.id] || localMap[p._id] || null;
            return {
              id:           p.id || p._id,
              priority:     stored?.priority ?? localMax + (offset++),
              title:        p.title || p.name || "",
              description:  p.description || "",
              technologies: Array.isArray(p.technologies) ? p.technologies : [],
              category:     p.category || "Web Development",
              subCategory:  p.subCategory || p.sub_category || "",
              studentName:  p.studentName || p.student || "",
              demoUrl:      p.demoUrl || p.demo || "",
              githubUrl:    p.githubUrl || p.github || "",
              status:       (p.status || "active").toLowerCase(),
            };
          });
          // Union with local so a partial API response can't drop projects.
          const apiIds = new Set(mapped.map(p => p.id));
          for (const s of local) if (!apiIds.has(s.id)) mapped.push(s);
          const finalMapped = dedupeProjects(mapped);
          setProjects(finalMapped);
          saveProjects(finalMapped);
          pushSharedProjects(finalMapped);
          setLoading(false);
          return;
        }
      }
    } catch {}

    setProjects(local.length > 0 ? local : FALLBACK);
    setLoading(false);
  };

  useEffect(() => {
    seedProjectsIfEmpty();
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    saveProjects(updated);
    pushSharedProjects(updated);
    setDeleteId(null);
  };

  const handleSave = async (data: StoredProject) => {
    setSaving(true);
    setError("");
    const token = sessionStorage.getItem("adminToken");
    const isEdit = !!editing;
    const newEntry: StoredProject = isEdit
      ? data
      : { ...data, id: `proj-${Date.now()}` };

    const updated = isEdit
      ? projects.map(p => p.id === data.id ? newEntry : p)
      : [...projects, newEntry];

    setProjects(updated);
    saveProjects(updated);
    pushSharedProjects(updated);

    try {
      await fetch(isEdit ? `${API}/projects/${data.id}` : `${API}/projects`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
    } catch {}

    setSaving(false);
    setShowModal(false);
    setEditing(null);
  };

  const displayed = (filterCat === "All"
    ? projects
    : projects.filter(p => p.category === filterCat))
    .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

  const activeCount   = projects.filter(p => p.status === "active").length;
  const withDemo      = projects.filter(p => p.demoUrl).length;
  const withGithub    = projects.filter(p => p.githubUrl).length;

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Student Projects" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: projects.length,  icon: FolderOpen, color: "text-[#1E90FF]",   bg: "bg-[#1E90FF]/10" },
            { label: "Active",         value: activeCount,      icon: Users,      color: "text-emerald-500", bg: "bg-emerald-50"   },
            { label: "With Demo",      value: withDemo,         icon: Globe,      color: "text-[#F57C00]",   bg: "bg-[#F57C00]/10" },
            { label: "With GitHub",    value: withGithub,       icon: Github,     color: "text-purple-500",  bg: "bg-purple-50"    },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter + actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...ALL_CATEGORIES] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCat(cat as any)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold border transition-all",
                  filterCat === cat
                    ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#1E90FF]"
                )}
              >{cat}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" title="Refresh">
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
            <button
              onClick={() => {
                const locale = window.location.pathname.split("/")[1] || "en";
                window.location.href = `/${locale}/admin/projects/add`;
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Project
            </button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm h-56 animate-pulse" />
            ))}
          </div>
        )}

        {/* Project cards grid */}
        {!loading && (
          <>
            {displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FolderOpen size={40} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">No projects found</p>
                <p className="text-xs mt-1">Add a project or change the category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayed.map(project => (
                  <div key={project.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                    {/* Body */}
                    <div className="flex-1 p-4 flex flex-col gap-2">
                      {/* Badges row */}
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                          categoryColors[project.category] ?? "bg-gray-100 text-gray-600"
                        )}>
                          {project.category}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                            #{project.priority ?? 0}
                          </span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            project.status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          )}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-gray-800 leading-snug line-clamp-2">{project.title}</h3>
                      {project.studentName && (
                        <p className="text-xs text-[#1E90FF] font-medium">by {project.studentName}</p>
                      )}
                      <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>

                      {/* Tech tags */}
                      {project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.technologies.slice(0, 4).map(t => (
                            <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md">{t}</span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] rounded-md">+{project.technologies.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Links */}
                      <div className="flex gap-2 mt-auto pt-2">
                        {project.demoUrl && (
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] text-[#1E90FF] hover:underline">
                            <Globe size={11} /> Demo
                          </a>
                        )}
                        {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[11px] text-gray-500 hover:underline">
                            <Github size={11} /> GitHub
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Edit / Delete */}
                    <div className="flex border-t border-gray-100">
                      <button
                        onClick={() => { setEditing(project); setShowModal(true); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-[#1E90FF] transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <div className="w-px bg-gray-100" />
                      <button
                        onClick={() => setDeleteId(project.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit / Add modal */}
      {showModal && (
        <ProjectModal
          project={editing}
          saving={saving}
          error={error}
          onClose={() => { setShowModal(false); setEditing(null); setError(""); }}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Project?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Inline Edit / Add Modal ────────────────────────────────────────────────

function ProjectModal({ project, saving, error, onClose, onSave }: {
  project: StoredProject | null;
  saving: boolean;
  error: string;
  onClose: () => void;
  onSave: (d: StoredProject) => void;
}) {
  const [form, setForm] = useState<StoredProject>({
    id:           project?.id           ?? "",
    // New projects default to the END of the published order (max+1) instead of
    // priority 0 which would land them at the top.
    priority:     project?.priority ?? (() => {
      const all = getStoredProjects();
      return all.length ? Math.max(0, ...all.map(p => p.priority ?? 0)) + 1 : 0;
    })(),
    title:        project?.title        ?? "",
    description:  project?.description  ?? "",
    technologies: project?.technologies ?? [],
    category:     project?.category     ?? "Web Development",
    subCategory:  project?.subCategory  ?? "Portfolio Websites",
    studentName:  project?.studentName  ?? "",
    demoUrl:      project?.demoUrl      ?? "",
    githubUrl:    project?.githubUrl    ?? "",
    status:       project?.status       ?? "active",
  });

  const [techInput, setTechInput] = useState("");

  const set = <K extends keyof StoredProject>(field: K, value: StoredProject[K]) =>
    setForm(p => ({ ...p, [field]: value }));

  const subCategories: ProjectSubCategory[] =
    CATEGORY_MAP[form.category] ?? [];

  // Reset subCategory when category changes
  const handleCategoryChange = (cat: ProjectCategory) => {
    const subs = CATEGORY_MAP[cat] ?? [];
    setForm(p => ({ ...p, category: cat, subCategory: subs[0] ?? p.subCategory }));
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) {
      set("technologies", [...form.technologies, t]);
    }
    setTechInput("");
  };

  const removeTech = (t: string) =>
    set("technologies", form.technologies.filter(x => x !== t));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">{project ? "Edit Project" : "Add Project"}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Project Title *</label>
            <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Full-Stack E-Commerce App"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Student Name</label>
            <input type="text" value={form.studentName} onChange={e => set("studentName", e.target.value)}
              placeholder="e.g. Dagim Mengestu"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
            <textarea rows={3} value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Brief description of the project..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none" />
          </div>

          {/* Category + SubCategory */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select value={form.category} onChange={e => handleCategoryChange(e.target.value as ProjectCategory)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sub-Category</label>
              <select value={form.subCategory} onChange={e => set("subCategory", e.target.value as ProjectSubCategory)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                {subCategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Technologies</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="e.g. React — press Enter to add"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              <button type="button" onClick={addTech}
                className="px-3 py-2 text-sm bg-[#1E90FF]/10 text-[#1E90FF] font-semibold rounded-lg hover:bg-[#1E90FF]/20 transition-colors">
                Add
              </button>
            </div>
            {form.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.technologies.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {t}
                    <button onClick={() => removeTech(t)} className="hover:text-red-400 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Demo URL + GitHub URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Demo URL</label>
              <input type="url" value={form.demoUrl} onChange={e => set("demoUrl", e.target.value)}
                placeholder="https://your-demo.vercel.app"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">GitHub URL</label>
              <input type="url" value={form.githubUrl} onChange={e => set("githubUrl", e.target.value)}
                placeholder="https://github.com/user/repo"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value as StoredProject["status"])}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
            <input type="number" min={0} value={form.priority}
              onChange={e => set("priority", Math.max(0, Math.floor(Number(e.target.value) || 0)))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
            <p className="mt-1 text-[10px] text-gray-400">Lower number = shown first on the public page. 0 is the highest priority.</p>
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 disabled:opacity-60">
            {saving && <Loader2 size={13} className="animate-spin" />}
            {project ? "Save Changes" : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

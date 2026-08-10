"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, CheckCircle, Loader2,
  FileText, Code2, Link2, Eye, X,
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { cn } from "@/lib/utils";
import {
  CATEGORY_MAP,
  type ProjectCategory,
  type ProjectSubCategory,
} from "@/lib/projects-config";
import { getStoredProjects, saveProjects, type StoredProject } from "@/lib/project-store";
import { pushSharedProjects } from "@/lib/projects-shared";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const ALL_CATEGORIES: ProjectCategory[] = [
  "ERP", "Web Development", "AI", "Automation", "Python", "Mobile",
];

const categoryColors: Record<ProjectCategory, string> = {
  ERP:               "border-purple-300 bg-purple-50 text-purple-700",
  "Web Development": "border-blue-300 bg-blue-50 text-blue-700",
  AI:                "border-green-300 bg-green-50 text-green-700",
  Automation:        "border-orange-300 bg-orange-50 text-orange-700",
  Python:            "border-yellow-300 bg-yellow-50 text-yellow-700",
  Mobile:            "border-pink-300 bg-pink-50 text-pink-700",
};

const TABS = ["Basic Info", "Category", "Links", "Review"] as const;
type Tab = (typeof TABS)[number];

const TAB_ICONS = {
  "Basic Info": FileText,
  "Category":   Code2,
  "Links":      Link2,
  "Review":     Eye,
};

export default function AddProjectPage() {
  const pathname = usePathname();
  const locale   = pathname.split("/")[1] || "en";

  const [tab,     setTab]     = useState<Tab>("Basic Info");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [techInput, setTechInput] = useState("");

  const [form, setForm] = useState({
    title:        "",
    description:  "",
    studentName:  "",
    technologies: [] as string[],
    category:     "Web Development" as ProjectCategory,
    subCategory:  "Portfolio Websites" as ProjectSubCategory,
    demoUrl:      "",
    githubUrl:    "",
    status:       "active" as "active" | "archived",
  });

  const set = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) =>
    setForm(p => ({ ...p, [field]: value }));

  const tabIndex   = TABS.indexOf(tab);
  const isComplete = (t: Tab) => TABS.indexOf(t) < tabIndex;

  const subCategories: ProjectSubCategory[] = CATEGORY_MAP[form.category] ?? [];

  const handleCategoryChange = (cat: ProjectCategory) => {
    const subs = CATEGORY_MAP[cat] ?? [];
    setForm(p => ({ ...p, category: cat, subCategory: subs[0] ?? p.subCategory }));
  };

  const addTech = () => {
    const t = techInput.trim();
    if (t && !form.technologies.includes(t)) set("technologies", [...form.technologies, t]);
    setTechInput("");
  };

  const removeTech = (t: string) =>
    set("technologies", form.technologies.filter(x => x !== t));

  // ── Validation per tab ─────────────────────────────────────────────────────
  const canAdvanceBasic =
    form.title.trim().length > 0 && form.description.trim().length > 0;

  const canAdvanceCategory = form.category.length > 0;

  const handleNext = () => {
    if (tab === "Basic Info"  && !canAdvanceBasic)    return setError("Title and description are required.");
    if (tab === "Category"    && !canAdvanceCategory) return setError("Please select a category.");
    setError("");
    const idx = TABS.indexOf(tab);
    if (idx < TABS.length - 1) setTab(TABS[idx + 1]);
  };

  const handleBack = () => {
    setError("");
    const idx = TABS.indexOf(tab);
    if (idx > 0) setTab(TABS[idx - 1]);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setSaving(true);
    setError("");
    const token = sessionStorage.getItem("adminToken");

    const newProject: StoredProject = {
      id:           `proj-${Date.now()}`,
      title:        form.title,
      description:  form.description,
      technologies: form.technologies,
      category:     form.category,
      subCategory:  form.subCategory,
      studentName:  form.studentName,
      demoUrl:      form.demoUrl,
      githubUrl:    form.githubUrl,
      status:       form.status,
    };

    // Persist to localStorage immediately so the public page and admin list update
    const existing = getStoredProjects();
    saveProjects([...existing, newProject]);
    pushSharedProjects(getStoredProjects());

    try {
      const res = await fetch(`${API}/projects`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(newProject),
      });
      if (res.ok) {
        const saved = await res.json().catch(() => null);
        const serverRecord = saved?.data ?? saved;
        if (serverRecord?.id || serverRecord?._id) {
          const withServerId: StoredProject = {
            ...newProject,
            id: serverRecord.id || serverRecord._id,
          };
          const refreshed = getStoredProjects();
          saveProjects(refreshed.map(p => p.id === newProject.id ? withServerId : p));
        }
      }
    } catch {
      // API unavailable — localStorage write above is enough
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => { window.location.href = `/${locale}/admin/projects`; }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Add New Project" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-800">Project Added!</h2>
            <p className="text-sm text-gray-500 mt-1">Redirecting to projects list…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Add New Project" />
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Back + heading */}
        <div className="mb-6">
          <button
            onClick={() => window.location.href = `/${locale}/admin/projects`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Projects
          </button>
          <h1 className="text-xl font-bold text-gray-800">Add New Project</h1>
          <p className="text-xs text-[#1E90FF] mt-0.5">Showcase a student project on the platform</p>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map((t) => {
            const Icon = TAB_ICONS[t];
            return (
              <button
                key={t}
                onClick={() => { setError(""); setTab(t); }}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap",
                  tab === t
                    ? "border-[#1E90FF] text-[#1E90FF]"
                    : isComplete(t)
                    ? "border-transparent text-emerald-500"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                {isComplete(t)
                  ? <CheckCircle size={14} className="text-emerald-500" />
                  : <Icon size={14} />
                }
                {t}
              </button>
            );
          })}
        </div>

        {/* ── TAB: BASIC INFO ── */}
        {tab === "Basic Info" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Basic Information</h2>
              <p className="text-xs text-gray-400">Enter the project title, student name, and description</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Project Title *</label>
              <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="e.g. Full-Stack E-Commerce App"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Student Name</label>
                <input type="text" value={form.studentName} onChange={e => set("studentName", e.target.value)}
                  placeholder="e.g. Dagim Mengestu"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select value={form.status} onChange={e => set("status", e.target.value as typeof form.status)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
              <textarea rows={4} value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Describe what the project does, the problem it solves, and how it was built…"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none" />
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex justify-end">
              <button onClick={handleNext} disabled={!canAdvanceBasic}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 disabled:opacity-40 transition-colors">
                Next: Category →
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: CATEGORY ── */}
        {tab === "Category" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Category & Technologies</h2>
              <p className="text-xs text-gray-400">Choose the project category and list the technologies used</p>
            </div>

            {/* Category grid */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALL_CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => handleCategoryChange(cat)}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all",
                      form.category === cat
                        ? categoryColors[cat]
                        : "border-gray-200 hover:border-gray-300"
                    )}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className={cn("w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center",
                        form.category === cat ? "border-current" : "border-gray-300"
                      )}>
                        {form.category === cat && <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <span className="text-xs font-bold">{cat}</span>
                    </div>
                    <p className="text-[10px] opacity-60 ml-5">
                      {(CATEGORY_MAP[cat] ?? []).length} sub-categories
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-category */}
            {subCategories.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Sub-Category</label>
                <div className="flex flex-wrap gap-2">
                  {subCategories.map(sub => (
                    <button key={sub} type="button" onClick={() => set("subCategory", sub)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                        form.subCategory === sub
                          ? "bg-[#F57C00] text-white border-[#F57C00]"
                          : "bg-white text-gray-500 border-gray-200 hover:border-[#F57C00]"
                      )}>
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Technologies Used</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTech())}
                  placeholder="e.g. React — press Enter to add"
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                <button type="button" onClick={addTech}
                  className="px-4 py-2.5 text-sm bg-[#1E90FF]/10 text-[#1E90FF] font-semibold rounded-lg hover:bg-[#1E90FF]/20 transition-colors">
                  Add
                </button>
              </div>
              {form.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-3 bg-gray-50 rounded-xl">
                  {form.technologies.map(t => (
                    <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full shadow-sm">
                      {t}
                      <button onClick={() => removeTech(t)} className="hover:text-red-400 transition-colors">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex justify-between">
              <button onClick={handleBack}
                className="px-5 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleNext}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 transition-colors">
                Next: Links →
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: LINKS ── */}
        {tab === "Links" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Project Links</h2>
              <p className="text-xs text-gray-400">Add a live demo URL and/or a GitHub repository link</p>
            </div>

            {/* Demo URL */}
            <div className="bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-semibold text-[#1E90FF]">
                🌐 Live Demo URL
              </label>
              <p className="text-[11px] text-gray-400">Link to the deployed app or a video walkthrough</p>
              <input type="url" value={form.demoUrl} onChange={e => set("demoUrl", e.target.value)}
                placeholder="https://my-project.vercel.app"
                className="w-full px-3 py-2.5 text-sm border border-[#1E90FF]/30 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              {form.demoUrl && (
                <a href={form.demoUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#1E90FF] hover:underline mt-1">
                  <Link2 size={11} /> Preview link
                </a>
              )}
            </div>

            {/* GitHub URL */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                🐙 GitHub Repository URL
              </label>
              <p className="text-[11px] text-gray-400">Public GitHub repo for the project source code</p>
              <input type="url" value={form.githubUrl} onChange={e => set("githubUrl", e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              {form.githubUrl && (
                <a href={form.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:underline mt-1">
                  <Link2 size={11} /> Preview link
                </a>
              )}
            </div>

            <p className="text-[11px] text-gray-400 italic">Both fields are optional — you can add them later.</p>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex justify-between">
              <button onClick={handleBack}
                className="px-5 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleNext}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 transition-colors">
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* ── TAB: REVIEW ── */}
        {tab === "Review" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-6">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Review & Publish</h2>
              <p className="text-xs text-gray-400">Double-check everything before adding the project</p>
            </div>

            {/* Summary grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Title",        value: form.title        || "—" },
                { label: "Student",      value: form.studentName  || "—" },
                { label: "Status",       value: form.status },
                { label: "Category",     value: form.category },
                { label: "Sub-Category", value: form.subCategory  || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}

              {/* Technologies */}
              <div className="bg-gray-50 rounded-xl p-3 md:col-span-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1.5">Technologies</p>
                {form.technologies.length === 0
                  ? <p className="text-sm text-gray-400 italic">None added</p>
                  : (
                    <div className="flex flex-wrap gap-1.5">
                      {form.technologies.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-xs rounded-full shadow-sm">{t}</span>
                      ))}
                    </div>
                  )}
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-3 md:col-span-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-0.5">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{form.description || "—"}</p>
              </div>
            </div>

            {/* Links */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Links</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 p-3 bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-xl">
                  <span className="text-[11px] font-semibold text-[#1E90FF] w-16 shrink-0">Demo</span>
                  {form.demoUrl
                    ? <a href={form.demoUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[#1E90FF] hover:underline truncate">{form.demoUrl}</a>
                    : <span className="text-xs text-gray-400 italic">Not provided</span>
                  }
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <span className="text-[11px] font-semibold text-gray-600 w-16 shrink-0">GitHub</span>
                  {form.githubUrl
                    ? <a href={form.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-gray-600 hover:underline truncate">{form.githubUrl}</a>
                    : <span className="text-xs text-gray-400 italic">Not provided</span>
                  }
                </div>
              </div>
            </div>

            {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex justify-between">
              <button onClick={handleBack}
                className="px-5 py-2 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                ← Back
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 disabled:opacity-60 transition-colors">
                {saving && <Loader2 size={13} className="animate-spin" />}
                {saving ? "Publishing…" : "Publish Project"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

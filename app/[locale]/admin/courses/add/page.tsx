"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Plus, Trash2, CheckCircle, Loader2 } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

const TABS = ["Basic Info", "Content", "Curriculum", "Instructor"] as const;
type Tab = typeof TABS[number];

interface Module {
  title: string;
  duration: string;
  lessons: { title: string; duration: string }[];
}

const FALLBACK_CATEGORIES = [
  { id: "cat-1", name: "ERP" },
  { id: "cat-2", name: "Development" },
  { id: "cat-3", name: "AI" },
  { id: "cat-4", name: "Data Science" },
  { id: "cat-5", name: "Automation" },
  { id: "cat-6", name: "Language" },
  { id: "cat-7", name: "Design" },
  { id: "cat-8", name: "Mobile" },
  { id: "cat-9", name: "Software & Programming" },
  { id: "cat-10", name: "Business" },
];

const FALLBACK_INSTRUCTORS = [
  { id: "inst-1", name: "Gedion", email: "gedion@sbit.com" },
  { id: "inst-2", name: "Admin", email: "admin@skillbridge.com" },
];
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const [tab, setTab] = useState<Tab>("Basic Info");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // API data
  const [categories, setCategories] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);

  // Form state
  const [basic, setBasic] = useState({
    title: "",
    categoryId: "",
    level: "",
    priceOriginal: "",
    priceDiscounted: "",
    duration: "",
    status: "DRAFT",
    mode: "Online",
    shortDescription: "",
    detailedDescription: "",
    imageUrl: "",
    startDate: "",
  });

  const [learningOutcomes, setLearningOutcomes] = useState<string[]>([""]);
  const [prerequisites, setPrerequisites] = useState<string[]>([""]);
  const [modules, setModules] = useState<Module[]>([
    { title: "", duration: "", lessons: [{ title: "", duration: "" }] },
  ]);
  const [instructorId, setInstructorId] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API}/categories`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const data = Array.isArray(d) ? d : d.data ?? [];
        setCategories(data.length > 0 ? data : FALLBACK_CATEGORIES);
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES));
    fetch(`${API}/instructors`, { headers })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const data = Array.isArray(d) ? d : d.data ?? [];
        setInstructors(data.length > 0 ? data : FALLBACK_INSTRUCTORS);
      })
      .catch(() => setInstructors(FALLBACK_INSTRUCTORS));
  }, []);

  // ── Helpers ──────────────────────────────────────────
  const updateOutcome = (i: number, val: string) => setLearningOutcomes(p => p.map((x, j) => j === i ? val : x));
  const removeOutcome = (i: number) => setLearningOutcomes(p => p.filter((_, j) => j !== i));

  const updatePrereq = (i: number, val: string) => setPrerequisites(p => p.map((x, j) => j === i ? val : x));
  const removePrereq = (i: number) => setPrerequisites(p => p.filter((_, j) => j !== i));

  const updateModule = (mi: number, field: keyof Omit<Module, "lessons">, val: string) =>
    setModules(p => p.map((m, i) => i === mi ? { ...m, [field]: val } : m));

  const addLesson = (mi: number) =>
    setModules(p => p.map((m, i) => i === mi ? { ...m, lessons: [...m.lessons, { title: "", duration: "" }] } : m));

  const updateLesson = (mi: number, li: number, field: "title" | "duration", val: string) =>
    setModules(p => p.map((m, i) => i === mi ? {
      ...m,
      lessons: m.lessons.map((l, j) => j === li ? { ...l, [field]: val } : l),
    } : m));

  const removeLesson = (mi: number, li: number) =>
    setModules(p => p.map((m, i) => i === mi ? { ...m, lessons: m.lessons.filter((_, j) => j !== li) } : m));

  const removeModule = (mi: number) => setModules(p => p.filter((_, i) => i !== mi));

  // ── Submit ────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    const token = sessionStorage.getItem("adminToken");

    const payload = {
      title: basic.title,
      categoryId: basic.categoryId,
      instructorId,
      level: basic.level,
      priceOriginal: Number(basic.priceOriginal),
      priceDiscounted: Number(basic.priceDiscounted),
      duration: basic.duration,
      status: basic.status,
      mode: basic.mode,
      shortDescription: basic.shortDescription,
      detailedDescription: basic.detailedDescription,
      imageUrl: basic.imageUrl,
      startDate: basic.startDate || undefined,
      learningOutcomes: learningOutcomes.filter(Boolean).map(text => ({ text })),
      prerequisites: prerequisites.filter(Boolean).map(text => ({ text })),
      modules: modules.filter(m => m.title).map((m, order) => ({
        title: m.title,
        duration: m.duration,
        order: order + 1,
        lessons: m.lessons.filter(l => l.title).map((l, lo) => ({
          title: l.title,
          duration: l.duration,
          order: lo + 1,
        })),
      })),
    };

    try {
      const res = await fetch(`${API}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || `Error ${res.status}`);
      }
      setSuccess(true);
      setTimeout(() => window.location.href = `/${locale}/admin/courses`, 1500);
    } catch (e: any) {
      setError(e.message || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  const tabIndex = TABS.indexOf(tab);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Add New Course" />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Back + title */}
        <div className="mb-6">
          <button
            onClick={() => window.location.href = `/${locale}/admin/courses`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Courses
          </button>
          <h1 className="text-xl font-bold text-gray-800">Add New Course</h1>
          <p className="text-xs text-[#1E90FF] mt-0.5">Create a new course for the platform</p>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 mb-6">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-5 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px",
                tab === t
                  ? "border-[#1E90FF] text-[#1E90FF]"
                  : i < tabIndex
                  ? "border-transparent text-emerald-500"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              {i < tabIndex && <span className="mr-1.5">✓</span>}
              {t}
            </button>
          ))}
        </div>

        {/* ── BASIC INFO ── */}
        {tab === "Basic Info" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 max-w-3xl">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Basic Information</h2>
              <p className="text-xs text-gray-400">Enter the basic details of the course</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Course Title *</label>
                <input value={basic.title} onChange={e => setBasic(p => ({ ...p, title: e.target.value }))}
                  placeholder="Enter course title"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                <select value={basic.categoryId} onChange={e => setBasic(p => ({ ...p, categoryId: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Level *</label>
                <select value={basic.level} onChange={e => setBasic(p => ({ ...p, level: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  <option value="">Select Level</option>
                  {["BEGINNER","INTERMEDIATE","ADVANCED","ALL_LEVELS"].map(l => <option key={l} value={l}>{l.replace("_"," ")}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Original Price ($)</label>
                <input type="number" value={basic.priceOriginal} onChange={e => setBasic(p => ({ ...p, priceOriginal: e.target.value }))}
                  placeholder="99.99"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Discounted Price ($)</label>
                <input type="number" value={basic.priceDiscounted} onChange={e => setBasic(p => ({ ...p, priceDiscounted: e.target.value }))}
                  placeholder="79.99"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                <input value={basic.duration} onChange={e => setBasic(p => ({ ...p, duration: e.target.value }))}
                  placeholder="e.g. 8 weeks"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select value={basic.status} onChange={e => setBasic(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mode</label>
                <select value={basic.mode} onChange={e => setBasic(p => ({ ...p, mode: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  <option value="Online">Online</option>
                  <option value="Physical">Physical</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input type="date" value={basic.startDate} onChange={e => setBasic(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Short Description</label>
                <textarea rows={3} value={basic.shortDescription} onChange={e => setBasic(p => ({ ...p, shortDescription: e.target.value }))}
                  placeholder="Brief description of the course"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Detailed Description</label>
                <textarea rows={4} value={basic.detailedDescription} onChange={e => setBasic(p => ({ ...p, detailedDescription: e.target.value }))}
                  placeholder="Detailed description of the course"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Course Image URL</label>
                <input value={basic.imageUrl} onChange={e => setBasic(p => ({ ...p, imageUrl: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setTab("Content")}
                className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                Next: Content →
              </button>
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        {tab === "Content" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Course Content</h2>
              <p className="text-xs text-gray-400">Add learning outcomes and prerequisites</p>
            </div>

            {/* Learning Outcomes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Learning Outcomes</label>
              <div className="space-y-2">
                {learningOutcomes.map((o, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={o} onChange={e => updateOutcome(i, e.target.value)}
                      placeholder={`Outcome ${i + 1}`}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                    {learningOutcomes.length > 1 && (
                      <button onClick={() => removeOutcome(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setLearningOutcomes(p => [...p, ""])}
                className="mt-2 flex items-center gap-1.5 text-xs text-[#1E90FF] hover:underline">
                <Plus size={13} /> Add Outcome
              </button>
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Prerequisites</label>
              <div className="space-y-2">
                {prerequisites.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={p} onChange={e => updatePrereq(i, e.target.value)}
                      placeholder={`Prerequisite ${i + 1}`}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                    {prerequisites.length > 1 && (
                      <button onClick={() => removePrereq(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setPrerequisites(p => [...p, ""])}
                className="mt-2 flex items-center gap-1.5 text-xs text-[#1E90FF] hover:underline">
                <Plus size={13} /> Add Prerequisite
              </button>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Basic Info")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={() => setTab("Curriculum")} className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                Next: Curriculum →
              </button>
            </div>
          </div>
        )}

        {/* ── CURRICULUM ── */}
        {tab === "Curriculum" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 max-w-3xl">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Curriculum</h2>
              <p className="text-xs text-gray-400">Build the course modules and lessons</p>
            </div>

            <div className="space-y-4">
              {modules.map((mod, mi) => (
                <div key={mi} className="border border-gray-200 rounded-xl overflow-hidden">
                  {/* Module header */}
                  <div className="bg-gray-50 px-4 py-3 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1E90FF] text-white text-xs flex items-center justify-center font-bold shrink-0">
                      {mi + 1}
                    </span>
                    <input value={mod.title} onChange={e => updateModule(mi, "title", e.target.value)}
                      placeholder="Module title"
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                    <input value={mod.duration} onChange={e => updateModule(mi, "duration", e.target.value)}
                      placeholder="Duration"
                      className="w-28 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                    {modules.length > 1 && (
                      <button onClick={() => removeModule(mi)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Lessons */}
                  <div className="p-4 space-y-2">
                    {mod.lessons.map((lesson, li) => (
                      <div key={li} className="flex items-center gap-2 pl-4">
                        <span className="text-xs text-gray-400 w-5 shrink-0">{li + 1}.</span>
                        <input value={lesson.title} onChange={e => updateLesson(mi, li, "title", e.target.value)}
                          placeholder="Lesson title"
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                        <input value={lesson.duration} onChange={e => updateLesson(mi, li, "duration", e.target.value)}
                          placeholder="Duration"
                          className="w-24 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                        {mod.lessons.length > 1 && (
                          <button onClick={() => removeLesson(mi, li)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button onClick={() => addLesson(mi)}
                      className="ml-9 mt-1 flex items-center gap-1.5 text-xs text-[#1E90FF] hover:underline">
                      <Plus size={12} /> Add Lesson
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setModules(p => [...p, { title: "", duration: "", lessons: [{ title: "", duration: "" }] }])}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#1E90FF] text-[#1E90FF] text-sm rounded-xl hover:bg-[#1E90FF]/5 transition-colors">
              <Plus size={15} /> Add Module
            </button>

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Content")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                ← Back
              </button>
              <button onClick={() => setTab("Instructor")} className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                Next: Instructor →
              </button>
            </div>
          </div>
        )}

        {/* ── INSTRUCTOR ── */}
        {tab === "Instructor" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 max-w-3xl">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Assign Instructor</h2>
              <p className="text-xs text-gray-400">Select the instructor for this course</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instructor *</label>
              <select value={instructorId} onChange={e => setInstructorId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                <option value="">Select Instructor</option>
                {instructors.map(i => (
                  <option key={i.id} value={i.id}>{i.name} — {i.email}</option>
                ))}
              </select>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-semibold text-gray-700 mb-2">Course Summary</p>
              {[
                { label: "Title",       value: basic.title },
                { label: "Category",    value: categories.find(c => c.id === basic.categoryId)?.name || basic.categoryId },
                { label: "Level",       value: basic.level },
                { label: "Duration",    value: basic.duration },
                { label: "Mode",        value: basic.mode },
                { label: "Status",      value: basic.status },
                { label: "Modules",     value: `${modules.filter(m => m.title).length}` },
                { label: "Outcomes",    value: `${learningOutcomes.filter(Boolean).length}` },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-800">{value}</span>
                </div>
              ) : null)}
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
            )}

            {success && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Course created successfully! Redirecting...
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Curriculum")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                ← Back
              </button>
              <div className="flex gap-3">
                <button onClick={() => window.location.href = `/${locale}/admin/courses`}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={saving || success}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-60">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? "Creating..." : "Create Course"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

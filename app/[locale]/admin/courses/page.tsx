"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus, Pencil, Trash2, Star, Clock, Upload, X, Loader2, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { uploadImage } from "@/lib/uploadImage";
import { getAllCategories } from "@/lib/courses-config";
import { adminApi } from "@/lib/api";
import {
  getStoredCourses,
  deleteCourse,
  toggleCourseStatus,
  updateCourse,
  addCourse,
  saveCourses,
  moveCourse,
  isCoursesInitialized,
  getEffectiveImage,
  type StoredCourse,
} from "@/lib/courses-store";
import { pushSharedCourses, syncSharedCoursesToLocal, dedupeCourses } from "@/lib/courses-shared";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const categoryColor: Record<string, string> = {
  Development:  "bg-[#F57C00]/10 text-[#F57C00]",
  AI:           "bg-purple-100 text-purple-600",
  ERP:          "bg-[#1E90FF]/10 text-[#1E90FF]",
  IT:           "bg-cyan-100 text-cyan-600",
  Business:     "bg-emerald-100 text-emerald-600",
  Language:     "bg-pink-100 text-pink-600",
  Automation:   "bg-teal-100 text-teal-600",
};

// ─── Page ──────────────────────────────────────────────────────────────────
export default function CoursesAdminPage() {
  const [courses, setCourses]   = useState<StoredCourse[]>(() => {
    // Pre-populate from localStorage so the table isn't empty before the API responds
    return isCoursesInitialized() ? getStoredCourses() : [];
  });
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<StoredCourse | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  // ── load from store + API ──
  // opts.sync === false means "this call follows a local mutation" — do NOT
  // pull the shared store first, or it would overwrite the edit we just saved.
  // opts.sync !== false pulls the latest list from the shared store (initial
  // load / manual refresh).
  const loadCourses = async (opts?: { sync?: boolean }) => {
    if (opts?.sync !== false) {
      // Pull the latest published list from the shared store so this admin panel
      // shows changes made by admins on other devices.
      await syncSharedCoursesToLocal();
    }

    // Always show localStorage data immediately for instant paint
    const local = getStoredCourses();
    setCourses(local);
    const cats = ["All", ...Array.from(new Set(local.map(c => c.category)))];
    setCategories(cats);

    // Then try to refresh from the live API. The API is NOT authoritative over
    // the published shared store: an empty or partial API response must never
    // wipe the courses admins have already published.
    try {
      const token = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken") || "";
      const res = await fetch(`${API}/courses`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const d = await res.json();
        const list: any[] = Array.isArray(d) ? d : d.data ?? [];
        if (list.length > 0) {
          // Merge: keep adminImageUrl and admin-set prices from localStorage,
          // API wins for everything else. Local-only courses are kept (union)
          // so a partial backend list can't drop published courses.
          const norm = (s: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const localMap = Object.fromEntries(local.map(s => [s.id, s]));
          const localByTitle = new Map(local.map(s => [norm(s.title), s]));
          const localMax = local.length ? Math.max(0, ...local.map(s => s.priority ?? 0)) : 0;
          let offset = 1;
          const merged = dedupeCourses([
            ...list.map((c: any) => {
              const stored = localMap[c.id] || localMap[c.slug] || localByTitle.get(norm(c.title)) || null;
              // Resolve price: API may return camelCase, snake_case, or other variants.
              // If the API gives a non-zero value, use it; otherwise fall back to the
              // admin-set value already in localStorage so it is never silently zeroed out.
              const apiPriceOriginal =
                c.priceOriginal ?? c.price_original ?? c.originalPrice ?? c.price ?? null;
              const apiPriceDiscounted =
                c.priceDiscounted ?? c.price_discounted ?? c.discountedPrice ?? c.monthlyPrice ?? null;
              return {
                id:               c.id || c._id || "",
                title:            c.title || "",
                duration:         c.duration || "—",
                category:         c.category?.name || c.category || "",
                categoryId:       c.categoryId || c.category?.id || "",
                status:           (c.status?.toLowerCase() === "active" ? "active" : "draft") as "active" | "draft",
                imageUrl:         c.imageUrl || "",
                adminImageUrl:    stored?.adminImageUrl || undefined,
                rating:           c.rating ?? 0,
                shortDescription: c.shortDescription || "",
                learningOutcomes: stored?.learningOutcomes ?? [],
                // Prefer API value if non-zero; otherwise keep what admin set locally
                priceOriginal:    (apiPriceOriginal != null && apiPriceOriginal > 0)
                                    ? apiPriceOriginal
                                    : (stored?.priceOriginal ?? 0),
                priceDiscounted:  (apiPriceDiscounted != null && apiPriceDiscounted > 0)
                                    ? apiPriceDiscounted
                                    : (stored?.priceDiscounted ?? 0),
                startDate:        c.startDate || "",
                createdAt:        c.createdAt || new Date().toISOString(),
                // Preserve admin-set priority; new API-only courses go to the END
                // of the published order instead of jumping to the front.
                priority:         stored?.priority ?? localMax + (offset++),
              };
            }),
          ]);
          // Keep local courses the API didn't return (union by id or title).
          const apiIds = new Set(merged.map(c => c.id));
          const apiTitles = new Set(merged.map(c => norm(c.title)));
          for (const s of local) {
            if (!apiIds.has(s.id) && !apiTitles.has(norm(s.title))) merged.push(s);
          }
          const finalMerged = dedupeCourses(merged);
          saveCourses(finalMerged);
          setCourses(finalMerged);
          const freshCats = ["All", ...Array.from(new Set(finalMerged.map(c => c.category)))];
          setCategories(freshCats);
        }
        // else: API returned an empty list — keep the shared/local data as-is
        // so an empty backend can't wipe the published store.
      } else if (isCoursesInitialized()) {
        // API down/unauthenticated — keep admin-saved localStorage data
        setCourses(local);
      } else {
        setCourses([]);
      }
    } catch {
      // Network error — keep what's already in state/localStorage
      if (isCoursesInitialized()) setCourses(local);
    }

    // Publish the authoritative list to the shared cloud store (best-effort) so
    // other devices see admin changes too. Never publish an empty list here — an
    // empty or failed API response on this device must not wipe the shared store.
    const published = getStoredCourses();
    if (published.length > 0) {
      const pushed = await pushSharedCourses(published);
      if (!pushed) console.warn("[courses] Could not sync courses to the shared store");
    }
  };

  useEffect(() => { loadCourses(); }, []);

  const filtered = courses
    .filter(c => {
      const matchCat    = category === "All" || c.category === category;
      const matchSearch = !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  // ── delete ──
  const handleDelete = async (id: string) => {
    // Optimistic: remove from localStorage + UI immediately
    deleteCourse(id);
    loadCourses({ sync: false });
    setDeleteId(null);

    // Best-effort API delete (fire and forget — token may not exist on demo)
    try {
      const token = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken") || "";
      await fetch(`${API}/courses/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // API unavailable — localStorage already updated
    }
  };

  // ── toggle status ──
  const handleToggleStatus = (id: string) => {
    toggleCourseStatus(id);
    loadCourses({ sync: false });
  };

  // ── move priority ──
  const handleMove = (id: string, direction: "up" | "down") => {
    moveCourse(id, direction);
    loadCourses({ sync: false });
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Courses" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  category === cat
                    ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                )}
              >{cat}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => loadCourses()}
              title="Refresh"
              className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-[#1E90FF] hover:border-[#1E90FF] transition-colors"
            >
              <RefreshCw size={15} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-48"
              />
            </div>
            <button
              onClick={() => {
                const locale = window.location.pathname.split("/")[1] || "en";
                window.location.href = `/${locale}/admin/courses/add`;
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Course
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">Total: <strong className="text-gray-800">{filtered.length}</strong></span>
          <span className="text-emerald-600">Active: <strong>{filtered.filter(c => c.status === "active").length}</strong></span>
          <span className="text-gray-400">Draft: <strong>{filtered.filter(c => c.status === "draft").length}</strong></span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Course</th>
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Category</th>
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Duration</th>
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Rating</th>
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Priority</th>
                  <th scope="col" className="px-5 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {getEffectiveImage(course) ? (
                          <img src={getEffectiveImage(course)} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0 border border-gray-100" />
                        ) : (                          <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-300">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01" /></svg>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-800 truncate max-w-[160px]">{course.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[160px]">{course.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold", categoryColor[course.category] ?? "bg-gray-100 text-gray-500")}>
                        {course.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />{course.duration}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <Star size={12} className="fill-amber-400 text-amber-400" />{course.rating || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(course.id)}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors",
                          course.status === "active"
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                      >
                        {course.status === "active" ? "Active" : "Draft"}
                      </button>
                    </td>
                    {/* Priority reorder */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-mono text-gray-500 w-5 text-center">
                          {course.priority ?? 0}
                        </span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={() => handleMove(course.id, "up")}
                            className="p-0.5 rounded text-gray-400 hover:text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors"
                            title="Move up"
                          >
                            <ChevronUp size={13} />
                          </button>
                          <button
                            onClick={() => handleMove(course.id, "down")}
                            className="p-0.5 rounded text-gray-400 hover:text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors"
                            title="Move down"
                          >
                            <ChevronDown size={13} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditing(course); setShowModal(true); }}
                          className="p-1.5 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(course.id)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">No courses found</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <CourseModal
          course={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSaved={() => loadCourses({ sync: false })}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-500 mb-5">This will remove it from the public site too.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Edit / Add Modal ──────────────────────────────────────────────────────
function CourseModal({ course, onClose, onSaved }: {
  course: StoredCourse | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title:             course?.title             ?? "",
    duration:          course?.duration          ?? "",
    categoryId:        course?.categoryId        ?? "",
    status:            course?.status === "active" ? "PUBLISHED" : "DRAFT",
    // Show adminImageUrl if already set, otherwise show current imageUrl
    imageUrl:          course?.adminImageUrl || course?.imageUrl || "",
    priceOriginal:     course?.priceOriginal     ?? 0,
    priceDiscounted:   course?.priceDiscounted   ?? 0,
    rating:            course?.rating            ?? 0,
    shortDescription:  course?.shortDescription  ?? "",
    learningOutcomes:  course?.learningOutcomes  ?? [] as string[],
    // New courses default to the END of the published order (max+1) instead of
    // priority 0 which would land them at the top.
    priority:          course?.priority ?? (() => {
      const all = getStoredCourses();
      return all.length ? Math.max(0, ...all.map(c => c.priority ?? 0)) + 1 : 0;
    })(),
  });

  const [categories] = useState<{ id: string; name: string }[]>(
    () => (getAllCategories().filter((name): name is string => name !== undefined)).map(name => ({ id: name, name }))
  );
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadErr, setUploadErr] = useState("");
  const [outcomeInput, setOutcomeInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addOutcome = () => {
    const v = outcomeInput.trim();
    if (v && !form.learningOutcomes.includes(v)) {
      setForm(p => ({ ...p, learningOutcomes: [...p.learningOutcomes, v] }));
    }
    setOutcomeInput("");
  };
  const removeOutcome = (idx: number) =>
    setForm(p => ({ ...p, learningOutcomes: p.learningOutcomes.filter((_, i) => i !== idx) }));

  // Image upload via Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp","image/gif"].includes(file.type)) {
      setUploadErr("Please upload JPEG, PNG, WEBP, or GIF."); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadErr("Image must be under 5 MB."); return;
    }
    setUploading(true); setUploadErr(""); setUploadProgress(0);
    try {
      const { url } = await uploadImage(file, "courses", pct => setUploadProgress(pct));
      setForm(p => ({ ...p, imageUrl: url }));
    } catch (err: any) {
      setUploadErr(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false); setUploadProgress(-1);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Save to localStorage AND backend API
  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true); setError("");

    try {
      const selectedCat = categories.find(c => c.id === form.categoryId);
      const status: "active" | "draft" = form.status === "PUBLISHED" ? "active" : "draft";

      // ── 1. Persist to localStorage immediately (optimistic) ──
      if (course?.id) {
        updateCourse(course.id, {
          title:            form.title.trim(),
          duration:         form.duration || "—",
          category:         selectedCat?.name || form.categoryId || course.category,
          categoryId:       form.categoryId || course.categoryId,
          status,
          imageUrl:         form.imageUrl || course.imageUrl || "",
          adminImageUrl:    form.imageUrl || undefined,
          priceOriginal:    Number(form.priceOriginal)   || 0,
          priceDiscounted:  Number(form.priceDiscounted) || 0,
          rating:           Number(form.rating)          || 0,
          shortDescription: form.shortDescription.trim(),
          learningOutcomes: form.learningOutcomes,
          priority:         Number(form.priority)        || 0,
        });
      } else {
        addCourse({
          title:            form.title.trim(),
          duration:         form.duration || "—",
          category:         selectedCat?.name || form.categoryId || "",
          categoryId:       form.categoryId || "",
          status,
          imageUrl:         form.imageUrl || "",
          adminImageUrl:    form.imageUrl || undefined,
          rating:           Number(form.rating)          || 0,
          shortDescription: form.shortDescription.trim(),
          learningOutcomes: form.learningOutcomes,
          priceOriginal:    Number(form.priceOriginal)   || 0,
          priceDiscounted:  Number(form.priceDiscounted) || 0,
          startDate:        "",
          priority:         Number(form.priority)        || 0,
        });
      }

      // ── 2. Best-effort API sync ──
      try {
        const token = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken") || "";
        const payload = {
          title:           form.title.trim(),
          duration:        form.duration || "—",
          categoryId:      form.categoryId || undefined,
          status:          (form.status === "PUBLISHED" ? "Active" : "Draft") as "Active" | "Draft",
          imageUrl:        form.imageUrl || undefined,
          priceOriginal:   Number(form.priceOriginal)   || 0,
          priceDiscounted: Number(form.priceDiscounted) || 0,
          rating:          Number(form.rating)          || 0,
        };

        if (course?.id) {
          await adminApi.updateCourse(course.id, payload);
        } else {
          await adminApi.createCourse(payload);
        }
      } catch {
        // API unavailable or unauthenticated — localStorage already saved, proceed silently
      }

      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-gray-800 mb-5">{course ? "Edit Course" : "Add Course"}</h3>
        <div className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
            <input
              value={form.duration}
              onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
              placeholder="e.g. 3 months"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
            <select
              value={form.categoryId}
              onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            >
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            >
              <option value="PUBLISHED">Active</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">One-time Price (ETB)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.priceOriginal === 0 ? "" : form.priceOriginal}
                onChange={e => setForm(p => ({ ...p, priceOriginal: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g. 199"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Monthly Subscription (ETB)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.priceDiscounted === 0 ? "" : form.priceDiscounted}
                onChange={e => setForm(p => ({ ...p, priceDiscounted: parseFloat(e.target.value) || 0 }))}
                placeholder="e.g. 29"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Rating (0 – 5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating === 0 ? "" : form.rating}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setForm(p => ({ ...p, rating: isNaN(v) ? 0 : Math.min(5, Math.max(0, v)) }));
              }}
              placeholder="e.g. 4.5"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Display Priority
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.priority === 0 ? "" : form.priority}
              onChange={e => {
                const v = parseInt(e.target.value, 10);
                setForm(p => ({ ...p, priority: isNaN(v) ? 0 : Math.max(0, v) }));
              }}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            />
            <p className="mt-1 text-[10px] text-gray-400">Lower number = shown first on the public page. 0 is the highest priority.</p>
          </div>

          {/* About This Course */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">About This Course</label>
            <textarea
              rows={4}
              value={form.shortDescription}
              onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))}
              placeholder="Describe what this course is about, who it's for, and what students will achieve…"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none"
            />
          </div>

          {/* What You Will Learn */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">What You Will Learn</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={outcomeInput}
                onChange={e => setOutcomeInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addOutcome())}
                placeholder="e.g. Build REST APIs — press Enter to add"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
              <button
                type="button"
                onClick={addOutcome}
                className="px-3 py-2 text-sm bg-[#1E90FF]/10 text-[#1E90FF] font-semibold rounded-lg hover:bg-[#1E90FF]/20 transition-colors"
              >
                Add
              </button>
            </div>
            {form.learningOutcomes.length > 0 && (
              <div className="flex flex-col gap-1.5 bg-gray-50 rounded-xl p-3">
                {form.learningOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-1.5 shadow-sm">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
                    <span className="flex-1 text-xs text-gray-700">{item}</span>
                    <button onClick={() => removeOutcome(idx)} className="text-gray-300 hover:text-red-400 transition-colors shrink-0">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-1 text-[10px] text-gray-400">These appear in the "What You Will Learn" section on the course page.</p>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Course Image</label>
            {form.imageUrl ? (
              <div className="relative inline-block w-full">
                <img
                  src={form.imageUrl}
                  alt="Course"
                  className="w-full h-36 object-cover rounded-lg border border-gray-200"
                  onError={() => setForm(p => ({ ...p, imageUrl: "" }))}
                />
                <button
                  onClick={() => setForm(p => ({ ...p, imageUrl: "" }))}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#1E90FF] transition-colors cursor-pointer"
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 size={28} className="animate-spin text-[#1E90FF]" />
                    <p className="text-xs text-gray-500">
                      {uploadProgress >= 0 ? `Uploading ${uploadProgress}%` : "Uploading..."}
                    </p>
                    {uploadProgress >= 0 && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-[#1E90FF] h-1.5 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <Upload size={28} className="text-gray-400" />
                    <p className="text-xs text-gray-500">Click to upload</p>
                    <p className="text-[11px] text-gray-400">PNG, JPG, WEBP, GIF · max 5 MB</p>
                  </div>
                )}
              </div>
            )}
            {!form.imageUrl && !uploading && (
              <div className="mt-2">
                <p className="text-[11px] text-gray-400 mb-1">Or paste an image URL:</p>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
            )}
            {uploadErr && <p className="mt-1 text-xs text-red-500">{uploadErr}</p>}
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {course ? "Save Changes" : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

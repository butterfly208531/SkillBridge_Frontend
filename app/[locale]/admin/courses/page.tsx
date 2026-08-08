"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, Star, Clock, RefreshCw } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

interface Course {
  id: string;
  title: string;
  shortDescription?: string;
  status: string;
  level: string;
  duration: string;
  mode?: string;
  rating?: number;
  studentsEnrolled?: number;
  imageUrl?: string;
  category?: { id: string; name: string };
  instructor?: { id: string; name: string };
  createdAt?: string;
}

const categoryColor: Record<string, string> = {
  default: "bg-[#1E90FF]/10 text-[#1E90FF]",
};

const modeColor: Record<string, string> = {
  Online:   "bg-[#1E90FF]/10 text-[#1E90FF]",
  Physical: "bg-[#F57C00]/10 text-[#F57C00]",
  Hybrid:   "bg-gray-100 text-gray-600",
};

function getCategoryColor(index: number) {
  return index % 2 === 0
    ? "bg-[#1E90FF]/10 text-[#1E90FF]"
    : "bg-[#F57C00]/10 text-[#F57C00]";
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";

  const fetchCourses = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("adminToken");
    try {
      const res = await fetch(`${API}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : data.data ?? []);
      } else {
        // fallback to landing endpoint
        const res2 = await fetch(`${API}/courses/landing`);
        const data = await res2.json();
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const toggleStatus = async (course: Course) => {
    const token = sessionStorage.getItem("adminToken");
    const newStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      await fetch(`${API}/courses/${course.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: newStatus } : c));
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/courses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    setCourses(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
    setDeleting(false);
  };

  // Build dynamic categories from real data
  const categories = ["All", ...Array.from(new Set(courses.map(c => c.category?.name ?? "Other")))];

  const filtered = courses.filter(c => {
    const matchCat = category === "All" || (c.category?.name ?? "") === category;
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category?.name ?? "").toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const active = filtered.filter(c => c.status === "PUBLISHED" || c.status === "active").length;
  const draft  = filtered.filter(c => c.status === "DRAFT"     || c.status === "draft").length;

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Courses" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                  category === cat
                    ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                )}>{cat}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input type="search" placeholder="Search courses..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-48" />
            </div>
            <button onClick={fetchCourses}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" title="Refresh">
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
            <button
              onClick={() => window.location.href = `/${locale}/admin/courses/add`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors">
              <Plus size={14} /> Add Course
            </button>
          </div>
        </div>

        {/* Summary */}
        {!loading && (
          <div className="flex gap-4 text-sm">
            <span className="text-gray-500">Total: <strong className="text-gray-800">{filtered.length}</strong></span>
            <span className="text-emerald-600">Published: <strong>{active}</strong></span>
            <span className="text-gray-400">Draft: <strong>{draft}</strong></span>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Loading courses from API...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No courses found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold">Course</th>
                    <th className="px-5 py-3 text-left font-semibold">Category</th>
                    <th className="px-5 py-3 text-left font-semibold">Duration</th>
                    <th className="px-5 py-3 text-left font-semibold">Rating</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((course, idx) => {
                    const status = (course.status || "").toUpperCase();
                    const isPublished = status === "PUBLISHED";
                    return (
                      <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800 truncate max-w-[200px]">{course.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[200px]">{course.id}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold", getCategoryColor(idx))}>
                            {course.category?.name ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock size={12} />{course.duration || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {course.rating ? (
                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                              <Star size={12} className="fill-amber-400 text-amber-400" />{course.rating}
                            </span>
                          ) : <span className="text-xs text-gray-400">—</span>}
                        </td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => toggleStatus(course)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors",
                              isPublished
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            )}>
                            {isPublished ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => window.location.href = `/${locale}/admin/courses/edit/${course.id}`}
                              className="p-1.5 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors" title="Edit">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setDeleteId(course.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone and will remove the course from the platform.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-60">
                {deleting && <RefreshCw size={13} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

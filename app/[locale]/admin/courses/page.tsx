"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Star, Users, Clock, Filter } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const BOOTCAMPS = [
  { id: "odoo-functional-erp",       title: "Odoo Functional ERP",         category: "ERP",         level: "Beginner",     duration: "8 weeks",  mode: "Online",   rating: 4.7, reviews: 40,  status: "active" },
  { id: "odoo-technical-development",title: "Odoo Technical Development",   category: "ERP",         level: "Intermediate", duration: "8 weeks",  mode: "Online",   rating: 4.9, reviews: 50,  status: "active" },
  { id: "full-stack-development",    title: "Full-Stack Development",       category: "Development", level: "Beginner",     duration: "4 months", mode: "Online",   rating: 4.8, reviews: 50,  status: "active" },
  { id: "python-programming",        title: "Python Programming",           category: "Development", level: "Beginner",     duration: "6 weeks",  mode: "Online",   rating: 4.8, reviews: 60,  status: "active" },
  { id: "ai-machine-learning",       title: "AI & Machine Learning",        category: "AI",          level: "Intermediate", duration: "3 months", mode: "Online",   rating: 4.9, reviews: 35,  status: "active" },
  { id: "data-science",              title: "Data Science",                 category: "AI",          level: "Intermediate", duration: "10 weeks", mode: "Online",   rating: 4.7, reviews: 28,  status: "active" },
  { id: "n8n-automation",            title: "n8n Automation",               category: "Automation",  level: "Beginner",     duration: "4 weeks",  mode: "Online",   rating: 4.6, reviews: 22,  status: "active" },
  { id: "ielts-preparation",         title: "IELTS Preparation",            category: "Language",    level: "All Levels",   duration: "8 weeks",  mode: "Physical", rating: 4.7, reviews: 30,  status: "active" },
  { id: "toefl-preparation",         title: "TOEFL Preparation",            category: "Language",    level: "All Levels",   duration: "8 weeks",  mode: "Physical", rating: 4.6, reviews: 18,  status: "draft"  },
  { id: "duolingo-preparation",      title: "Duolingo Preparation",         category: "Language",    level: "All Levels",   duration: "4 weeks",  mode: "Online",   rating: 4.5, reviews: 15,  status: "draft"  },
];

const CATEGORIES = ["All", "ERP", "Development", "AI", "Automation", "Language"];

const categoryColor: Record<string, string> = {
  ERP:         "bg-[#1E90FF]/10 text-[#1E90FF]",
  Development: "bg-[#F57C00]/10 text-[#F57C00]",
  AI:          "bg-purple-100 text-purple-600",
  Automation:  "bg-emerald-100 text-emerald-600",
  Language:    "bg-pink-100 text-pink-600",
};

const modeColor: Record<string, string> = {
  Online:   "bg-blue-50 text-blue-600",
  Physical: "bg-amber-50 text-amber-600",
  Hybrid:   "bg-teal-50 text-teal-600",
};

export default function CoursesAdminPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [courses, setCourses] = useState(BOOTCAMPS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<typeof BOOTCAMPS[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = courses.filter(c => {
    const matchCat = category === "All" || c.category === category;
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    setDeleteId(null);
  };

  const handleToggleStatus = (id: string) => {
    setCourses(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "active" ? "draft" : "active" } : c
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Courses" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
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
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Course
            </button>
          </div>
        </div>

        {/* Summary row */}
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
                  <th className="px-5 py-3 text-left font-semibold">Course</th>
                  <th className="px-5 py-3 text-left font-semibold">Category</th>
                  <th className="px-5 py-3 text-left font-semibold">Level</th>
                  <th className="px-5 py-3 text-left font-semibold">Duration</th>
                  <th className="px-5 py-3 text-left font-semibold">Mode</th>
                  <th className="px-5 py-3 text-left font-semibold">Rating</th>
                  <th className="px-5 py-3 text-left font-semibold">Students</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                  <th className="px-5 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800 truncate max-w-[180px]">{course.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">{course.id}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold", categoryColor[course.category] ?? "bg-gray-100 text-gray-500")}>
                        {course.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{course.level}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />{course.duration}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold", modeColor[course.mode] ?? "bg-gray-100 text-gray-500")}>
                        {course.mode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                        <Star size={12} className="fill-amber-400 text-amber-400" />{course.rating}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={12} />{course.reviews}
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
              <BookOpenIcon className="mx-auto mb-3 h-10 w-10 text-gray-200" />
              <p className="text-sm">No courses found</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <CourseModal
          course={editing}
          onClose={() => setShowModal(false)}
          onSave={(updated) => {
            if (editing) {
              setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
            } else {
              setCourses(prev => [...prev, { ...updated, id: `course-${Date.now()}`, reviews: 0, rating: 0, status: "draft" }]);
            }
            setShowModal(false);
          }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Course?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
}

function CourseModal({ course, onClose, onSave }: {
  course: typeof BOOTCAMPS[0] | null;
  onClose: () => void;
  onSave: (c: any) => void;
}) {
  const [form, setForm] = useState({
    id:       course?.id       ?? "",
    title:    course?.title    ?? "",
    category: course?.category ?? "ERP",
    level:    course?.level    ?? "Beginner",
    duration: course?.duration ?? "",
    mode:     course?.mode     ?? "Online",
    status:   course?.status   ?? "draft",
    rating:   course?.rating   ?? 0,
    reviews:  course?.reviews  ?? 0,
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-gray-800 mb-5">{course ? "Edit Course" : "Add Course"}</h3>
        <div className="space-y-4">
          {[
            { label: "Title",    field: "title",    type: "text" },
            { label: "Duration", field: "duration", type: "text" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={(form as any)[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>
          ))}
          {[
            { label: "Category", field: "category", options: ["ERP","Development","AI","Automation","Language"] },
            { label: "Level",    field: "level",    options: ["Beginner","Intermediate","Advanced","All Levels"] },
            { label: "Mode",     field: "mode",     options: ["Online","Physical","Hybrid"] },
            { label: "Status",   field: "status",   options: ["active","draft"] },
          ].map(({ label, field, options }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <select
                value={(form as any)[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 text-sm rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500"
          >
            {course ? "Save Changes" : "Add Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

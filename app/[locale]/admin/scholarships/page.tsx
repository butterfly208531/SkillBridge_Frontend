"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Award, Users, Calendar, CheckCircle } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const INITIAL_SCHOLARSHIPS = [
  {
    id: "full-stack",
    name: "Full-Stack Scholarship",
    courseId: "full-stack-development",
    course: "Full-Stack Development",
    applicationsCount: 42,
    winnersCount: 3,
    deadline: "2025-08-31",
    eligibility: "Top performer in Python and Web Development courses",
    status: "active",
  },
  {
    id: "odoo-functional",
    name: "Odoo Functional Scholarship",
    courseId: "odoo-functional-erp",
    course: "Odoo Functional ERP",
    applicationsCount: 28,
    winnersCount: 2,
    deadline: "2025-08-31",
    eligibility: "Strong interest in ERP and business processes",
    status: "active",
  },
  {
    id: "python",
    name: "Python Scholarship",
    courseId: "python-programming",
    course: "Python Programming",
    applicationsCount: 56,
    winnersCount: 3,
    deadline: "2025-09-15",
    eligibility: "Demonstrated programming aptitude and financial need",
    status: "active",
  },
  {
    id: "ai",
    name: "AI & Machine Learning Scholarship",
    courseId: "ai-machine-learning",
    course: "AI & Machine Learning",
    applicationsCount: 35,
    winnersCount: 2,
    deadline: "2025-09-15",
    eligibility: "Background in mathematics and programming",
    status: "active",
  },
];

const WINNERS = [
  { id: "w1", name: "Abebe Kebede",    scholarship: "Full-Stack Scholarship",        year: 2024, status: "active"    },
  { id: "w2", name: "Tigist Haile",    scholarship: "Odoo Functional Scholarship",   year: 2024, status: "active"    },
  { id: "w3", name: "Sara Mohammed",   scholarship: "AI & ML Scholarship",           year: 2024, status: "active"    },
  { id: "w4", name: "Yohannes Tadesse",scholarship: "Python Scholarship",            year: 2025, status: "completed" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState(INITIAL_SCHOLARSHIPS);
  const [tab, setTab] = useState<"programs" | "winners">("programs");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<typeof INITIAL_SCHOLARSHIPS[0] | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setScholarships(prev => prev.filter(s => s.id !== id));
    setDeleteId(null);
  };

  const handleSave = (data: any) => {
    if (editing) {
      setScholarships(prev => prev.map(s => s.id === data.id ? data : s));
    } else {
      setScholarships(prev => [...prev, { ...data, id: `sch-${Date.now()}`, applicationsCount: 0, status: "active" }]);
    }
    setShowModal(false);
  };

  const totalApps = scholarships.reduce((s, x) => s + x.applicationsCount, 0);
  const totalWinners = scholarships.reduce((s, x) => s + x.winnersCount, 0);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Scholarships" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Programs",     value: scholarships.length, icon: Award,       color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/10" },
            { label: "Applications", value: totalApps,           icon: Users,       color: "text-[#F57C00]", bg: "bg-[#F57C00]/10" },
            { label: "Winners",      value: totalWinners,        icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50"  },
            { label: "Active",       value: scholarships.filter(s => s.status === "active").length, icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
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

        {/* Tabs + Add */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["programs", "winners"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  tab === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >{t}</button>
            ))}
          </div>
          {tab === "programs" && (
            <button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Scholarship
            </button>
          )}
        </div>

        {/* Programs tab */}
        {tab === "programs" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scholarships.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Color bar */}
                <div className="h-1.5" style={{ background: "linear-gradient(90deg, #1E90FF, #F57C00)" }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">{s.name}</h3>
                      <p className="text-xs text-[#1E90FF] mt-0.5">{s.course}</p>
                    </div>
                    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold",
                      s.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                    )}>{s.status}</span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{s.eligibility}</p>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { icon: Users,    label: "Applicants", value: s.applicationsCount },
                      { icon: Award,    label: "Winners",    value: s.winnersCount },
                      { icon: Calendar, label: "Deadline",   value: formatDate(s.deadline) },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="text-center">
                        <Icon className="h-4 w-4 text-gray-300 mx-auto mb-1" />
                        <p className="text-sm font-bold text-gray-800">{value}</p>
                        <p className="text-[10px] text-gray-400">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => { setEditing(s); setShowModal(true); }}
                      className="flex items-center gap-1.5 flex-1 justify-center py-1.5 text-xs text-[#1E90FF] border border-[#1E90FF]/30 rounded-lg hover:bg-[#1E90FF]/5 transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(s.id)}
                      className="flex items-center gap-1.5 flex-1 justify-center py-1.5 text-xs text-red-400 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Winners tab */}
        {tab === "winners" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold">Winner</th>
                  <th className="px-5 py-3 text-left font-semibold">Scholarship</th>
                  <th className="px-5 py-3 text-left font-semibold">Year</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {WINNERS.map(w => (
                  <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#F57C00] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {w.name[0]}
                        </div>
                        <span className="font-medium text-gray-800">{w.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{w.scholarship}</td>
                    <td className="px-5 py-3.5 text-xs text-gray-500">{w.year}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                        w.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      )}>{w.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <ScholarshipModal
          scholarship={editing}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Scholarship?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
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

function ScholarshipModal({ scholarship, onClose, onSave }: {
  scholarship: typeof INITIAL_SCHOLARSHIPS[0] | null;
  onClose: () => void;
  onSave: (d: any) => void;
}) {
  const [form, setForm] = useState({
    id:          scholarship?.id          ?? "",
    name:        scholarship?.name        ?? "",
    course:      scholarship?.course      ?? "",
    courseId:    scholarship?.courseId    ?? "",
    eligibility: scholarship?.eligibility ?? "",
    deadline:    scholarship?.deadline    ?? "",
    winnersCount:scholarship?.winnersCount ?? 1,
    applicationsCount: scholarship?.applicationsCount ?? 0,
    status:      scholarship?.status      ?? "active",
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-gray-800 mb-5">{scholarship ? "Edit Scholarship" : "Add Scholarship"}</h3>
        <div className="space-y-4">
          {[
            { label: "Scholarship Name", field: "name",        type: "text" },
            { label: "Course Name",      field: "course",      type: "text" },
            { label: "Eligibility",      field: "eligibility", type: "text" },
            { label: "Deadline",         field: "deadline",    type: "date" },
            { label: "Winners Count",    field: "winnersCount",type: "number" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type={type}
                value={(form as any)[field]}
                onChange={e => setForm(p => ({ ...p, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 text-sm rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500"
          >
            {scholarship ? "Save Changes" : "Add Scholarship"}
          </button>
        </div>
      </div>
    </div>
  );
}

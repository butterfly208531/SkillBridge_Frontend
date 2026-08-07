"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Award, Users, Calendar, CheckCircle, RefreshCw, Loader2, Link2 } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";
import { saveScholarships } from "@/lib/scholarship-store";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

interface Scholarship {
  id: string;
  name: string;
  courseId: string;
  course: string;
  applicationsCount: number;
  winnersCount: number;
  deadline: string;
  eligibility: string;
  status: string;
  fundingType?: "full" | "half";
  tuitionAmount?: number;
  applicationFormUrl?: string;
}

interface Winner {
  id: string;
  name: string;
  scholarship: string;
  year: number;
  status: string;
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [winners,      setWinners]      = useState<Winner[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [tab,          setTab]          = useState<"programs" | "winners">("programs");
  const [showModal,    setShowModal]    = useState(false);
  const [editing,      setEditing]      = useState<Scholarship | null>(null);
  const [deleteId,     setDeleteId]     = useState<string | null>(null);
  const [saving,       setSaving]       = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const token = sessionStorage.getItem("adminToken");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [schRes, winRes] = await Promise.all([
        fetch(`${API}/scholarships`, { headers }),
        fetch(`${API}/scholarship-winners`, { headers }).catch(() => null),
      ]);

      if (schRes.ok) {
        const d = await schRes.json();
        const data: Scholarship[] = (Array.isArray(d) ? d : d.data ?? []).map((s: any) => ({
          id:                 s.id || s._id || "",
          name:               s.name || s.title || "",
          courseId:           s.courseId || s.course?.id || "",
          course:             s.course?.title || s.courseName || s.courseId || "",
          applicationsCount:  s.applicationsCount ?? 0,
          winnersCount:       s.winnersCount ?? 0,
          deadline:           s.deadline || s.endDate || "",
          eligibility:        s.eligibility || s.requirements || "",
          status:             (s.status || "active").toLowerCase(),
          fundingType:        s.fundingType,
          tuitionAmount:      s.tuitionAmount,
          applicationFormUrl: s.applicationFormUrl || "",
        }));
        setScholarships(data);
        saveScholarships(data as any); // persist for public pages
      } else {
        setError(`API error ${schRes.status} — no scholarships loaded`);
        setScholarships([]);
      }

      if (winRes?.ok) {
        const d = await winRes.json();
        setWinners((Array.isArray(d) ? d : d.data ?? []).map((w: any) => ({
          id:         w.id || w._id || "",
          name:       w.name || w.studentName || "",
          scholarship:w.scholarship || w.scholarshipName || "",
          year:       w.year || new Date(w.awardedAt || Date.now()).getFullYear(),
          status:     (w.status || "active").toLowerCase(),
        })));
      } else {
        setWinners([]);
      }
    } catch (e: any) {
      setError("Could not connect to API");
      setScholarships([]);
      setWinners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/scholarships/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    const updated = scholarships.filter(s => s.id !== id);
    setScholarships(updated);
    saveScholarships(updated as any);
    setDeleteId(null);
  };

  const handleSave = async (data: Scholarship) => {
    setSaving(true);
    const token = sessionStorage.getItem("adminToken");
    const isEdit = !!editing;

    try {
      const res = await fetch(
        isEdit ? `${API}/scholarships/${data.id}` : `${API}/scholarships`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        }
      );
      const saved = res.ok ? await res.json().catch(() => data) : data;
      const newItem: Scholarship = { ...data, id: saved.id || saved._id || data.id || `sch-${Date.now()}` };
      const updated = isEdit
        ? scholarships.map(s => s.id === data.id ? newItem : s)
        : [...scholarships, newItem];
      setScholarships(updated);
      saveScholarships(updated as any);
    } catch {
      // still update local state
      const updated = isEdit
        ? scholarships.map(s => s.id === data.id ? data : s)
        : [...scholarships, { ...data, id: `sch-${Date.now()}` }];
      setScholarships(updated);
      saveScholarships(updated as any);
    } finally {
      setSaving(false);
      setShowModal(false);
    }
  };

  const totalApps    = scholarships.reduce((s, x) => s + (x.applicationsCount || 0), 0);
  const totalWinners = scholarships.reduce((s, x) => s + (x.winnersCount || 0), 0);
  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Scholarships" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Programs",     value: scholarships.length,                                    color: "text-[#1E90FF]",  bg: "bg-[#1E90FF]/10" },
            { label: "Applications", value: totalApps,                                              color: "text-[#F57C00]",  bg: "bg-[#F57C00]/10" },
            { label: "Winners",      value: totalWinners,                                           color: "text-emerald-500", bg: "bg-emerald-50"   },
            { label: "Active",       value: scholarships.filter(s => s.status === "active").length, color: "text-purple-500", bg: "bg-purple-50"    },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                <Award className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["programs", "winners"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  tab === t ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}>{t}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50" title="Refresh">
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
            {tab === "programs" && (
              <button
                onClick={() => window.location.href = `/${locale}/admin/scholarships/add`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Plus size={14} /> Add Scholarship
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchData} className="text-xs underline ml-3">Retry</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-2 text-gray-400 text-sm">
            <Loader2 size={18} className="animate-spin" /> Loading from API...
          </div>
        )}

        {/* Programs tab */}
        {!loading && tab === "programs" && (
          scholarships.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Award className="h-14 w-14 text-gray-200 mb-4" />
              <p className="text-base font-semibold text-gray-500 mb-1">No scholarships yet</p>
              <p className="text-sm text-gray-400 mb-6">Add your first scholarship program to get started</p>
              <button
                onClick={() => window.location.href = `/${locale}/admin/scholarships/add`}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-xl hover:bg-blue-500 transition-colors"
              >
                <Plus size={15} /> Add Scholarship
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {scholarships.map(s => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-1.5" style={{ background: "linear-gradient(90deg,#1E90FF,#F57C00)" }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">{s.name}</h3>
                        <p className="text-xs text-[#1E90FF] mt-0.5">{s.course || s.courseId}</p>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize",
                        s.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                      )}>{s.status}</span>
                    </div>

                    {s.eligibility && (
                      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{s.eligibility}</p>
                    )}

                    {/* Funding info */}
                    {s.tuitionAmount && (
                      <div className="mb-3 px-3 py-2 bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-lg flex items-center gap-2 text-xs">
                        <span className={cn("font-bold px-2 py-0.5 rounded-full text-[10px]",
                          s.fundingType === "full" ? "bg-[#1E90FF]/10 text-[#1E90FF]" : "bg-[#F57C00]/10 text-[#F57C00]"
                        )}>
                          {s.fundingType === "full" ? "Fully Funded" : "Half Funded"}
                        </span>
                        <span className="text-gray-500">ETB {s.tuitionAmount}</span>
                        <span className="text-gray-400">→</span>
                        <span className={cn("font-bold", s.fundingType === "full" ? "text-[#1E90FF]" : "text-[#F57C00]")}>
                          You Pay: ETB {s.fundingType === "full" ? 0 : Math.round(s.tuitionAmount * 0.5)}
                        </span>
                      </div>
                    )}

                    {/* Application form URL */}
                    {s.applicationFormUrl ? (
                      <div className="mb-3 px-3 py-2 bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-lg">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Application Form</p>
                        <a href={s.applicationFormUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[#1E90FF] hover:underline break-all font-medium flex items-center gap-1">
                          <Link2 size={11} /> {s.applicationFormUrl}
                        </a>
                      </div>
                    ) : (
                      <div className="mb-3 px-3 py-2 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-[10px] text-gray-400 italic">No custom form URL — using default scholarship form</p>
                      </div>
                    )}

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
                      <button onClick={() => { setEditing(s); setShowModal(true); }}
                        className="flex items-center gap-1.5 flex-1 justify-center py-1.5 text-xs text-[#1E90FF] border border-[#1E90FF]/30 rounded-lg hover:bg-[#1E90FF]/5 transition-colors">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => setDeleteId(s.id)}
                        className="flex items-center gap-1.5 flex-1 justify-center py-1.5 text-xs text-red-400 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Winners tab */}
        {!loading && tab === "winners" && (
          winners.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No winners data from API</div>
          ) : (
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
                  {winners.map(w => (
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
          )
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editing && (
        <ScholarshipModal
          scholarship={editing}
          saving={saving}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Scholarship?</h3>
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

function ScholarshipModal({ scholarship, saving, onClose, onSave }: {
  scholarship: Scholarship;
  saving: boolean;
  onClose: () => void;
  onSave: (d: Scholarship) => void;
}) {
  const [form, setForm] = useState<Scholarship>({ ...scholarship });
  const set = (field: keyof Scholarship, value: any) => setForm(p => ({ ...p, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h3 className="font-bold text-gray-800 mb-5">Edit Scholarship</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Scholarship Name</label>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Eligibility</label>
            <input value={form.eligibility} onChange={e => set("eligibility", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
          </div>

          <div className="bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-xl p-3">
            <label className="block text-xs font-semibold text-[#1E90FF] mb-1">🔗 Application Form URL</label>
            <p className="text-[11px] text-gray-400 mb-2">Leave empty to use the default scholarship form</p>
            <input type="url" value={form.applicationFormUrl ?? ""}
              placeholder="https://forms.google.com/..."
              onChange={e => set("applicationFormUrl", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Deadline</label>
              <input type="date" value={form.deadline}
                onChange={e => set("deadline", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Winners Count</label>
              <input type="number" value={form.winnersCount}
                onChange={e => set("winnersCount", Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#1E90FF] text-white hover:bg-blue-500 disabled:opacity-60">
            {saving && <Loader2 size={13} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

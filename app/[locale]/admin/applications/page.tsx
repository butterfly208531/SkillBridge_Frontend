"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Trash2, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

type Status = "all" | "pending" | "approved" | "rejected";

interface Application {
  id?: string;
  _id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  telegramHandle?: string;
  courseId?: string;
  course?: string;
  category?: string;
  paymentMethod?: string;
  payment?: string;
  paymentReference?: string;
  gender?: string;
  nationality?: string;
  address?: string;
  status?: string;
  createdAt?: string;
  date?: string;
  receiptUrl?: string;
}

const statusStyle: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-500",
};

const statusIcon: Record<string, React.ReactNode> = {
  pending:  <Clock size={12} />,
  approved: <CheckCircle size={12} />,
  rejected: <XCircle size={12} />,
};

// Map course name keywords → category labels (mirrors courses-section logic)
function inferCategory(courseName: string): string {
  const n = courseName.toLowerCase();
  if (n.includes("odoo") || n.includes("erp") || n.includes("sap"))           return "ERP";
  if (n.includes("ai") || n.includes("machine learning") || n.includes("ml") || n.includes("data science")) return "AI";
  if (n.includes("python") || n.includes("java") || n.includes("react") ||
      n.includes("node") || n.includes("web") || n.includes("flutter") ||
      n.includes("android") || n.includes("ios") || n.includes("dev"))        return "Development";
  if (n.includes("network") || n.includes("cyber") || n.includes("linux") ||
      n.includes("cisco") || n.includes("cloud") || n.includes("aws") ||
      n.includes("it ") || n.startsWith("it"))                                 return "IT";
  if (n.includes("excel") || n.includes("accountin") || n.includes("finance") ||
      n.includes("business") || n.includes("market") || n.includes("manag"))  return "Business";
  if (n.includes("arabic") || n.includes("english") || n.includes("french") ||
      n.includes("language") || n.includes("ielts") || n.includes("toefl"))   return "Language";
  if (n.includes("automat") || n.includes("robot") || n.includes("rpa"))      return "Automation";
  return "Other";
}

const categoryColor: Record<string, string> = {
  Development: "bg-[#F57C00]/10 text-[#F57C00]",
  AI:          "bg-purple-100 text-purple-600",
  ERP:         "bg-[#1E90FF]/10 text-[#1E90FF]",
  IT:          "bg-cyan-100 text-cyan-600",
  Business:    "bg-emerald-100 text-emerald-600",
  Language:    "bg-pink-100 text-pink-600",
  Automation:  "bg-teal-100 text-teal-600",
  Other:       "bg-gray-100 text-gray-500",
};

export default function ApplicationsPage() {
  const [apps, setApps]               = useState<Application[]>([]);
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [categories, setCategories]   = useState<string[]>(["All"]);
  const [selected, setSelected]       = useState<Application | null>(null);
  const [loading, setLoading]         = useState(true);
  const [updating, setUpdating]       = useState<string | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState("");

  // Derive a stable category for each application
  const getAppCategory = (a: Application): string => {
    if (a.category) return a.category;
    const courseName = a.course || (a.courseId && !a.courseId.includes("-") ? a.courseId : "") || "";
    return courseName ? inferCategory(courseName) : "Other";
  };

  const fetchApps = async () => {
    const token = sessionStorage.getItem("adminToken");
    setLoading(true);
    setError("");
    setSuccess("");

    // Load locally-stored pending submissions (offline / API-down submissions)
    const loadLocal = (): Application[] => {
      try {
        const pending = JSON.parse(localStorage.getItem("pendingApplications") || "[]");
        const notifs: any[] = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
        const all = [...pending, ...notifs];
        const seen = new Set<string>();
        return all
          .filter(n => { const id = n.id || n._id; if (!id || seen.has(id)) return false; seen.add(id); return true; })
          .map(n => ({
            id:             n.id || n._id,
            fullName:       n.fullName,
            email:          n.email,
            phone:          n.phone,
            telegramHandle: n.telegramHandle,
            address:        n.address,
            gender:         n.gender,
            nationality:    n.nationality,
            university:     n.university,
            courseId:       n.courseSlug || n.courseId,
            course:         n.courseName || n.course,
            category:       n.category,
            paymentMethod:  n.paymentMethod,
            status:         n.status || "pending",
            createdAt:      n.submittedAt || n.createdAt,
          }));
      } catch { return []; }
    };

    const applyAndSetApps = (list: Application[]) => {
      setApps(list);
      const cats = ["All", ...Array.from(new Set(list.map(a => getAppCategory(a)))).sort()];
      setCategories(cats);
    };

    try {
      const response = await fetch(`${API}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const apiApps: Application[] = Array.isArray(data) ? data : data.data ?? [];
        const local = loadLocal();
        const apiIds = new Set(apiApps.map(a => a.id || a._id));
        const merged = [...apiApps, ...local.filter(l => !apiIds.has(l.id))];
        applyAndSetApps(merged);
        if (merged.length > 0) {
          setSuccess(`Loaded ${merged.length} application${merged.length !== 1 ? "s" : ""}`);
        }
      } else if (response.status === 401 || response.status === 403) {
        applyAndSetApps(loadLocal());
      } else {
        const local = loadLocal();
        applyAndSetApps(local);
        if (local.length > 0) {
          setError(`Showing ${local.length} locally stored submission${local.length !== 1 ? "s" : ""} (live data unavailable)`);
        }
      }
    } catch {
      applyAndSetApps(loadLocal());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const filtered = apps.filter(a => {
    const name   = a.fullName || a.name || "";
    const course = a.course || "";
    const email  = a.email || "";
    const status = (a.status || "").toLowerCase();
    const cat    = getAppCategory(a);

    const matchStatus   = statusFilter === "all" || status === statusFilter;
    const matchCategory = categoryFilter === "All" || cat === categoryFilter;
    const matchSearch   = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      course.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchCategory && matchSearch;
  });

  const counts = {
    all:      apps.length,
    pending:  apps.filter(a => (a.status || "").toLowerCase() === "pending").length,
    approved: apps.filter(a => (a.status || "").toLowerCase() === "approved").length,
    rejected: apps.filter(a => (a.status || "").toLowerCase() === "rejected").length,
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (updating === id) return;
    setUpdating(id);
    setError("");
    setSuccess("");

    if (id.startsWith("local-")) {
      setApps(prev => prev.map(a => (a.id || a._id) === id ? { ...a, status: newStatus } : a));
      setSelected(prev => prev && (prev.id || prev._id) === id ? { ...prev, status: newStatus } : prev);
      setSuccess(`Application ${newStatus} successfully`);
      setTimeout(() => setSuccess(""), 3000);
      setUpdating(null);
      return;
    }

    const token = sessionStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API}/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`Failed to update status: ${response.status}`);
      setApps(prev => prev.map(a => (a.id || a._id) === id ? { ...a, status: newStatus } : a));
      setSelected(prev => prev && (prev.id || prev._id) === id ? { ...prev, status: newStatus } : prev);
      setSuccess(`Application ${newStatus} successfully`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
      setTimeout(() => setError(""), 4000);
    } finally {
      setUpdating(null);
    }
  };

  const deleteApp = async (id: string) => {
    setDeleteId(null);
    // Remove from local state immediately
    setApps(prev => {
      const next = prev.filter(a => (a.id || a._id) !== id);
      const cats = ["All", ...Array.from(new Set(next.map(a => getAppCategory(a)))).sort()];
      setCategories(cats);
      return next;
    });
    if (selected && (selected.id || selected._id) === id) setSelected(null);

    // Best-effort API delete
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/applications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* silent */ }
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Applications" />
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                categoryFilter === cat
                  ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#1E90FF] hover:text-[#1E90FF]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status tabs + search */}
        <div className="flex gap-2 flex-wrap items-center">
          {(["all","pending","approved","rejected"] as Status[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize",
                statusFilter === s
                  ? s === "all"      ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                  : s === "pending"  ? "bg-yellow-500 text-white border-yellow-500"
                  : s === "approved" ? "bg-emerald-500 text-white border-emerald-500"
                  :                   "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              )}
            >
              {s} <span className="ml-1 opacity-70">({counts[s]})</span>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="search"
                placeholder="Search applicants..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-52"
              />
            </div>
            <button
              onClick={fetchApps}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              title="Refresh"
              disabled={loading}
            >
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">Total: <strong className="text-gray-800">{filtered.length}</strong></span>
          <span className="text-yellow-600">Pending: <strong>{filtered.filter(a => (a.status || "").toLowerCase() === "pending").length}</strong></span>
          <span className="text-emerald-600">Approved: <strong>{filtered.filter(a => (a.status || "").toLowerCase() === "approved").length}</strong></span>
          <span className="text-red-400">Rejected: <strong>{filtered.filter(a => (a.status || "").toLowerCase() === "rejected").length}</strong></span>
        </div>

        {/* Messages */}
        {error && (
          <div className="px-4 py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm flex items-center gap-2">
            <span className="text-amber-500">ℹ</span> {error}
          </div>
        )}
        {success && (
          <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-sm">
            ✅ {success}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Loading applications...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold">Student</th>
                    <th className="px-5 py-3 text-left font-semibold">Course</th>
                    <th className="px-5 py-3 text-left font-semibold">Category</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((app, i) => {
                    const id      = app.id || app._id || String(i);
                    const name    = app.fullName || app.name || "—";
                    const email   = app.email || "—";
                    const course  = app.course || (app.courseId && !app.courseId.includes("-") ? app.courseId : "") || "—";
                    const date    = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : app.date || "—";
                    const status  = (app.status || "pending").toLowerCase();
                    const cat     = getAppCategory(app);
                    const isUpdating = updating === id;

                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800">{name}</p>
                          <p className="text-[11px] text-gray-400">{email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[160px] truncate">{course}</td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            categoryColor[cat] ?? "bg-gray-100 text-gray-500"
                          )}>
                            {cat}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">{date}</td>
                        <td className="px-5 py-3.5">
                          <span className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold w-fit capitalize",
                            statusStyle[status] ?? "bg-gray-100 text-gray-500"
                          )}>
                            {statusIcon[status]}
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelected(app)}
                              className="p-1.5 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteId(id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm">
                  {search ? "No applications match your search" : "No applications found"}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {selected.fullName || selected.name || "—"}
                </h3>
                <p className="text-xs text-gray-400">{selected.id || selected._id}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                  statusStyle[(selected.status || "pending").toLowerCase()] ?? "bg-gray-100 text-gray-500"
                )}>
                  {selected.status || "pending"}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-semibold",
                  categoryColor[getAppCategory(selected)] ?? "bg-gray-100 text-gray-500"
                )}>
                  {getAppCategory(selected)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email",       value: selected.email },
                { label: "Phone",       value: selected.phone },
                { label: "Telegram",    value: selected.telegramHandle },
                { label: "Course",      value: selected.course || (selected.courseId && !selected.courseId.includes("-") ? selected.courseId : "") || selected.courseId },
                { label: "Payment",     value: selected.paymentMethod },
                { label: "Payment Ref", value: selected.paymentReference },
                { label: "Gender",      value: selected.gender },
                { label: "Nationality", value: selected.nationality },
                { label: "Address",     value: selected.address },
                { label: "Date",        value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : selected.date },
              ].filter(f => f.value).map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-gray-700 font-medium text-xs mt-0.5 break-all">{value}</p>
                </div>
              ))}
            </div>

            {/* Receipt image if available */}
            {selected.receiptUrl && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Payment Receipt</p>
                <img
                  src={selected.receiptUrl}
                  alt="Receipt"
                  className="w-full rounded-lg border border-gray-100 max-h-48 object-contain"
                />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {(selected.status || "").toLowerCase() !== "approved" && (
                <button
                  onClick={() => updateStatus(selected.id || selected._id || "", "approved")}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  disabled={updating === (selected.id || selected._id)}
                >
                  {updating === (selected.id || selected._id) ? "Updating..." : "Approve"}
                </button>
              )}
              {(selected.status || "").toLowerCase() !== "rejected" && (
                <button
                  onClick={() => updateStatus(selected.id || selected._id || "", "rejected")}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={updating === (selected.id || selected._id)}
                >
                  {updating === (selected.id || selected._id) ? "Updating..." : "Reject"}
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Application?</h3>
            <p className="text-sm text-gray-500 mb-5">This will permanently remove the application record.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteApp(deleteId)}
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

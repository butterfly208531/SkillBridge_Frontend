"use client";

import { useEffect, useState } from "react";
import { Search, Eye, Trash2, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";import {
  getApplicationsSupabase,
  updateApplicationSupabase,
  deleteApplicationSupabase,
} from "@/lib/applications-supabase";
import {
  getJobApplicationsSupabase,
  updateJobApplicationSupabase,
  deleteJobApplicationSupabase,
} from "@/lib/job-applications-supabase";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

type Status = "all" | "pending" | "approved" | "rejected";
type AppType = "all" | "course" | "job";

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
  courseType?: string;
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
  type?: "course" | "job";
  company?: string;
  coverLetter?: string;
  jobTitle?: string;
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

/** Normalizes raw API/localStorage status values to the three canonical display values. */
const normalizeStatus = (raw: string | undefined): string => {
  const s = (raw || "pending").toLowerCase();
  if (s === "pending_sync" || s === "pending sync") return "pending";
  return s;
};


export default function ApplicationsPage() {
  const initialType = (typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("type")
    : null) as "all" | "course" | "job" | null;

  const [apps, setApps]                 = useState<Application[]>([]);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [courseFilter, setCourseFilter] = useState("All");
  const [typeFilter, setTypeFilter]     = useState<AppType>(initialType === "course" || initialType === "job" ? initialType : "all");
  const [courses, setCourses]           = useState<string[]>(["All"]);
  const [selected, setSelected]             = useState<Application | null>(null);
  const [loading, setLoading]               = useState(true);
  const [updating, setUpdating]             = useState<string | null>(null);
  const [deleteId, setDeleteId]             = useState<string | null>(null);
  const [error, setError]                   = useState("");
  const [success, setSuccess]               = useState("");

  const getAppCourse = (a: Application): string =>
    a.course || (a.courseId && !a.courseId.includes("-") ? a.courseId : "") || "Unknown";

  const getAppType = (a: Application): "course" | "job" => a.type || "course";

  const getPaymentMethod = (a: Application): string =>
    a.paymentMethod || a.payment || "";

  const getPaymentRef = (a: Application): string =>
    a.paymentReference || (a as any).payment_ref || (a as any).paymentRef || "";

  const getReceiptUrl = (a: Application): string =>
    a.receiptUrl || (a as any).receipt || (a as any).receipt_url || "";

  const fetchApps = async () => {
    const token = sessionStorage.getItem("adminToken");
    setLoading(true);
    setError("");
    setSuccess("");

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
            courseId:       n.courseSlug || n.courseId,
            course:         n.courseName || n.course,
            category:       n.category,
            courseType:     n.courseType,
            paymentMethod:  n.paymentMethod,
            status:         n.status || "pending",
            createdAt:      n.submittedAt || n.createdAt,
          }));
      } catch { return []; }
    };

    // Always pull from Supabase so applications submitted while the backend
    // was down are still visible on any admin device.
    const supabaseApps = await getApplicationsSupabase();
    const supabaseMapped: Application[] = supabaseApps.map(a => ({
      id:             a.id,
      fullName:       a.fullName,
      email:          a.email,
      phone:          a.phone,
      telegramHandle: a.telegramHandle,
      address:        a.address,
      gender:         a.gender,
      nationality:    a.nationality,
      courseId:       a.courseSlug,
      course:         a.courseName,
      courseType:     a.courseType,
      paymentMethod:  a.paymentMethod,
      receiptUrl:     a.receiptUrl,
      status:         a.status === "new" ? "pending" : a.status,
      createdAt:      a.submittedAt,
      type:           "course",
    }));

    // Job applications from Supabase + localStorage
    const loadLocalJobs = (): Application[] => {
      try {
        const arr = JSON.parse(localStorage.getItem("adminJobNotifications") || "[]");
        return arr.map((n: any) => ({
          id:             n.id,
          fullName:       n.fullName,
          email:          n.email,
          phone:          n.phone,
          telegramHandle: n.telegramHandle,
          address:        n.address,
          gender:         n.gender,
          nationality:    n.nationality,
          courseId:       n.jobId,
          course:         n.jobTitle || n.job,
          company:        n.company,
          coverLetter:    n.coverLetter,
          status:         n.status || "pending",
          createdAt:      n.submittedAt || n.createdAt,
          type:           "job",
        }));
      } catch { return []; }
    };

    const localJobs = loadLocalJobs();
    const supabaseJobs = await getJobApplicationsSupabase();
    const supabaseJobMapped: Application[] = supabaseJobs.map(a => ({
      id:             a.id,
      fullName:       a.fullName,
      email:          a.email,
      phone:          a.phone,
      telegramHandle: a.telegramHandle,
      address:        a.address,
      gender:         a.gender,
      nationality:    a.nationality,
      courseId:       a.jobId,
      course:         a.jobTitle,
      company:        a.company,
      coverLetter:    a.coverLetter,
      status:         a.status === "new" ? "pending" : a.status,
      createdAt:      a.submittedAt,
      type:           "job",
    }));

    const mergeJobs = (base: Application[]): Application[] => {
      const merged: Application[] = [];
      const byId = new Map<string, Application>();
      // Merge course + job applications from backend, localStorage, AND
      // Supabase (course apps live in `applications`, job apps in
      // `job_applications`). Both must always appear so the admin sees a
      // complete list even when the backend returns nothing.
      //
      // Backend rows come first and win for the canonical identity, but they may
      // lack the payment fields (paymentMethod / receiptUrl) that were saved to
      // Supabase. So when the same id later appears from Supabase, overlay any
      // payment/receipt data onto the existing row instead of dropping it.
      for (const a of [...base, ...localJobs, ...supabaseMapped, ...supabaseJobMapped]) {
        const id = a.id || (a as any)._id || "";
        if (!id) continue;
        const existing = byId.get(id);
        if (!existing) {
          byId.set(id, a);
        } else if (a.type === "course") {
          byId.set(id, {
            ...existing,
            paymentMethod: existing.paymentMethod || a.paymentMethod || existing.payment,
            payment:       existing.payment       || a.payment,
            paymentReference: existing.paymentReference || a.paymentReference,
            receiptUrl:    existing.receiptUrl    || (a as any).receipt || a.receiptUrl,
            status:        existing.status        || a.status,
          });
        }
      }
      return Array.from(byId.values());
    };

    // Dedupe by id: primary list wins, extra Supabase entries are appended
    // (with payment/receipt data overlaid so they are never lost).
    const mergeSupabase = (list: Application[]): Application[] => {
      const merged: Application[] = [];
      const byId = new Map<string, Application>();
      for (const a of [...list, ...supabaseMapped, ...supabaseJobMapped]) {
        const id = a.id || (a as any)._id || "";
        if (!id) continue;
        const existing = byId.get(id);
        if (!existing) {
          byId.set(id, a);
        } else if (a.type === "course") {
          byId.set(id, {
            ...existing,
            paymentMethod: existing.paymentMethod || a.paymentMethod || existing.payment,
            payment:       existing.payment       || a.payment,
            paymentReference: existing.paymentReference || a.paymentReference,
            receiptUrl:    existing.receiptUrl    || (a as any).receipt || a.receiptUrl,
          });
        }
      }
      return Array.from(byId.values());
    };

    const applyAndSetApps = (list: Application[]) => {
      setApps(list);
      const courseList = ["All", ...Array.from(new Set(list.filter(a => getAppType(a) !== "job").map(a => getAppCourse(a)))).sort()];
      setCourses(courseList);
    };

    try {
      const response = await fetch(`${API}/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        const apiApps: Application[] = Array.isArray(data) ? data : data.data ?? [];

        // Only merge local entries that are truly offline (local- prefix, not yet synced to the API).
        // Never merge API-backed entries from localStorage — they carry stale status (always "pending")
        // and will override whatever the API just returned (e.g. "approved").
        const local = loadLocal();
        const apiIds = new Set(
          apiApps.flatMap(a => [a.id, (a as any)._id]).filter(Boolean)
        );
        const offlineOnly = local.filter(l => {
          const lid = l.id || (l as any)._id || "";
          return lid.startsWith("local-") && !apiIds.has(lid);
        });
        const merged = mergeJobs([...apiApps, ...offlineOnly]);
        applyAndSetApps(merged);
        if (merged.length > 0) {
          setSuccess(`Loaded ${merged.length} application${merged.length !== 1 ? "s" : ""}`);
        }
      } else if (response.status === 401 || response.status === 403) {
        applyAndSetApps(mergeJobs(loadLocal()));
      } else {
        const local = loadLocal();
        applyAndSetApps(mergeJobs(local));
        if (local.length > 0) {
          setError(`Showing ${local.length} locally stored submission${local.length !== 1 ? "s" : ""} (live data unavailable)`);
        }
      }
    } catch {
      applyAndSetApps(mergeJobs(loadLocal()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, []);

  const filtered = apps.filter(a => {
    const name   = a.fullName || a.name || "";
    const course = a.course || "";
    const email  = a.email || "";
    const status = normalizeStatus(a.status);
    const appCourse = getAppCourse(a);
    const matchStatus = statusFilter === "all" || status === statusFilter;
    const matchCourse = courseFilter === "All" || appCourse === courseFilter;
    const matchType   = typeFilter === "all" || (a.type || "course") === typeFilter;
    const matchSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      course.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      (a.company || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCourse && matchType && matchSearch;
  });

  const counts = {
    all:      apps.length,
    pending:  apps.filter(a => normalizeStatus(a.status) === "pending").length,
    approved: apps.filter(a => normalizeStatus(a.status) === "approved").length,
    rejected: apps.filter(a => normalizeStatus(a.status) === "rejected").length,
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (updating === id) return;
    setUpdating(id);
    setError("");
    setSuccess("");

    // Helper: update status in both localStorage arrays so refreshes don't revert
    const persistStatusToLocalStorage = (appId: string, status: string) => {
      ["pendingApplications", "adminNotifications"].forEach(key => {
        try {
          const arr = JSON.parse(localStorage.getItem(key) || "[]");
          const updated = arr.map((a: any) => (a.id || a._id) === appId ? { ...a, status } : a);
          localStorage.setItem(key, JSON.stringify(updated));
        } catch { /* ignore */ }
      });
    };

    if (id.startsWith("local-")) {
      const isJob = (selected && selected.type === "job");
      setApps(prev => prev.map(a => (a.id || a._id) === id ? { ...a, status: newStatus } : a));
      persistStatusToLocalStorage(id, newStatus);
      if (isJob) {
        updateJobApplicationSupabase(id, { status: newStatus });
      } else {
        updateApplicationSupabase(id, { status: newStatus });
      }
      setSelected(null);
      setSuccess(`Application ${newStatus} successfully`);
      setTimeout(() => setSuccess(""), 3000);
      setUpdating(null);
      return;
    }

    const token = sessionStorage.getItem("adminToken");
    try {
      const response = await fetch(`${API}/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`Failed to update status: ${response.status}`);
      setApps(prev => prev.map(a => (a.id || a._id) === id ? { ...a, status: newStatus } : a));
      persistStatusToLocalStorage(id, newStatus);
      updateApplicationSupabase(id, { status: newStatus });
      setSelected(null);
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
    setApps(prev => {
      const next = prev.filter(a => (a.id || a._id) !== id);
      const courseList = ["All", ...Array.from(new Set(next.filter(a => getAppType(a) !== "job").map(a => getAppCourse(a)))).sort()];
      setCourses(courseList);
      return next;
    });
    if (selected && (selected.id || selected._id) === id) setSelected(null);

    // Also remove from localStorage, otherwise the row comes back on refresh.
    try {
      ["pendingApplications", "adminNotifications"].forEach(key => {
        const arr = JSON.parse(localStorage.getItem(key) || "[]");
        const next = arr.filter((a: any) => (a.id || a._id) !== id);
        localStorage.setItem(key, JSON.stringify(next));
      });
      const jobArr = JSON.parse(localStorage.getItem("adminJobNotifications") || "[]");
      const nextJobs = jobArr.filter((a: any) => (a.id || a._id) !== id);
      localStorage.setItem("adminJobNotifications", JSON.stringify(nextJobs));
    } catch { /* ignore */ }

    const token = sessionStorage.getItem("adminToken");
    const isJob = (selected && selected.type === "job");
    if (isJob) {
      deleteJobApplicationSupabase(id);
      try {
        await fetch(`${API}/job-applications/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* silent */ }
    } else {
      deleteApplicationSupabase(id);
      try {
        await fetch(`${API}/applications/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* silent */ }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Applications" />
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Type</span>
          {(["all","course","job"] as AppType[]).map(t => {
            const count = t === "all" ? apps.length : apps.filter(a => (a.type || "course") === t).length;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 capitalize",
                  typeFilter === t
                    ? t === "job" ? "bg-[#F57C00] text-white border-[#F57C00] shadow-sm"
                    : "bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm"
                    : "bg-white text-gray-500 border-gray-200 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                )}
              >
                {t}
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                  typeFilter === t
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-400"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Course filter pills */}
        {typeFilter !== "job" && courses.length > 1 && (
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Course</span>
            {courses.map(c => {
              const count = c === "All"
                ? apps.length
                : apps.filter(a => getAppCourse(a) === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setCourseFilter(c)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5",
                    courseFilter === c
                      ? "bg-[#1E90FF] text-white border-[#1E90FF] shadow-sm"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                  )}
                >
                  {c}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                    courseFilter === c
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-400"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

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
          <span className="text-yellow-600">Pending: <strong>{filtered.filter(a => normalizeStatus(a.status) === "pending").length}</strong></span>
          <span className="text-emerald-600">Approved: <strong>{filtered.filter(a => normalizeStatus(a.status) === "approved").length}</strong></span>
          <span className="text-red-400">Rejected: <strong>{filtered.filter(a => normalizeStatus(a.status) === "rejected").length}</strong></span>
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
                    <th className="px-5 py-3 text-left font-semibold">Applicant</th>
                    <th className="px-5 py-3 text-left font-semibold">{typeFilter === "job" ? "Position" : "Course"}</th>
                    <th className="px-5 py-3 text-left font-semibold">Category</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((app, i) => {
                    const id     = app.id || app._id || String(i);
                    const name   = app.fullName || app.name || "—";
                    const email  = app.email || "—";
                    const course = app.course || (app.courseId && !app.courseId.includes("-") ? app.courseId : "") || "—";
                    const date   = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : app.date || "—";
                    const status = normalizeStatus(app.status);
                    const cat    = getAppCourse(app);

                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800 flex items-center gap-2">
                            {name}
                            <span className={cn(
                              "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide",
                              (app.type || "course") === "job"
                                ? "bg-[#F57C00]/10 text-[#F57C00]"
                                : "bg-blue-100 text-blue-600"
                            )}>
                              {app.type === "job" ? "Job" : "Course"}
                            </span>
                          </p>
                          <p className="text-[11px] text-gray-400">{email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[160px] truncate">
                          {course}
                          {app.company && (
                            <span className="block text-[10px] text-gray-400 truncate">{app.company}</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1E90FF]/10 text-[#1E90FF]">
                            {app.type === "job" ? (app.company || cat) : cat}
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
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
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
                  statusStyle[normalizeStatus(selected.status)] ?? "bg-gray-100 text-gray-500"
                )}>
                  {normalizeStatus(selected.status)}
                </span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#1E90FF]/10 text-[#1E90FF]"
                )}>
                  {getAppCourse(selected)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email",       value: selected.email },
                { label: "Phone",       value: selected.phone },
                { label: "Telegram",    value: selected.telegramHandle },
                { label: selected.type === "job" ? "Position" : "Course", value: selected.course || (selected.courseId && !selected.courseId.includes("-") ? selected.courseId : "") || selected.courseId },
                { label: "Company",     value: selected.company },
                { label: "Course Type", value: selected.courseType },
                { label: "Payment",     value: getPaymentMethod(selected) },
                { label: "Payment Ref", value: getPaymentRef(selected) },
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

            {selected.coverLetter && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Cover Letter</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border border-gray-100">{selected.coverLetter}</p>
              </div>
            )}

            {/* Payment details — always visible so the admin can confirm
                whether a payment method and proof picture were provided. */}
            {selected.type !== "job" && (
              <div className="rounded-xl border border-gray-100 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Payment Details</p>
                  {getReceiptUrl(selected) ? (
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Receipt uploaded</span>
                  ) : (
                    <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">No receipt</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Payment Method</p>
                    <p className="text-gray-700 font-medium text-xs mt-0.5">{getPaymentMethod(selected) || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Payment Ref</p>
                    <p className="text-gray-700 font-medium text-xs mt-0.5 break-all">{getPaymentRef(selected) || "Not provided"}</p>
                  </div>
                </div>

                {getReceiptUrl(selected) ? (
                  <a
                    href={getReceiptUrl(selected)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    title="Open full-size receipt"
                  >
                    <img
                      src={getReceiptUrl(selected)}
                      alt="Payment receipt"
                      className="w-full rounded-lg border border-gray-100 cursor-zoom-in"
                    />
                  </a>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 text-center py-4 text-[11px] text-gray-400">
                    No payment receipt uploaded for this application.
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {normalizeStatus(selected.status) !== "approved" && (
                <button
                  onClick={() => updateStatus(selected.id || selected._id || "", "approved")}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                  disabled={updating === (selected.id || selected._id)}
                >
                  {updating === (selected.id || selected._id) ? "Updating..." : "Approve"}
                </button>
              )}
              {normalizeStatus(selected.status) !== "rejected" && (
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

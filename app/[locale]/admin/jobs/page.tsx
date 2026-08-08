"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Briefcase, MapPin, Clock, RefreshCw, Eye, EyeOff } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";
import { jobsConfig, categoryColor, typeColor, isJobClosed, type Job } from "@/lib/jobs-config";
import { getStoredJobs, saveJobs } from "@/lib/jobs-store";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminJobsPage() {
  const [jobs,      setJobs]      = useState<Job[]>(() => {
    // Pre-populate from localStorage so the table isn't empty before the API responds
    const stored = getStoredJobs();
    return stored.length > 0 ? stored : jobsConfig;
  });
  const [loading,   setLoading]   = useState(false);
  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [search,    setSearch]    = useState("");
  const [statusTab, setStatusTab] = useState<"all" | "open" | "closed" | "draft">("all");

  const fetchJobs = () => {
    const token = sessionStorage.getItem("adminToken");
    setLoading(true);
    fetch(`${API}/jobs`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        const list: Job[] = Array.isArray(d) ? d : d.data ?? [];
        if (list.length > 0) {
          setJobs(list);
          saveJobs(list); // persist so public page stays in sync
        } else {
          // API returned empty — keep localStorage / static
          const stored = getStoredJobs();
          setJobs(stored.length > 0 ? stored : jobsConfig);
        }
      })
      .catch(() => {
        const stored = getStoredJobs();
        setJobs(stored.length > 0 ? stored : jobsConfig);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const toggleStatus = async (job: Job) => {
    const token = sessionStorage.getItem("adminToken");
    const newStatus = isJobClosed(job) ? "open" : "closed";
    try {
      await fetch(`${API}/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
    setJobs(prev => {
      const updated = prev.map(j => j.id === job.id ? { ...j, status: newStatus as any } : j);
      saveJobs(updated);
      return updated;
    });
  };

  const handleDelete = async (id: string) => {
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/jobs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
    setJobs(prev => {
      const updated = prev.filter(j => j.id !== id);
      saveJobs(updated);
      return updated;
    });
    setDeleteId(null);
  };

  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en";

  const filtered = jobs.filter(j => {
    const matchStatus = statusTab === "all" || j.status === statusTab ||
      (statusTab === "closed" && isJobClosed(j));
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all:    jobs.length,
    open:   jobs.filter(j => j.status === "open" && !isJobClosed(j)).length,
    closed: jobs.filter(j => isJobClosed(j)).length,
    draft:  jobs.filter(j => j.status === "draft").length,
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Job Announcements" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Jobs",   value: counts.all,    color: "text-[#1E90FF]",  bg: "bg-[#1E90FF]/10" },
            { label: "Open",         value: counts.open,   color: "text-emerald-500", bg: "bg-emerald-50"  },
            { label: "Closed",       value: counts.closed, color: "text-gray-400",   bg: "bg-gray-100"    },
            { label: "Draft",        value: counts.draft,  color: "text-[#F57C00]",  bg: "bg-[#F57C00]/10"},
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
                <Briefcase className={cn("h-5 w-5", color)} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Status tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["all","open","closed","draft"] as const).map(s => (
              <button key={s} onClick={() => setStatusTab(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  statusTab === s ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}>
                {s} ({counts[s]})
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {/* Search */}
            <div className="relative">
              <input
                type="search"
                placeholder="Search jobs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-3 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-44"
              />
            </div>
            {/* Refresh */}
            <button onClick={fetchJobs} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50" title="Refresh">
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
            {/* Add */}
            <button
              onClick={() => window.location.href = `/${locale}/admin/jobs/add`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E90FF] text-white text-xs font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              <Plus size={14} /> Add Job
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Loading jobs...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No jobs found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold">Position</th>
                    <th className="px-5 py-3 text-left font-semibold">Category</th>
                    <th className="px-5 py-3 text-left font-semibold">Type</th>
                    <th className="px-5 py-3 text-left font-semibold">Location</th>
                    <th className="px-5 py-3 text-left font-semibold">Deadline</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(job => {
                    const closed = isJobClosed(job);
                    return (
                      <tr key={job.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800 truncate max-w-[180px]">{job.title}</p>
                          <p className="text-[11px] text-[#1E90FF] mt-0.5">{job.company}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            categoryColor[job.category] ?? "bg-gray-100 text-gray-500"
                          )}>{job.category}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-semibold",
                            typeColor[job.type]
                          )}>{job.type}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin size={11}/>{job.location}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock size={11}/>
                            {job.deadline ? formatDate(job.deadline) : "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize",
                            closed           ? "bg-gray-100 text-gray-500" :
                            job.status === "open"  ? "bg-emerald-100 text-emerald-700" :
                            job.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-500"
                          )}>
                            {closed ? "closed" : job.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {/* Edit */}
                            <button
                              onClick={() => window.location.href = `/${locale}/admin/jobs/edit/${job.id}`}
                              className="p-1.5 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            {/* Toggle open/closed */}
                            <button
                              onClick={() => toggleStatus(job)}
                              className={cn("p-1.5 rounded-lg transition-colors",
                                closed
                                  ? "text-emerald-500 hover:bg-emerald-50"
                                  : "text-gray-400 hover:bg-gray-100"
                              )}
                              title={closed ? "Reopen" : "Close"}
                            >
                              {closed ? <Eye size={14}/> : <EyeOff size={14}/>}
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => setDeleteId(job.id)}
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
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Delete Job?</h3>
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

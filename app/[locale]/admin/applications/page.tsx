"use client";

import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

type Status = "all" | "pending" | "approved" | "rejected";

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

export default function ApplicationsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApps = () => {
    const token = sessionStorage.getItem("adminToken");
    setLoading(true);
    setError("");
    fetch(`${API}/applications/with-receipt`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then(data => setApps(Array.isArray(data) ? data : data.data ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchApps(); }, []);

  const filtered = apps.filter(a => {
    const name = a.fullName || a.name || "";
    const course = a.courseId || a.course || "";
    const email = a.email || "";
    const status = (a.status || "").toLowerCase();
    const matchStatus = statusFilter === "all" || status === statusFilter;
    const matchSearch = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      course.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all:      apps.length,
    pending:  apps.filter(a => (a.status || "").toLowerCase() === "pending").length,
    approved: apps.filter(a => (a.status || "").toLowerCase() === "approved").length,
    rejected: apps.filter(a => (a.status || "").toLowerCase() === "rejected").length,
  };

  const updateStatus = async (id: string, status: string) => {
    const token = sessionStorage.getItem("adminToken");
    try {
      await fetch(`${API}/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setApps(prev => prev.map(a => (a.id === id || a._id === id) ? { ...a, status } : a));
      if (selected && (selected.id === id || selected._id === id)) {
        setSelected((prev: any) => prev ? { ...prev, status } : null);
      }
    } catch {}
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Applications" />
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap items-center">
          {(["all","pending","approved","rejected"] as Status[]).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
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
              <input type="search" placeholder="Search applicants..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-52"
              />
            </div>
            <button onClick={fetchApps} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors" title="Refresh">
              <RefreshCw size={14} className={cn("text-gray-500", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            Failed to load applications: {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Loading real data...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <th className="px-5 py-3 text-left font-semibold">Student</th>
                    <th className="px-5 py-3 text-left font-semibold">Course</th>
                    <th className="px-5 py-3 text-left font-semibold">Payment</th>
                    <th className="px-5 py-3 text-left font-semibold">Date</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                    <th className="px-5 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((app, i) => {
                    const id = app.id || app._id || String(i);
                    const name = app.fullName || app.name || "—";
                    const email = app.email || "—";
                    const course = app.courseId || app.course || "—";
                    const payment = app.paymentMethod || app.payment || "—";
                    const date = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : app.date || "—";
                    const status = (app.status || "pending").toLowerCase();
                    return (
                      <tr key={id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800">{name}</p>
                          <p className="text-[11px] text-gray-400">{email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[160px] truncate">{course}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-full font-medium">{payment}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">{date}</td>
                        <td className="px-5 py-3.5">
                          <span className={cn("flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize", statusStyle[status] ?? "bg-gray-100 text-gray-500")}>
                            {statusIcon[status]}{status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => setSelected(app)} className="p-1.5 rounded-lg text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-colors" title="View">
                              <Eye size={14} />
                            </button>
                            {status !== "approved" && (
                              <button onClick={() => updateStatus(id, "approved")} className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors" title="Approve">
                                <CheckCircle size={14} />
                              </button>
                            )}
                            {status !== "rejected" && (
                              <button onClick={() => updateStatus(id, "rejected")} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors" title="Reject">
                                <XCircle size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm">No applications found</div>
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
                <h3 className="font-bold text-gray-800 text-lg">{selected.fullName || selected.name || "—"}</h3>
                <p className="text-xs text-gray-400">{selected.id || selected._id}</p>
              </div>
              <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize", statusStyle[(selected.status || "pending").toLowerCase()] ?? "bg-gray-100 text-gray-500")}>
                {selected.status || "pending"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email",          value: selected.email },
                { label: "Phone",          value: selected.phone },
                { label: "Telegram",       value: selected.telegramHandle },
                { label: "Course",         value: selected.courseId || selected.course },
                { label: "Payment",        value: selected.paymentMethod },
                { label: "Payment Ref",    value: selected.paymentReference },
                { label: "Gender",         value: selected.gender },
                { label: "Nationality",    value: selected.nationality },
                { label: "Address",        value: selected.address },
                { label: "Date",           value: selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : selected.date },
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
                <img src={selected.receiptUrl} alt="Receipt" className="w-full rounded-lg border border-gray-100 max-h-48 object-contain" />
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {(selected.status || "").toLowerCase() !== "approved" && (
                <button onClick={() => updateStatus(selected.id || selected._id, "approved")}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                  Approve
                </button>
              )}
              {(selected.status || "").toLowerCase() !== "rejected" && (
                <button onClick={() => updateStatus(selected.id || selected._id, "rejected")}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
                  Reject
                </button>
              )}
              <button onClick={() => setSelected(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

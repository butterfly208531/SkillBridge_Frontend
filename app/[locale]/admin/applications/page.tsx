"use client";

import { useEffect, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock, Download, Filter } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

const MOCK_APPLICATIONS = [
  { id: "APP-001", fullName: "Abebe Kebede",    email: "abebe@gmail.com",    phone: "+251911111111", course: "Full-Stack Development",    paymentMethod: "Telebirr", status: "pending",  date: "2025-08-01", telegramHandle: "@abebe_k"  },
  { id: "APP-002", fullName: "Tigist Haile",    email: "tigist@gmail.com",   phone: "+251922222222", course: "Odoo Functional ERP",        paymentMethod: "CBE",      status: "approved", date: "2025-08-01", telegramHandle: "@tigist_h" },
  { id: "APP-003", fullName: "Sara Mohammed",   email: "sara@gmail.com",     phone: "+251933333333", course: "AI & Machine Learning",      paymentMethod: "Telebirr", status: "approved", date: "2025-07-31", telegramHandle: "@sara_m"   },
  { id: "APP-004", fullName: "Yonas Tadesse",   email: "yonas@gmail.com",    phone: "+251944444444", course: "Python Programming",         paymentMethod: "BOA",      status: "pending",  date: "2025-07-31", telegramHandle: "@yonas_t"  },
  { id: "APP-005", fullName: "Hana Girma",      email: "hana@gmail.com",     phone: "+251955555555", course: "Data Science",               paymentMethod: "Cash",     status: "rejected", date: "2025-07-30", telegramHandle: "@hana_g"   },
  { id: "APP-006", fullName: "Michael Assefa",  email: "michael@gmail.com",  phone: "+251966666666", course: "n8n Automation",             paymentMethod: "Telebirr", status: "pending",  date: "2025-07-30", telegramHandle: "@michael_a"},
  { id: "APP-007", fullName: "Feven Alemu",     email: "feven@gmail.com",    phone: "+251977777777", course: "IELTS Preparation",          paymentMethod: "Awash",    status: "approved", date: "2025-07-29", telegramHandle: "@feven_a"  },
  { id: "APP-008", fullName: "Dawit Bekele",    email: "dawit@gmail.com",    phone: "+251988888888", course: "Odoo Technical Development", paymentMethod: "CBE",      status: "pending",  date: "2025-07-29", telegramHandle: "@dawit_b"  },
  { id: "APP-009", fullName: "Meron Hailu",     email: "meron@gmail.com",    phone: "+251999999999", course: "TOEFL Preparation",          paymentMethod: "Telebirr", status: "approved", date: "2025-07-28", telegramHandle: "@meron_h"  },
  { id: "APP-010", fullName: "Biruk Tesfaye",   email: "biruk@gmail.com",    phone: "+251900000000", course: "Duolingo Preparation",       paymentMethod: "Cash",     status: "rejected", date: "2025-07-28", telegramHandle: "@biruk_t"  },
];

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
  const [apps, setApps] = useState(MOCK_APPLICATIONS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [selected, setSelected] = useState<typeof MOCK_APPLICATIONS[0] | null>(null);
  const [loading, setLoading] = useState(false);

  // Try to load from API
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return;
    setLoading(true);
    fetch(`${API}/applications`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (Array.isArray(data) && data.length > 0) setApps(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = apps.filter(a => {
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchSearch = !search ||
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.course.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const updateStatus = (id: string, status: string) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const counts = {
    all:      apps.length,
    pending:  apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Applications" />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap">
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

          <div className="ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="search"
              placeholder="Search applicants..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-52"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-800">{app.fullName}</p>
                      <p className="text-[11px] text-gray-400">{app.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[160px] truncate">{app.course}</td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-full font-medium">{app.paymentMethod}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{app.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize", statusStyle[app.status])}>
                        {statusIcon[app.status]}{app.status}
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
                        {app.status !== "approved" && (
                          <button
                            onClick={() => updateStatus(app.id, "approved")}
                            className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                        {app.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus(app.id, "rejected")}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400 text-sm">No applications found</div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{selected.fullName}</h3>
                <p className="text-xs text-gray-400">{selected.id}</p>
              </div>
              <span className={cn("px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize", statusStyle[selected.status])}>
                {selected.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email",    value: selected.email },
                { label: "Phone",    value: selected.phone },
                { label: "Telegram", value: selected.telegramHandle },
                { label: "Course",   value: selected.course },
                { label: "Payment",  value: selected.paymentMethod },
                { label: "Date",     value: selected.date },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-gray-700 font-medium text-xs mt-0.5 break-all">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              {selected.status !== "approved" && (
                <button
                  onClick={() => updateStatus(selected.id, "approved")}
                  className="flex-1 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                  Approve
                </button>
              )}
              {selected.status !== "rejected" && (
                <button
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Reject
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
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Search, Users, Mail, Phone, RefreshCw } from "lucide-react";
import AdminHeader from "../components/AdminHeader";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = () => {
    const token = sessionStorage.getItem("adminToken");
    setLoading(true);
    setError("");
    fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (!r.ok) throw new Error(`Error ${r.status}`);
        return r.json();
      })
      .then(data => setStudents(Array.isArray(data) ? data : data.data ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const filtered = students.filter(s => {
    const name = s.name || s.fullName || "";
    const email = s.email || "";
    const course = s.course || s.courseId || "";
    return !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      course.toLowerCase().includes(search.toLowerCase());
  });

  const active   = students.filter(s => (s.status || "active").toLowerCase() === "active").length;
  const inactive = students.filter(s => (s.status || "").toLowerCase() === "inactive").length;

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Students" />
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Total Students", value: students.length, color: "text-[#1E90FF]",    bg: "bg-[#1E90FF]/10" },
            { label: "Active",         value: active,          color: "text-emerald-500",   bg: "bg-emerald-50"   },
            { label: "Inactive",       value: inactive,        color: "text-gray-400",      bg: "bg-gray-100"     },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                <Users className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Refresh */}
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input type="search" placeholder="Search students..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-full"
            />
          </div>
          <button onClick={fetchStudents} className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50" title="Refresh">
            <RefreshCw size={14} className={`text-gray-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            Failed to load students: {error}
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
                    <th className="px-5 py-3 text-left font-semibold">Contact</th>
                    <th className="px-5 py-3 text-left font-semibold">Enrolled</th>
                    <th className="px-5 py-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s, i) => {
                    const id = s.id || s._id || String(i);
                    const name = s.name || s.fullName || "—";
                    const email = s.email || "—";
                    const phone = s.phone || s.phoneNumber || "—";
                    const course = s.course || s.courseId || "—";
                    const enrolled = s.createdAt ? new Date(s.createdAt).toLocaleDateString() : s.enrolledAt || "—";
                    const status = (s.status || "active").toLowerCase();
                    return (
                      <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#F57C00] flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {name[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{name}</p>
                              <p className="text-[10px] text-gray-400 font-mono">{id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[160px] truncate">{course}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={11}/>{email}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone size={11}/>{phone}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-400">{enrolled}</td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm">No students found</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

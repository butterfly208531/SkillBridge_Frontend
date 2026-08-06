"use client";

import { useState } from "react";
import { Search, Users, Mail, Phone } from "lucide-react";
import AdminHeader from "../components/AdminHeader";

const MOCK_STUDENTS = [
  { id: "STU-001", name: "Abebe Kebede",   email: "abebe@gmail.com",   phone: "+251911111111", course: "Full-Stack Development",   enrolled: "2025-08-01", status: "active" },
  { id: "STU-002", name: "Tigist Haile",   email: "tigist@gmail.com",  phone: "+251922222222", course: "Odoo Functional ERP",       enrolled: "2025-08-01", status: "active" },
  { id: "STU-003", name: "Sara Mohammed",  email: "sara@gmail.com",    phone: "+251933333333", course: "AI & Machine Learning",     enrolled: "2025-07-31", status: "active" },
  { id: "STU-004", name: "Yonas Tadesse",  email: "yonas@gmail.com",   phone: "+251944444444", course: "Python Programming",        enrolled: "2025-07-31", status: "active" },
  { id: "STU-005", name: "Hana Girma",     email: "hana@gmail.com",    phone: "+251955555555", course: "Data Science",              enrolled: "2025-07-30", status: "inactive" },
  { id: "STU-006", name: "Michael Assefa", email: "michael@gmail.com", phone: "+251966666666", course: "n8n Automation",            enrolled: "2025-07-30", status: "active" },
  { id: "STU-007", name: "Feven Alemu",    email: "feven@gmail.com",   phone: "+251977777777", course: "IELTS Preparation",         enrolled: "2025-07-29", status: "active" },
  { id: "STU-008", name: "Dawit Bekele",   email: "dawit@gmail.com",   phone: "+251988888888", course: "Odoo Technical Development",enrolled: "2025-07-29", status: "active" },
];

export default function StudentsPage() {
  const [search, setSearch] = useState("");

  const filtered = MOCK_STUDENTS.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.course.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Students" />
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Total Students", value: MOCK_STUDENTS.length,                                       color: "text-[#1E90FF]", bg: "bg-[#1E90FF]/10" },
            { label: "Active",         value: MOCK_STUDENTS.filter(s => s.status === "active").length,    color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Inactive",       value: MOCK_STUDENTS.filter(s => s.status === "inactive").length,  color: "text-gray-400", bg: "bg-gray-100" },
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

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="search"
            placeholder="Search students..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 w-full"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
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
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#F57C00] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {s.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{s.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{s.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[160px] truncate">{s.course}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={11}/>{s.email}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Phone size={11}/>{s.phone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">{s.enrolled}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${s.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

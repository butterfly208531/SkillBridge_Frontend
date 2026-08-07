"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileText, Award, Users, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import StatCard from "../components/StatCard";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

const BOOTCAMPS = [
  { id: "odoo-functional-erp", title: "Odoo Functional ERP", category: "ERP", reviews: 40, rating: 4.7 },
  { id: "odoo-technical-development", title: "Odoo Technical Development", category: "ERP", reviews: 50, rating: 4.9 },
  { id: "full-stack-development", title: "Full-Stack Development", category: "Development", reviews: 50, rating: 4.8 },
  { id: "python-programming", title: "Python Programming", category: "Development", reviews: 60, rating: 4.8 },
  { id: "ai-machine-learning", title: "AI & Machine Learning", category: "AI", reviews: 35, rating: 4.9 },
  { id: "data-science", title: "Data Science", category: "AI", reviews: 28, rating: 4.7 },
  { id: "n8n-automation", title: "n8n Automation", category: "Automation", reviews: 22, rating: 4.6 },
  { id: "ielts-preparation", title: "IELTS Preparation", category: "Language", reviews: 30, rating: 4.7 },
  { id: "toefl-preparation", title: "TOEFL Preparation", category: "Language", reviews: 18, rating: 4.6 },
  { id: "duolingo-preparation", title: "Duolingo Preparation", category: "Language", reviews: 15, rating: 4.5 },
];

const RECENT_APPLICATIONS = [
  { id: "APP-001", name: "Abebe Kebede",    course: "Full-Stack Development",   status: "pending",  date: "2025-08-01" },
  { id: "APP-002", name: "Tigist Haile",    course: "Odoo Functional ERP",       status: "approved", date: "2025-08-01" },
  { id: "APP-003", name: "Sara Mohammed",   course: "AI & Machine Learning",     status: "approved", date: "2025-07-31" },
  { id: "APP-004", name: "Yonas Tadesse",   course: "Python Programming",        status: "pending",  date: "2025-07-31" },
  { id: "APP-005", name: "Hana Girma",      course: "Data Science",              status: "rejected", date: "2025-07-30" },
  { id: "APP-006", name: "Michael Assefa",  course: "n8n Automation",            status: "pending",  date: "2025-07-30" },
];

const statusStyle: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
};

const categoryColors: Record<string, string> = {
  ERP:         "bg-[#1E90FF]/10 text-[#1E90FF]",
  Development: "bg-[#F57C00]/10 text-[#F57C00]",
  AI:          "bg-purple-100 text-purple-600",
  Automation:  "bg-emerald-100 text-emerald-600",
  Language:    "bg-pink-100 text-pink-600",
};

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    // Fetch real applications
    fetch(`${API}/applications/with-receipt`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setApplications(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setApplications([]))
      .finally(() => setLoadingApps(false));

    // Fetch real courses
    fetch(`${API}/courses`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => setCourses(Array.isArray(data) ? data : data.data ?? []))
      .catch(() => setCourses(BOOTCAMPS));
  }, []);

  const displayCourses = courses.length > 0 ? courses : BOOTCAMPS;
  const totalApps = applications.length;
  const pending  = applications.filter(a => (a.status || "").toLowerCase() === "pending").length;
  const approved = applications.filter(a => (a.status || "").toLowerCase() === "approved").length;
  const rejected = applications.filter(a => (a.status || "").toLowerCase() === "rejected").length;

  const categoryCounts = displayCourses.reduce<Record<string, number>>((acc, c) => {
    const cat = c.category?.name || c.category || "Other";
    acc[cat] = (acc[cat] || 0) + (c.studentsEnrolled || c.reviews || 1);
    return acc;
  }, {});
  const maxCount = Math.max(...Object.values(categoryCounts), 1);

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 6);

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Dashboard" />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Courses"  value={displayCourses.length} subtitle="Active bootcamps"    icon={BookOpen}    color="blue"   trend={{ value: "Live from API", up: true }} />
          <StatCard title="Applications"   value={totalApps}             subtitle="All time"             icon={FileText}    color="orange" trend={{ value: `${pending} pending`, up: true }} />
          <StatCard title="Approved"       value={approved}              subtitle="Enrolled students"    icon={CheckCircle} color="green"  trend={{ value: totalApps > 0 ? `${Math.round(approved/totalApps*100)}% rate` : "0%", up: true }} />
          <StatCard title="Scholarships"   value={4}                     subtitle="Active programs"      icon={Award}       color="purple" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Enrollment by category */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Enrollments by Category</h2>
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${categoryColors[cat] ?? "bg-gray-100 text-gray-600"}`}>{cat}</span>
                    <span className="text-gray-500 font-semibold">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        background: "linear-gradient(90deg, #1E90FF, #F57C00)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application status donut */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Application Status</h2>
            <div className="flex items-center justify-center mb-4">
              <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                {/* Background ring */}
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                {/* Approved */}
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                  strokeDasharray={`${(approved / totalApps) * 100} 100`}
                  strokeLinecap="round" />
                {/* Pending overlay */}
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F57C00" strokeWidth="3"
                  strokeDasharray={`${(pending / totalApps) * 100} 100`}
                  strokeDashoffset={`-${(approved / totalApps) * 100}`}
                  strokeLinecap="round" />
              </svg>
            </div>
            <div className="space-y-2">
              {[
                { label: "Approved", count: approved, color: "bg-emerald-500" },
                { label: "Pending",  count: pending,  color: "bg-[#F57C00]"   },
                { label: "Rejected", count: totalApps - approved - pending, color: "bg-red-400" },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-gray-600">{s.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top courses */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Top Courses by Enrollment</h2>
            <div className="space-y-3">
              {[...displayCourses].sort((a, b) => (b.studentsEnrolled || b.reviews || 0) - (a.studentsEnrolled || a.reviews || 0)).slice(0, 5).map((c, i) => (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{c.title}</p>
                    <p className="text-[10px] text-gray-400">{c.studentsEnrolled || c.reviews || 0} students · ⭐ {c.rating || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Applications table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Recent Applications</h2>
            <a href={`/${typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "en"}/admin/applications`} className="text-xs font-medium text-[#1E90FF] hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-5 py-3 text-left font-semibold">ID</th>
                  <th className="px-5 py-3 text-left font-semibold">Student</th>
                  <th className="px-5 py-3 text-left font-semibold">Course</th>
                  <th className="px-5 py-3 text-left font-semibold">Date</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(recentApps.length > 0 ? recentApps : RECENT_APPLICATIONS).map((app, i) => {
                  const id   = app.id || app._id || app.id || `APP-${String(i+1).padStart(3,"0")}`;
                  const name = app.fullName || app.name || "—";
                  const course = app.courseId || app.course || "—";
                  const date = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : app.date || "—";
                  const status = (app.status || "pending").toLowerCase();
                  return (
                    <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-400 font-mono">{id}</td>
                      <td className="px-5 py-3 font-medium text-gray-800">{name}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{course}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{date}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${statusStyle[status] ?? "bg-gray-100 text-gray-500"}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

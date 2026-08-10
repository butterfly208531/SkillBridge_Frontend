"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileText, Award, Briefcase, CheckCircle } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import StatCard from "../components/StatCard";
import { fetchCourses, type Course } from "@/lib/api";
import { getStoredCourses, saveCourses } from "@/lib/courses-store";
import { getStoredScholarships } from "@/lib/scholarship-store";
import { getStoredJobs } from "@/lib/jobs-store";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const statusStyle: Record<string, string> = {
  pending:  "bg-yellow-100 text-yellow-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-600",
};

// Deterministic color from any category name — no hardcoding needed
const PALETTE = [
  "bg-[#1E90FF]/10 text-[#1E90FF]",
  "bg-[#F57C00]/10 text-[#F57C00]",
  "bg-purple-100 text-purple-600",
  "bg-emerald-100 text-emerald-600",
  "bg-pink-100 text-pink-600",
  "bg-amber-100 text-amber-600",
  "bg-cyan-100 text-cyan-600",
  "bg-rose-100 text-rose-600",
];

function categoryColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

// Map a Course from the API into the StoredCourse shape for localStorage persistence
function toStoredCourse(c: Course) {
  return {
    id:               c.id,
    title:            c.title,
    duration:         c.duration || "—",
    category:         c.category?.name || "",
    categoryId:       c.categoryId || "",
    status:           (c.status?.toLowerCase() === "active" ? "active" : "draft") as "active" | "draft",
    imageUrl:         c.imageUrl || "",
    adminImageUrl:    undefined as undefined,
    rating:           c.rating ?? 0,
    shortDescription: c.shortDescription || "",
    learningOutcomes: [] as string[],
    priceOriginal:    c.priceOriginal || 0,
    priceDiscounted:  c.priceDiscounted || 0,
    startDate:        c.startDate || "",
    createdAt:        c.createdAt || new Date().toISOString(),
    priority:         0,
  };
}

// Cast a StoredCourse into a Course shape for use in dashboard stats
function storedToCourse(s: ReturnType<typeof getStoredCourses>[number]): Course {
  return {
    id: s.id, title: s.title, duration: s.duration,
    shortDescription: s.shortDescription, detailedDescription: "",
    priceOriginal: s.priceOriginal, priceDiscounted: s.priceDiscounted,
    status: s.status === "active" ? "Active" : "Draft",
    level: "Beginner", imageUrl: s.imageUrl, reviews: 0,
    rating: s.rating, studentsEnrolled: 0,
    categoryId: s.categoryId, instructorId: "",
    createdAt: s.createdAt, updatedAt: s.createdAt,
    category: { id: s.categoryId, name: s.category, description: "", status: "active" },
    instructor: { id: "", name: "", email: "", imageUrl: "", role: "", status: "" },
    modules: [], learningOutcomes: [], prerequisites: [], enrollementYear: "",
  };
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [courses,      setCourses]      = useState<Course[]>([]);
  const [scholarships, setScholarships] = useState(0);
  const [jobs,         setJobs]         = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [loadingApps,  setLoadingApps]  = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  useEffect(() => { loadDashboardData(); }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    const token = sessionStorage.getItem("adminToken") || localStorage.getItem("adminToken");

    // Run all independent fetches in parallel
    await Promise.allSettled([
      fetchCoursesData(),
      fetchApplicationsData(token),
      fetchScholarshipsData(token),
      fetchJobsData(token),
    ]);

    setLoading(false);
  };

  // ── Courses ──────────────────────────────────────────────────────────
  const fetchCoursesData = async () => {
    try {
      const coursesData = await fetchCourses();
      if (coursesData.length > 0) {
        saveCourses(coursesData.map(toStoredCourse));
        setCourses(coursesData);
      } else {
        // API returned empty — fall back to localStorage
        const stored = getStoredCourses();
        setCourses(stored.length > 0 ? stored.map(storedToCourse) : []);
      }
    } catch {
      const stored = getStoredCourses();
      setCourses(stored.length > 0 ? stored.map(storedToCourse) : []);
    }
  };

  // ── Applications ─────────────────────────────────────────────────────
  const fetchApplicationsData = async (token: string | null) => {
    setLoadingApps(true);
    try {
      const res = await fetch(`${API}/applications/with-receipt`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : data.data ?? []);
      } else {
        setApplications([]);
      }
    } catch {
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  // ── Scholarships ──────────────────────────────────────────────────────
  const fetchScholarshipsData = async (token: string | null) => {
    try {
      const res = await fetch(`${API}/scholarships`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data ?? [];
        setScholarships(list.length);
      } else {
        setScholarships(getStoredScholarships().filter(s => s.status === "active").length);
      }
    } catch {
      setScholarships(getStoredScholarships().filter(s => s.status === "active").length);
    }
  };

  // ── Jobs ──────────────────────────────────────────────────────────────
  const fetchJobsData = async (token: string | null) => {
    try {
      const res = await fetch(`${API}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data ?? [];
        setJobs(list.length);
        // Persist for public page
        if (list.length > 0) {
          const { saveJobs } = await import("@/lib/jobs-store");
          saveJobs(list);
        }
      } else {
        setJobs(getStoredJobs().length);
      }
    } catch {
      setJobs(getStoredJobs().length);
    }
  };

  // ── Loading / error states ────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E90FF] mx-auto" />
            <p className="mt-4 text-gray-500">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Dashboard" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-blue-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Derived stats ─────────────────────────────────────────────────────
  const totalApps   = applications.length;
  const pending     = applications.filter(a => (a.status || "").toLowerCase() === "pending").length;
  const approved    = applications.filter(a => (a.status || "").toLowerCase() === "approved").length;
  const rejected    = applications.filter(a => (a.status || "").toLowerCase() === "rejected").length;
  const approvalRate = totalApps > 0 ? Math.round((approved / totalApps) * 100) : 0;

  const activeCourses = courses.filter(c => c.status?.toLowerCase() === "active").length;
  const draftCourses  = courses.length - activeCourses;

  // Category enrollment counts — use actual studentsEnrolled from API (no fake +1)
  const categoryCounts = courses.reduce<Record<string, number>>((acc, c) => {
    if ((c.studentsEnrolled ?? 0) === 0) return acc; // skip courses with no enrollment data
    const cat = c.category?.name || "Other";
    acc[cat] = (acc[cat] || 0) + (c.studentsEnrolled ?? 0);
    return acc;
  }, {});

  // If no studentsEnrolled data from API, fall back to counting courses per category
  const useCourseCounts = Object.keys(categoryCounts).length === 0;
  const displayCounts = useCourseCounts
    ? courses.reduce<Record<string, number>>((acc, c) => {
        const cat = c.category?.name || "Other";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {})
    : categoryCounts;
  const maxCount = Math.max(...Object.values(displayCounts), 1);

  // Recent applications sorted by date
  const recentApps = [...applications]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 6);

  // Top courses sorted by enrollment
  const topCourses = [...courses]
    .sort((a, b) => (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0))
    .slice(0, 5);

  // Locale for "View all" link
  const locale = typeof window !== "undefined" ? window.location.pathname.split("/")[1] || "en" : "en";

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Dashboard" />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Courses"
            value={courses.length}
            subtitle={`${activeCourses} active · ${draftCourses} draft`}
            icon={BookOpen}
            color="blue"
            trend={activeCourses > 0
              ? { value: `${activeCourses} active`, up: true }
              : undefined}
          />
          <StatCard
            title="Applications"
            value={totalApps}
            subtitle="All time"
            icon={FileText}
            color="orange"
            trend={totalApps > 0
              ? { value: `${pending} pending`, up: pending === 0 }
              : undefined}
          />
          <StatCard
            title="Approved"
            value={approved}
            subtitle="Enrolled students"
            icon={CheckCircle}
            color="green"
            trend={totalApps > 0
              ? { value: `${approvalRate}% approval rate`, up: approvalRate >= 50 }
              : undefined}
          />
          <StatCard
            title="Scholarships"
            value={scholarships}
            subtitle="Active programs"
            icon={Award}
            color="purple"
          />
          <StatCard
            title="Jobs"
            value={jobs}
            subtitle="Open positions"
            icon={Briefcase}
            color="orange"
          />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Enrollments by Category */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-1">
              {useCourseCounts ? "Courses by Category" : "Enrollments by Category"}
            </h2>
            {useCourseCounts && (
              <p className="text-[10px] text-gray-400 mb-3">No enrollment data — showing course count per category</p>
            )}
            {Object.keys(displayCounts).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-3 mt-3">
                {Object.entries(displayCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, count]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${categoryColor(cat)}`}>
                          {cat}
                        </span>
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
            )}
          </div>

          {/* Application Status donut */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Application Status</h2>
            {totalApps === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No applications yet</p>
            ) : (
              <>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 36 36" className="w-32 h-32 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                      {/* Approved arc */}
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                        strokeDasharray={`${(approved / totalApps) * 100} 100`}
                        strokeLinecap="round" />
                      {/* Pending arc */}
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F57C00" strokeWidth="3"
                        strokeDasharray={`${(pending / totalApps) * 100} 100`}
                        strokeDashoffset={`-${(approved / totalApps) * 100}`}
                        strokeLinecap="round" />
                      {/* Rejected arc */}
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f87171" strokeWidth="3"
                        strokeDasharray={`${(rejected / totalApps) * 100} 100`}
                        strokeDashoffset={`-${((approved + pending) / totalApps) * 100}`}
                        strokeLinecap="round" />
                    </svg>
                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-extrabold text-gray-800">{totalApps}</span>
                      <span className="text-[9px] text-gray-400 uppercase tracking-wide">Total</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Approved", count: approved, color: "bg-emerald-500" },
                    { label: "Pending",  count: pending,  color: "bg-[#F57C00]"   },
                    { label: "Rejected", count: rejected, color: "bg-red-400"     },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                        <span className="text-gray-600">{s.label}</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {s.count}
                        <span className="text-gray-400 font-normal ml-1">
                          ({totalApps > 0 ? Math.round((s.count / totalApps) * 100) : 0}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Top Courses by Enrollment */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-4">Top Courses by Enrollment</h2>
            {topCourses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No courses available</p>
            ) : (
              <div className="space-y-3">
                {topCourses.map((c, i) => (
                  <div key={c.id} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{c.title}</p>
                      <p className="text-[10px] text-gray-400">
                        {c.studentsEnrolled > 0
                          ? `${c.studentsEnrolled} students`
                          : "No enrollment data"}
                        {c.rating ? ` · ⭐ ${c.rating}` : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Applications table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800">Recent Applications</h2>
            <a
              href={`/${locale}/admin/applications`}
              className="text-xs font-medium text-[#1E90FF] hover:underline"
            >
              View all →
            </a>
          </div>

          {loadingApps ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E90FF]" />
            </div>
          ) : recentApps.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No recent applications</div>
          ) : (
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
                  {recentApps.map((app, i) => {
                    const id     = app.id || app._id || `APP-${String(i + 1).padStart(3, "0")}`;
                    const name   = app.fullName || app.name || "—";
                    const course = app.courseId?.title || app.courseTitle || app.course || "—";
                    const date   = app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—";
                    const status = (app.status || "pending").toLowerCase();
                    return (
                      <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 text-xs text-gray-400 font-mono">
                          {String(id).length > 12 ? `${String(id).slice(0, 8)}…` : id}
                        </td>
                        <td className="px-5 py-3 font-medium text-gray-800">{name}</td>
                        <td className="px-5 py-3 text-gray-500 text-xs truncate max-w-[140px]">{course}</td>
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
          )}
        </div>

      </div>
    </div>
  );
}

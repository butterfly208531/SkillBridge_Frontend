"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowLeft, CheckCircle, Loader2, Link2, Award,
  Users, Calendar, FileText, Settings
} from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { cn } from "@/lib/utils";
import { getStoredScholarships, saveScholarships, type StoredScholarship } from "@/lib/scholarship-store";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const TABS = ["Basic Info", "Funding", "Form Link", "Review"] as const;
type Tab = typeof TABS[number];

const TAB_ICONS = {
  "Basic Info": FileText,
  "Funding":    Award,
  "Form Link":  Link2,
  "Review":     Settings,
};

export default function AddScholarshipPage() {
  const pathname = usePathname();
  const locale   = pathname.split("/")[1] || "en";

  const [tab,     setTab]     = useState<Tab>("Basic Info");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    name:               "",
    course:             "",
    courseId:           "",
    eligibility:        "",
    deadline:           "",
    winnersCount:       1,
    status:             "active",
    fundingType:        "full" as "full" | "half",
    tuitionAmount:      "",
    applicationFormUrl: "",
    description:        "",
  });

  const set = (field: keyof typeof form, value: any) =>
    setForm(p => ({ ...p, [field]: value }));

  const tabIndex    = TABS.indexOf(tab);
  const isComplete  = (t: Tab) => TABS.indexOf(t) < tabIndex;

  // ── Derived values ──────────────────────────────────────────────
  const tuition    = Number(form.tuitionAmount) || 0;
  const studentPay = form.fundingType === "full" ? 0 : Math.round(tuition * 0.5);

  // ── Submit ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    const token = sessionStorage.getItem("adminToken");

    const payload = {
      name:               form.name,
      course:             form.course,
      courseId:           form.courseId || form.course.toLowerCase().replace(/\s+/g, "-"),
      eligibility:        form.eligibility,
      deadline:           form.deadline,
      winnersCount:       Number(form.winnersCount),
      status:             form.status,
      fundingType:        form.fundingType,
      tuitionAmount:      tuition,
      applicationFormUrl: form.applicationFormUrl || "",
      description:        form.description,
    };

    // Build a properly-shaped StoredScholarship so the public page can read every
    // field immediately, even before the API responds.
    const newStored: StoredScholarship = {
      id:                 `sch-${Date.now()}`,
      name:               payload.name,
      courseId:           payload.courseId,
      course:             payload.course,
      applicationsCount:  0,
      winnersCount:       payload.winnersCount,
      deadline:           payload.deadline,
      eligibility:        payload.eligibility,
      status:             payload.status,
      fundingType:        payload.fundingType,
      tuitionAmount:      payload.tuitionAmount,
      applicationFormUrl: payload.applicationFormUrl,
    };

    // Persist to localStorage immediately so admin list + public page update
    // without waiting for the API or a page-reload.
    const existing = getStoredScholarships();
    saveScholarships([...existing, newStored]);

    try {
      const res = await fetch(`${API}/scholarships`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        // If the API returned the saved record (with a real server-side ID),
        // replace the optimistic entry so IDs stay consistent.
        const saved = await res.json().catch(() => null);
        const serverRecord = saved?.data ?? saved;
        if (serverRecord?.id || serverRecord?._id) {
          const withServerId: StoredScholarship = {
            ...newStored,
            id: serverRecord.id || serverRecord._id,
          };
          const refreshed = getStoredScholarships();
          saveScholarships(
            refreshed.map(s => s.id === newStored.id ? withServerId : s)
          );
        }
      }
    } catch {
      // API unavailable — localStorage write above is enough for same-browser sync.
    }

    setSaving(false);
    setSuccess(true);
    setTimeout(() => { window.location.href = `/${locale}/admin/scholarships`; }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Add New Scholarship" />

      <div className="flex-1 p-6 overflow-y-auto">

        {/* Back + heading */}
        <div className="mb-6">
          <button
            onClick={() => window.location.href = `/${locale}/admin/scholarships`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Scholarships
          </button>
          <h1 className="text-xl font-bold text-gray-800">Add New Scholarship</h1>
          <p className="text-xs text-[#1E90FF] mt-0.5">Create a new scholarship program for the platform</p>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map((t, i) => {
            const Icon = TAB_ICONS[t];
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap",
                  tab === t
                    ? "border-[#1E90FF] text-[#1E90FF]"
                    : isComplete(t)
                    ? "border-transparent text-[#2196F3]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                {isComplete(t)
                  ? <CheckCircle size={14} className="text-[#2196F3]" />
                  : <Icon size={14} />
                }
                {t}
              </button>
            );
          })}
        </div>

        {/* ── BASIC INFO ── */}
        {tab === "Basic Info" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Basic Information</h2>
              <p className="text-xs text-gray-400">Enter the scholarship name, course, and eligibility details</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Scholarship Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Full-Stack Development Scholarship"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Course Name *</label>
                <input
                  type="text"
                  value={form.course}
                  onChange={e => set("course", e.target.value)}
                  placeholder="e.g. Full-Stack Development"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => set("status", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                >
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Eligibility Requirements *</label>
              <textarea
                rows={3}
                value={form.eligibility}
                onChange={e => set("eligibility", e.target.value)}
                placeholder="e.g. Top performer in Python and Web Development courses, demonstrated financial need"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => set("description", e.target.value)}
                placeholder="Brief description of the scholarship program..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Application Deadline *</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => set("deadline", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Number of Winners</label>
                <input
                  type="number"
                  min={1}
                  value={form.winnersCount}
                  onChange={e => set("winnersCount", Number(e.target.value))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTab("Funding")}
                disabled={!form.name || !form.course || !form.eligibility || !form.deadline}
                className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next: Funding →
              </button>
            </div>
          </div>
        )}

        {/* ── FUNDING ── */}
        {tab === "Funding" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Funding Details</h2>
              <p className="text-xs text-gray-400">Set the funding type and tuition amount</p>
            </div>

            {/* Funding type cards */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-3">Funding Type *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(["full", "half"] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => set("fundingType", type)}
                    className={cn(
                      "flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                      form.fundingType === type
                        ? type === "full"
                          ? "border-[#1E90FF] bg-[#1E90FF]/5"
                          : "border-[#F57C00] bg-[#F57C00]/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        form.fundingType === type
                          ? type === "full" ? "border-[#1E90FF]" : "border-[#F57C00]"
                          : "border-gray-300"
                      )}>
                        {form.fundingType === type && (
                          <div className={cn("w-2 h-2 rounded-full", type === "full" ? "bg-[#1E90FF]" : "bg-[#F57C00]")} />
                        )}
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        form.fundingType === type
                          ? type === "full" ? "text-[#1E90FF]" : "text-[#F57C00]"
                          : "text-gray-700"
                      )}>
                        {type === "full" ? "Fully Funded" : "Half Funded"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {type === "full"
                        ? "Covers 100% of tuition. Student pays $0."
                        : "Covers 50% of tuition. Student pays the remaining 50%."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tuition amount */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Course Tuition Amount (Birr) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">ETB</span>
                <input
                  type="number"
                  min={0}
                  value={form.tuitionAmount}
                  onChange={e => set("tuitionAmount", e.target.value)}
                  placeholder="500"
                  className="w-full pl-12 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
            </div>

            {/* Live preview */}
            {tuition > 0 && (
              <div className={cn(
                "rounded-xl p-4 border",
                form.fundingType === "full"
                  ? "bg-[#1E90FF]/5 border-[#1E90FF]/20"
                  : "bg-[#F57C00]/5 border-[#F57C00]/20"
              )}>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Tuition Preview</p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-0.5">Original Tuition</p>
                    <p className="text-lg font-black text-gray-700">ETB {tuition}</p>
                  </div>
                  <div className="text-2xl text-gray-300">→</div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-0.5">Student Pays</p>
                    <p className={cn(
                      "text-lg font-black",
                      form.fundingType === "full" ? "text-[#1E90FF]" : "text-[#F57C00]"
                    )}>
                      {form.fundingType === "full" ? "ETB 0" : `ETB ${studentPay}`}
                    </p>
                  </div>
                  {form.fundingType === "half" && (
                    <>
                      <div className="text-2xl text-gray-300">·</div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-0.5">Savings</p>
                        <p className="text-lg font-black text-[#1E90FF]">ETB {Math.round(tuition * 0.5)}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Basic Info")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                ← Back
              </button>
              <button
                onClick={() => setTab("Form Link")}
                disabled={!form.tuitionAmount}
                className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next: Form Link →
              </button>
            </div>
          </div>
        )}

        {/* ── FORM LINK ── */}
        {tab === "Form Link" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Application Form Link</h2>
              <p className="text-xs text-gray-400">Set where students should apply — external form or default course form</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => set("applicationFormUrl", "")}
                className={cn(
                  "flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                  !form.applicationFormUrl
                    ? "border-[#1E90FF] bg-[#1E90FF]/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    !form.applicationFormUrl ? "border-[#1E90FF]" : "border-gray-300"
                  )}>
                    {!form.applicationFormUrl && <div className="w-2 h-2 rounded-full bg-[#1E90FF]" />}
                  </div>
                  <span className={cn("text-sm font-bold", !form.applicationFormUrl ? "text-[#1E90FF]" : "text-gray-700")}>
                    Default Course Form
                  </span>
                </div>
                <p className="text-xs text-gray-500">Use the built-in application form for the course</p>
              </button>

              <button
                onClick={() => { if (!form.applicationFormUrl) set("applicationFormUrl", "https://"); }}
                className={cn(
                  "flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                  form.applicationFormUrl
                    ? "border-[#F57C00] bg-[#F57C00]/5"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    form.applicationFormUrl ? "border-[#F57C00]" : "border-gray-300"
                  )}>
                    {form.applicationFormUrl && <div className="w-2 h-2 rounded-full bg-[#F57C00]" />}
                  </div>
                  <span className={cn("text-sm font-bold", form.applicationFormUrl ? "text-[#F57C00]" : "text-gray-700")}>
                    Custom External Link
                  </span>
                </div>
                <p className="text-xs text-gray-500">Google Forms, Typeform, or any custom URL</p>
              </button>
            </div>

            {/* URL input — shown when external selected */}
            {form.applicationFormUrl !== "" && (
              <div className="bg-[#F57C00]/5 border border-[#F57C00]/20 rounded-xl p-4 space-y-2">
                <label className="block text-xs font-semibold text-[#F57C00] mb-1">
                  🔗 Application Form URL
                </label>
                <input
                  type="url"
                  value={form.applicationFormUrl}
                  onChange={e => set("applicationFormUrl", e.target.value)}
                  placeholder="https://forms.google.com/..."
                  className="w-full px-3 py-2.5 text-sm border border-[#F57C00]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F57C00]/30 bg-white"
                />
                <p className="text-[11px] text-gray-400">
                  Students will be taken to this URL when they click "Apply Now"
                </p>
              </div>
            )}

            {/* Preview */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Apply Now button will link to:</p>
              <p className="text-sm font-mono text-[#1E90FF] break-all">
                {form.applicationFormUrl || `/courses/${form.courseId || form.course.toLowerCase().replace(/\s+/g, "-")}/ApplicationForm`}
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Funding")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                ← Back
              </button>
              <button
                onClick={() => setTab("Review")}
                className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors"
              >
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* ── REVIEW ── */}
        {tab === "Review" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Review & Submit</h2>
              <p className="text-xs text-gray-400">Check all details before creating the scholarship</p>
            </div>

            {/* Summary grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: "Scholarship Name", value: form.name,        icon: Award    },
                { label: "Course",           value: form.course,      icon: FileText },
                { label: "Status",           value: form.status,      icon: Settings },
                { label: "Deadline",         value: form.deadline ? new Date(form.deadline).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—", icon: Calendar },
                { label: "Winners",          value: String(form.winnersCount), icon: Users },
                { label: "Funding Type",     value: form.fundingType === "full" ? "Fully Funded" : "Half Funded", icon: Award },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <Icon className="h-4 w-4 text-[#1E90FF] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tuition breakdown */}
            {tuition > 0 && (
              <div className={cn(
                "rounded-xl p-4 border",
                form.fundingType === "full" ? "bg-[#1E90FF]/5 border-[#1E90FF]/20" : "bg-[#F57C00]/5 border-[#F57C00]/20"
              )}>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Tuition Breakdown</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500 line-through">Original: ETB {tuition}</span>
                  <span className="text-gray-400">→</span>
                  <span className={cn("font-black text-base", form.fundingType === "full" ? "text-[#1E90FF]" : "text-[#F57C00]")}>
                    You Pay: {form.fundingType === "full" ? "ETB 0" : `ETB ${studentPay}`}
                  </span>
                </div>
              </div>
            )}

            {/* Application form */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Application Form</p>
              <p className="text-xs font-mono text-[#1E90FF] break-all">
                {form.applicationFormUrl || `/courses/${form.courseId || form.course.toLowerCase().replace(/\s+/g, "-")}/ApplicationForm`}
              </p>
            </div>

            {/* Eligibility */}
            {form.eligibility && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Eligibility</p>
                <p className="text-xs text-gray-700">{form.eligibility}</p>
              </div>
            )}

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
            )}

            {success && (
              <div className="px-4 py-3 bg-[#2196F3]/10 border border-[#2196F3]/30 text-[#2196F3] rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Scholarship created! Redirecting...
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Form Link")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                ← Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = `/${locale}/admin/scholarships`}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving || success}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-60"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? "Creating..." : "Create Scholarship"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

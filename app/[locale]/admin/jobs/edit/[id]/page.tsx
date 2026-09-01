"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, Plus, Trash2, CheckCircle, Loader2, Briefcase, MapPin, Link2, FileText } from "lucide-react";
import AdminHeader from "../../../components/AdminHeader";
import { cn } from "@/lib/utils";
import { JOB_CATEGORIES, JOB_TYPES, JOB_LEVELS, type Job, type JobType, type JobLevel } from "@/lib/jobs-config";
import { getStoredJobs, saveJobs } from "@/lib/jobs-store";
import { pushSharedJobs } from "@/lib/jobs-shared";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

const TABS = ["Basic Info", "Details", "Requirements", "Review"] as const;
type Tab = typeof TABS[number];

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const pathname = usePathname();
  const locale   = pathname.split("/")[1] || "en";
  const resolvedParams = React.use(params);
  const jobId    = resolvedParams.id;

  const [tab,     setTab]     = useState<Tab>("Basic Info");
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");
  const [notFound, setNotFound] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);

  const [form, setForm] = useState({
    title:       "",
    company:     "",
    location:    "",
    type:        "Full-Time" as JobType,
    level:       "Entry Level" as JobLevel,
    category:    "Development",
    salary:      "",
    deadline:    "",
    status:      "open",
    description: "",
    applyUrl:    "",
    applicationMode: "both" as "both" | "form" | "link",
  });
  const [requirements,     setRequirements]     = useState<string[]>([""]);
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);

  // Load the job to edit — localStorage first, then API fallback
  useEffect(() => {
    const populate = (job: Job) => {
      setForm({
        title:       job.title,
        company:     job.company,
        location:    job.location,
        type:        job.type,
        level:       job.level,
        category:    job.category,
        salary:      job.salary ?? "",
        deadline:    job.deadline ? job.deadline.split("T")[0] : "",
        status:      job.status,
        description: job.description,
        applyUrl:    job.applyUrl,
        applicationMode: (job.applicationMode as "both" | "form" | "link") || "both",
      });
      setRequirements(job.requirements?.length > 0 ? job.requirements : [""]);
      setResponsibilities(job.responsibilities?.length > 0 ? job.responsibilities : [""]);
    };

    // 1. Try localStorage first (instant)
    const stored = getStoredJobs();
    const local  = stored.find(j => j.id === jobId);
    if (local) { populate(local); setLoadingJob(false); return; }

    // 2. Fall back to API
    const token = sessionStorage.getItem("adminToken");
    fetch(`${API}/jobs/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        const job: Job = d?.data ?? d;
        if (!job?.id && !job?.title) throw new Error("empty");
        // Save to localStorage so future edits are instant
        saveJobs([job, ...stored]);
        populate(job);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingJob(false));
  }, [jobId]);

  const set = (field: keyof typeof form, value: string | "both" | "form" | "link") =>
    setForm(p => ({ ...p, [field]: value as never }));

  const tabIndex   = TABS.indexOf(tab);
  const isComplete = (t: Tab) => TABS.indexOf(t) < tabIndex;

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    const token      = sessionStorage.getItem("adminToken");
    const isDemoToken = !token || token === "demo-token";

    const payload: Job = {
      id:               jobId,
      ...form,
      type:             form.type as JobType,
      level:            form.level as JobLevel,
      status:           form.status as Job["status"],
      requirements:     requirements.filter(Boolean),
      responsibilities: responsibilities.filter(Boolean),
      postedAt:         new Date().toISOString(),
    };

    // Optimistically update localStorage
    const existing = getStoredJobs();
    const updated  = existing.map(j => j.id === jobId ? payload : j);
    // If the job wasn't in localStorage (came from static config), append it
    if (!existing.find(j => j.id === jobId)) updated.push(payload);
    saveJobs(updated);
    pushSharedJobs(updated);

    if (isDemoToken) {
      setSuccess(true);
      setTimeout(() => { window.location.href = `/${locale}/admin/jobs`; }, 1500);
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`${API}/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        // Non-fatal: localStorage already updated
        setError(d.message || `Server error ${res.status} — saved locally.`);
      }
    } catch {
      setError("Could not reach server — changes saved locally.");
    }

    setSuccess(true);
    setTimeout(() => { window.location.href = `/${locale}/admin/jobs`; }, 1500);
    setSaving(false);
  };

  if (loadingJob) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Edit Job" />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#1E90FF] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex flex-col h-full">
        <AdminHeader title="Edit Job" />
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <div>
            <p className="text-2xl font-black text-gray-300 mb-2">Job not found</p>
            <p className="text-sm text-gray-400 mb-6">The job ID <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{jobId}</code> does not exist.</p>
            <button
              onClick={() => window.location.href = `/${locale}/admin/jobs`}
              className="px-5 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors"
            >
              ← Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Edit Job" />

      <div className="flex-1 p-6 overflow-y-auto">
        {/* Back */}
        <div className="mb-6">
          <button
            onClick={() => window.location.href = `/${locale}/admin/jobs`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Jobs
          </button>
          <h1 className="text-xl font-bold text-gray-800">Edit Job</h1>
          <p className="text-xs text-[#1E90FF] mt-0.5">Update the job announcement details</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap",
                tab === t        ? "border-[#1E90FF] text-[#1E90FF]"
                : isComplete(t)  ? "border-transparent text-emerald-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
              )}>
              {isComplete(t) && <CheckCircle size={14} className="text-emerald-500" />}
              {t}
            </button>
          ))}
        </div>

        {/* ── BASIC INFO ── */}
        {tab === "Basic Info" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Basic Information</h2>
              <p className="text-xs text-gray-400">Job title, company, location and type</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Job Title *</label>
              <input value={form.title} onChange={e => set("title", e.target.value)}
                placeholder="e.g. Junior Full-Stack Developer"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
                <input value={form.company} onChange={e => set("company", e.target.value)}
                  placeholder="e.g. TechEthiopia"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Location *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input value={form.location} onChange={e => set("location", e.target.value)}
                    placeholder="e.g. Addis Ababa / Remote"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Job Type *</label>
                <select value={form.type} onChange={e => set("type", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Level *</label>
                <select value={form.level} onChange={e => set("level", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  {JOB_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <select value={form.category} onChange={e => set("category", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                  {JOB_CATEGORIES.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Salary Range</label>
                <input value={form.salary} onChange={e => set("salary", e.target.value)}
                  placeholder="e.g. 8,000 – 12,000 Birr / month"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Application Deadline</label>
                <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => set("status", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                <option value="open">Open</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setTab("Details")}
                disabled={!form.title || !form.company || !form.location}
                className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Next: Details →
              </button>
            </div>
          </div>
        )}

        {/* ── DETAILS ── */}
        {tab === "Details" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Job Details</h2>
              <p className="text-xs text-gray-400">Description and application link</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Job Description *</label>
              <textarea rows={5} value={form.description} onChange={e => set("description", e.target.value)}
                placeholder="Describe the role, team, and what makes this opportunity exciting..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none" />
            </div>

            <div className="bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-xl p-4">
              <label className="block text-xs font-semibold text-[#1E90FF] mb-2">
                📋 Application Method
              </label>
              <p className="text-[11px] text-gray-400 mb-2">How should applicants apply for this job?</p>
              <div className="space-y-2">
                {([
                  { value: "both", label: "Both — Application Form + Apply Online link", desc: "Show both options so applicants can choose." },
                  { value: "form", label: "Application Form only", desc: "Use SkillBridge's built-in application form." },
                  { value: "link", label: "Apply Online link only", desc: "Send applicants to an external link." },
                ] as const).map(opt => (
                  <label key={opt.value}
                    className={cn(
                      "flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all",
                      form.applicationMode === opt.value
                        ? "border-[#1E90FF] bg-[#1E90FF]/10"
                        : "border-gray-200 bg-white hover:border-[#1E90FF]/50"
                    )}>
                    <input
                      type="radio"
                      name="applicationMode"
                      checked={form.applicationMode === opt.value}
                      onChange={() => set("applicationMode", opt.value)}
                      className="mt-0.5 accent-[#1E90FF]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-gray-700">{opt.label}</span>
                      <span className="block text-[11px] text-gray-400 mt-0.5">{opt.desc}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {form.applicationMode !== "form" && (
              <div className="bg-[#1E90FF]/5 border border-[#1E90FF]/20 rounded-xl p-4">
                <label className="block text-xs font-semibold text-[#1E90FF] mb-1">
                  🔗 Application Link {form.applicationMode === "link" && <span className="text-red-500">*</span>}
                </label>
                <p className="text-[11px] text-gray-400 mb-2">Where should applicants apply?</p>
                <div className="relative">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input type="url" value={form.applyUrl} onChange={e => set("applyUrl", e.target.value)}
                    placeholder="https://forms.google.com/... or https://company.com/apply"
                    className="w-full pl-8 pr-3 py-2.5 text-sm border border-[#1E90FF]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 bg-white" />
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Basic Info")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">← Back</button>
              <button onClick={() => setTab("Requirements")}
                disabled={!form.description || (form.applicationMode !== "form" && !form.applyUrl)}
                className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Next: Requirements →
              </button>
            </div>
          </div>
        )}

        {/* ── REQUIREMENTS ── */}
        {tab === "Requirements" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-6">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Requirements & Responsibilities</h2>
              <p className="text-xs text-gray-400">What candidates need and what they will do</p>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Requirements</label>
              <div className="space-y-2">
                {requirements.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="flex items-center justify-center w-5 h-5 mt-2 rounded-full bg-[#1E90FF] text-white text-[10px] font-bold shrink-0">{i + 1}</span>
                    <input value={r} onChange={e => setRequirements(p => p.map((x, j) => j === i ? e.target.value : x))}
                      placeholder={`Requirement ${i + 1}`}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                    {requirements.length > 1 && (
                      <button onClick={() => setRequirements(p => p.filter((_, j) => j !== i))}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setRequirements(p => [...p, ""])}
                className="mt-2 flex items-center gap-1.5 text-xs text-[#1E90FF] hover:underline">
                <Plus size={12} /> Add Requirement
              </button>
            </div>

            {/* Responsibilities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Responsibilities</label>
              <div className="space-y-2">
                {responsibilities.map((r, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="flex items-center justify-center w-5 h-5 mt-2 rounded-full bg-[#F57C00] text-white text-[10px] font-bold shrink-0">{i + 1}</span>
                    <input value={r} onChange={e => setResponsibilities(p => p.map((x, j) => j === i ? e.target.value : x))}
                      placeholder={`Responsibility ${i + 1}`}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                    {responsibilities.length > 1 && (
                      <button onClick={() => setResponsibilities(p => p.filter((_, j) => j !== i))}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setResponsibilities(p => [...p, ""])}
                className="mt-2 flex items-center gap-1.5 text-xs text-[#1E90FF] hover:underline">
                <Plus size={12} /> Add Responsibility
              </button>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Details")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">← Back</button>
              <button onClick={() => setTab("Review")}
                className="px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* ── REVIEW ── */}
        {tab === "Review" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-2xl space-y-5">
            <div>
              <h2 className="font-bold text-gray-800 mb-0.5">Review & Save</h2>
              <p className="text-xs text-gray-400">Check all details before saving changes</p>
            </div>

            {/* Summary grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Job Title",  value: form.title,    icon: Briefcase },
                { label: "Company",    value: form.company,  icon: Briefcase },
                { label: "Location",   value: form.location, icon: MapPin    },
                { label: "Type",       value: form.type,     icon: FileText  },
                { label: "Level",      value: form.level,    icon: FileText  },
                { label: "Category",   value: form.category, icon: FileText  },
                { label: "Salary",     value: form.salary || "Not specified", icon: FileText },
                { label: "Deadline",   value: form.deadline ? new Date(form.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No deadline", icon: FileText },
                { label: "Status",     value: form.status,   icon: FileText  },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <Icon className="h-3.5 w-3.5 text-[#1E90FF] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5 capitalize">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-[#1E90FF]/5 rounded-xl border border-[#1E90FF]/20">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Application Method</p>
              <p className="text-xs font-semibold text-gray-800 capitalize">
                {form.applicationMode === "both" ? "Both (Form + Link)"
                  : form.applicationMode === "form" ? "Application Form only"
                  : "Apply Online link only"}
              </p>
              {form.applicationMode !== "form" && (
                <p className="text-[11px] font-mono text-[#1E90FF] break-all mt-1">{form.applyUrl}</p>
              )}
            </div>

            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-xs text-gray-600 line-clamp-3">{form.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Requirements ({requirements.filter(Boolean).length})</p>
                {requirements.filter(Boolean).slice(0, 3).map((r, i) => (
                  <p key={i} className="text-xs text-gray-600 flex items-start gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1E90FF] mt-1.5 shrink-0" />
                    <span className="line-clamp-1">{r}</span>
                  </p>
                ))}
                {requirements.filter(Boolean).length > 3 && (
                  <p className="text-[11px] text-gray-400">+{requirements.filter(Boolean).length - 3} more</p>
                )}
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Responsibilities ({responsibilities.filter(Boolean).length})</p>
                {responsibilities.filter(Boolean).slice(0, 3).map((r, i) => (
                  <p key={i} className="text-xs text-gray-600 flex items-start gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F57C00] mt-1.5 shrink-0" />
                    <span className="line-clamp-1">{r}</span>
                  </p>
                ))}
                {responsibilities.filter(Boolean).length > 3 && (
                  <p className="text-[11px] text-gray-400">+{responsibilities.filter(Boolean).length - 3} more</p>
                )}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle size={16} /> Job updated successfully! Redirecting...
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={() => setTab("Requirements")} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">← Back</button>
              <div className="flex gap-3">
                <button onClick={() => window.location.href = `/${locale}/admin/jobs`}
                  className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={saving || success}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-60">
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

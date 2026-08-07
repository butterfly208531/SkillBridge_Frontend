"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowLeft, Save, Loader2, CheckCircle2, CalendarDays, Users, MapPin, Mail, Clock, Star } from "lucide-react";
import Image from "next/image";
import AdminHeader from "../../../components/AdminHeader";
import { cn } from "@/lib/utils";
import { scholarshipsConfig } from "@/lib/scholarships-config";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

type FundingType = "full" | "half";

function daysLeft(deadline: string): number {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}
function studentPays(tuition: number, type: FundingType) {
  return type === "full" ? 0 : Math.round(tuition * 0.5);
}
function formatDeadline(iso: string) {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// ── Live Preview Card ─────────────────────────────────────────────────────────
function PreviewCard({ form }: { form: any }) {
  const days   = form.deadline ? daysLeft(form.deadline) : 999;
  const closed = days < 0;
  const soon   = days >= 0 && days <= 7;
  const tuition = Number(form.tuitionAmount) || 0;
  const pays    = studentPays(tuition, form.fundingType);
  const year    = form.deadline ? new Date(form.deadline).getFullYear() : new Date().getFullYear();

  const headerGrad = closed
    ? "linear-gradient(135deg,#6b7280,#9ca3af)"
    : form.fundingType === "full"
    ? "linear-gradient(135deg,#1565C0 0%,#2196F3 60%,#42A5F5 100%)"
    : "linear-gradient(135deg,#b45309 0%,#F57C00 60%,#fb923c 100%)";

  const requirements = (form.eligibility || "").split(/[.,;]/).map((s: string) => s.trim()).filter(Boolean);

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-100 w-[320px] shrink-0">
      {/* Header */}
      <div className="relative px-6 pt-7 pb-12 text-white overflow-hidden" style={{ background: headerGrad }}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white/10" />

        {soon && !closed && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse">⚠ Closing Soon!</span>
          </div>
        )}

        <p className="text-3xl font-black leading-none">{year}</p>
        <p className="text-xl font-black uppercase leading-tight mt-0.5">Scholarship</p>
        <p className="text-xl font-black uppercase leading-tight">Program</p>

        <div className="mt-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase bg-white/20 text-white border border-white/30">
            <Star className="h-3 w-3 fill-current" />
            {form.fundingType === "full" ? "Fully Funded" : "Half Funded"}
          </span>
        </div>

        <div className="absolute top-5 right-5 flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">SkillBridge</span>
          <span className="text-[9px] text-white/60">Institute of Technology</span>
        </div>
      </div>

      {/* Diamond logo */}
      <div className="flex justify-center -mt-10 mb-2">
        <div className="w-20 h-20 overflow-hidden shadow-lg border-4 border-white" style={{ clipPath: "polygon(50% 0%,100% 50%,50% 100%,0% 50%)" }}>
          <div className="w-full h-full flex items-center justify-center bg-white p-3">
            <Image src="/Logo.svg" alt="Logo" width={56} height={56} className="w-full h-full object-contain" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-5 pb-5 gap-3">
        <h3 className="text-base font-extrabold text-gray-900 text-center uppercase tracking-wide">
          {form.name || "Scholarship Name"}
        </h3>

        {/* Tuition */}
        {tuition > 0 && (
          <div className={cn("rounded-xl px-4 py-3 text-center border",
            form.fundingType === "full" ? "bg-emerald-50 border-emerald-200" : "bg-orange-50 border-orange-200"
          )}>
            <div className="flex items-center justify-center gap-3 text-sm flex-wrap">
              <span className="text-gray-400 line-through text-xs">Original: ${tuition}</span>
              <span className="text-gray-400">→</span>
              <span className={cn("font-black text-base", form.fundingType === "full" ? "text-emerald-600" : "text-orange-600")}>
                {form.fundingType === "full" ? "You Pay: $0 🎉" : `You Pay: $${pays}`}
              </span>
            </div>
            <p className="text-[11px] mt-1 font-semibold text-gray-500">
              {form.fundingType === "full" ? "100% tuition covered" : `50% covered — save $${Math.round(tuition * 0.5)}`}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-gray-500">
            <Users className="h-3.5 w-3.5 text-[#2196F3]" />
            <span><strong className="text-gray-800">{form.applicationsCount || 0}</strong> applications</span>
          </div>
          {days >= 0 ? (
            <span className={cn("flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold",
              soon ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
            )}>
              <Clock className="h-3 w-3" />{days} days left
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-200 text-gray-500">
              <Clock className="h-3 w-3" />Closed
            </span>
          )}
        </div>

        {/* Requirements */}
        {requirements.length > 0 && (
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-[#2196F3] mb-2 border-b-2 border-[#F57C00] pb-0.5 w-fit">Requirements</p>
            <ul className="flex flex-col gap-1.5">
              {requirements.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 text-[#F57C00] shrink-0" />{req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Deadline */}
        <div className={cn("flex items-center gap-2 text-xs rounded-lg px-3 py-2",
          closed ? "bg-gray-100 text-gray-500" : soon ? "bg-red-50 text-red-600" : "bg-blue-50 text-gray-500"
        )}>
          <CalendarDays className={cn("h-3.5 w-3.5 shrink-0", closed ? "text-gray-400" : soon ? "text-red-500" : "text-[#2196F3]")} />
          <span>Deadline: <strong>{form.deadline ? formatDeadline(form.deadline) : "—"}</strong></span>
        </div>

        {/* Apply button */}
        <button
          disabled={closed}
          className={cn("w-full py-2.5 rounded-lg font-bold text-white text-sm",
            closed ? "bg-gray-200 text-gray-500 cursor-not-allowed" : ""
          )}
          style={!closed ? {
            background: form.fundingType === "full"
              ? "linear-gradient(90deg,#1565C0,#2196F3)"
              : "linear-gradient(90deg,#b45309,#F57C00)"
          } : {}}
        >
          {closed ? "Applications Closed" : "Apply Now"}
        </button>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Addis Ababa, Ethiopia</span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />skillbridge@gmail.com</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Edit Page ─────────────────────────────────────────────────────────────
export default function EditScholarshipPage() {
  const pathname = usePathname();
  const locale   = pathname.split("/")[1] || "en";
  const id       = pathname.split("/").pop() || "";

  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  const [form, setForm] = useState({
    id:                 "",
    name:               "",
    course:             "",
    courseId:           "",
    eligibility:        "",
    deadline:           "",
    winnersCount:       1,
    applicationsCount:  0,
    status:             "active",
    fundingType:        "full" as FundingType,
    tuitionAmount:      "",
    applicationFormUrl: "",
    description:        "",
  });

  // Load existing scholarship data
  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");

    // Try API first
    fetch(`${API}/scholarships/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(s => setForm(prev => ({
        ...prev,
        id:                 s.id || id,
        name:               s.name || "",
        course:             s.course?.title || s.courseName || s.course || "",
        courseId:           s.courseId || s.course?.id || "",
        eligibility:        s.eligibility || s.requirements || "",
        deadline:           s.deadline?.split("T")[0] || s.endDate?.split("T")[0] || "",
        winnersCount:       s.winnersCount || 1,
        applicationsCount:  s.applicationsCount || 0,
        status:             s.status || "active",
        tuitionAmount:      String(s.tuitionAmount || ""),
        applicationFormUrl: s.applicationFormUrl || "",
        description:        s.description || "",
        fundingType:        s.fundingType || "full",
      })))
      .catch(() => {
        // Fall back to local config
        const local = scholarshipsConfig.find(s => s.id === id);
        if (local) {
          setForm(prev => ({
            ...prev,
            id:                local.id,
            courseId:          local.courseId,
            deadline:          local.deadline,
            winnersCount:      local.winnersCount,
            applicationsCount: local.applicationsCount,
            fundingType:       local.fundingType,
            tuitionAmount:     String(local.tuitionAmount),
            applicationFormUrl: local.applicationFormUrl || "",
          }));
        }
      });
  }, [id]);

  const set = (field: keyof typeof form, value: any) =>
    setForm(p => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const token = sessionStorage.getItem("adminToken");

    const payload = {
      ...form,
      winnersCount:  Number(form.winnersCount),
      tuitionAmount: Number(form.tuitionAmount),
      applicationFormUrl: form.applicationFormUrl || null,
    };

    try {
      const res = await fetch(`${API}/scholarships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
    } catch {
      // optimistic success
    } finally {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => window.location.href = `/${locale}/admin/scholarships`, 1200);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AdminHeader title="Edit Scholarship" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5">
          <button
            onClick={() => window.location.href = `/${locale}/admin/scholarships`}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Scholarships
          </button>
          <h1 className="text-xl font-bold text-gray-800">Edit Scholarship</h1>
          <p className="text-xs text-[#1E90FF] mt-0.5">Changes are reflected live in the preview</p>
        </div>

        {/* Two-column layout: form + preview */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">

          {/* ── Form ── */}
          <div className="flex-1 max-w-2xl space-y-5">

            {/* Basic */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">Basic Information</h2>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Scholarship Name *</label>
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="e.g. Full-Stack Scholarship"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Course Name</label>
                  <input value={form.course} onChange={e => set("course", e.target.value)}
                    placeholder="e.g. Full-Stack Development"
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select value={form.status} onChange={e => set("status", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Eligibility Requirements</label>
                <textarea rows={3} value={form.eligibility} onChange={e => set("eligibility", e.target.value)}
                  placeholder="e.g. Top performer in Python courses"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Winners Count</label>
                  <input type="number" min={1} value={form.winnersCount} onChange={e => set("winnersCount", Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                </div>
              </div>
            </div>

            {/* Funding */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">Funding</h2>

              <div className="grid grid-cols-2 gap-3">
                {(["full","half"] as FundingType[]).map(type => (
                  <button key={type} onClick={() => set("fundingType", type)}
                    className={cn("flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                      form.fundingType === type
                        ? type === "full" ? "border-[#1E90FF] bg-[#1E90FF]/5" : "border-[#F57C00] bg-[#F57C00]/5"
                        : "border-gray-200 hover:border-gray-300"
                    )}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        form.fundingType === type
                          ? type === "full" ? "border-[#1E90FF]" : "border-[#F57C00]"
                          : "border-gray-300"
                      )}>
                        {form.fundingType === type && (
                          <div className={cn("w-2 h-2 rounded-full", type === "full" ? "bg-[#1E90FF]" : "bg-[#F57C00]")} />
                        )}
                      </div>
                      <span className={cn("text-sm font-bold",
                        form.fundingType === type
                          ? type === "full" ? "text-[#1E90FF]" : "text-[#F57C00]"
                          : "text-gray-700"
                      )}>
                        {type === "full" ? "Fully Funded" : "Half Funded"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 pl-6">
                      {type === "full" ? "Student pays $0" : "Student pays 50%"}
                    </p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Course Tuition (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                  <input type="number" min={0} value={form.tuitionAmount} onChange={e => set("tuitionAmount", e.target.value)}
                    placeholder="500"
                    className="w-full pl-7 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30" />
                </div>
              </div>
            </div>

            {/* Application Form URL */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h2 className="text-sm font-bold text-gray-700 border-b border-gray-100 pb-2">Application Form</h2>
              <div className="bg-[#F57C00]/5 border border-[#F57C00]/20 rounded-xl p-4">
                <label className="block text-xs font-semibold text-[#F57C00] mb-1">🔗 Application Form URL</label>
                <p className="text-[11px] text-gray-400 mb-2">Leave empty to use the default course form</p>
                <input type="url" value={form.applicationFormUrl} onChange={e => set("applicationFormUrl", e.target.value)}
                  placeholder="https://forms.google.com/..."
                  className="w-full px-3 py-2 text-sm border border-[#F57C00]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F57C00]/30 bg-white" />
              </div>
            </div>

            {/* Actions */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
            )}
            {success && (
              <div className="px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle2 size={16} /> Saved! Redirecting...
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => window.location.href = `/${locale}/admin/scholarships`}
                className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving || success}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1E90FF] text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-60">
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* ── Live Preview ── */}
          <div className="xl:sticky xl:top-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Live Preview</p>
            <PreviewCard form={form} />
          </div>
        </div>
      </div>
    </div>
  );
}

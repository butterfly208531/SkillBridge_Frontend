"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, UploadCloud, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import { scholarshipsConfig, studentPays, coverageLabel } from "@/lib/scholarships-config";
import { getStoredScholarships } from "@/lib/scholarship-store";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2-h1u9.onrender.com/api";

export default function ScholarshipApplyPage() {
  const pathname = usePathname();
  const router = useRouter();
  const scholarshipId = pathname.split("/").slice(-2, -1)[0];

  // Find scholarship info
  const config = scholarshipsConfig.find(s => s.id === scholarshipId);
  const stored = getStoredScholarships().find(s => s.id === scholarshipId);
  const name   = stored?.name || config?.nameKey || scholarshipId;
  const courseId = stored?.courseId || config?.courseId || scholarshipId;
  const fundingType = stored?.fundingType || config?.fundingType || "full";
  const tuition = stored?.tuitionAmount || config?.tuitionAmount || 0;
  const pays = studentPays(tuition, fundingType);

  // If admin set a custom URL, redirect there immediately
  useEffect(() => {
    if (stored?.applicationFormUrl) {
      window.location.href = stored.applicationFormUrl;
    } else if (config?.applicationFormUrl) {
      window.location.href = config.applicationFormUrl;
    }
  }, [stored, config]);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    telegramHandle: "",
    gender: "",
    nationality: "",
    address: "",
    university: "",
    marketingSource: "",
    motivation: "",
    agreeTerms: false,
  });

  const set = (field: keyof typeof form, value: any) =>
    setForm(p => ({ ...p, [field]: value }));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch(`${API}/scholarship-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, scholarshipId, courseId, fundingType }),
      });
    } catch {}
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-6">
              Thank you for applying for the <strong>{name}</strong>. We will review your application and contact you soon.
            </p>
            <button
              onClick={() => router.push("/scholarships")}
              className="w-full py-3 rounded-xl text-white font-bold"
              style={{ background: "linear-gradient(90deg,#1E90FF,#42A5F5)" }}
            >
              Back to Scholarships
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
      <Navbar />
      <Toaster />

      <div className="flex-1 container mx-auto px-4 py-10 max-w-2xl">

        {/* Back */}
        <button
          onClick={() => router.push("/scholarships")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Scholarships
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="h-2" style={{ background: fundingType === "full" ? "linear-gradient(90deg,#1E90FF,#42A5F5)" : "linear-gradient(90deg,#b45309,#F57C00)" }} />
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Applying for</p>
                <h1 className="text-xl font-extrabold text-gray-800">{name}</h1>
                <p className="text-sm text-[#1E90FF] mt-0.5">{courseId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-black uppercase",
                fundingType === "full" ? "bg-[#1E90FF]/10 text-[#1E90FF]" : "bg-[#F57C00]/10 text-[#F57C00]"
              )}>
                {coverageLabel(fundingType)}
              </span>
            </div>
            {tuition > 0 && (
              <div className={cn(
                "mt-4 rounded-xl px-4 py-3 flex items-center gap-3 text-sm border",
                fundingType === "full" ? "bg-[#1E90FF]/5 border-[#1E90FF]/20" : "bg-[#F57C00]/5 border-[#F57C00]/20"
              )}>
                <span className="text-gray-400 line-through">ETB {tuition}</span>
                <span className="text-gray-400">→</span>
                <span className={cn("font-black text-lg", fundingType === "full" ? "text-[#1E90FF]" : "text-[#F57C00]")}>
                  You Pay: {fundingType === "full" ? "ETB 0" : `ETB ${pays}`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                step >= s ? "text-white" : "bg-gray-100 text-gray-400"
              )} style={step >= s ? { background: "linear-gradient(135deg,#1E90FF,#42A5F5)" } : {}}>
                {step > s ? <CheckCircle size={16} /> : s}
              </div>
              <span className={cn("text-xs font-semibold", step >= s ? "text-gray-700" : "text-gray-400")}>
                {s === 1 ? "Personal Info" : "Review & Submit"}
              </span>
              {s < 2 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Personal Info */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-800">Personal Information</h2>

            {[
              { label: "Full Name *",      field: "fullName",      type: "text",  placeholder: "Enter your full name" },
              { label: "Email *",          field: "email",         type: "email", placeholder: "your@email.com" },
              { label: "Phone *",          field: "phone",         type: "tel",   placeholder: "+251 9XX XXX XXX" },
              { label: "Telegram Handle",  field: "telegramHandle",type: "text",  placeholder: "@username" },
              { label: "Nationality",      field: "nationality",   type: "text",  placeholder: "e.g. Ethiopian" },
              { label: "Address",          field: "address",       type: "text",  placeholder: "City, Country" },
              { label: "University / Institution", field: "university", type: "text", placeholder: "Your current university or institution" },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  value={(form as any)[field]}
                  onChange={e => set(field as any, e.target.value)}
                  placeholder={placeholder}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30"
                />
              </div>
            ))}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
              <select value={form.gender} onChange={e => set("gender", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">How did you hear about us?</label>
              <select value={form.marketingSource} onChange={e => set("marketingSource", e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30">
                <option value="">Select source</option>
                <option>Telegram</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Friend / Referral</option>
                <option>YouTube</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Why do you deserve this scholarship?</label>
              <textarea
                rows={4}
                value={form.motivation}
                onChange={e => set("motivation", e.target.value)}
                placeholder="Tell us about your goals, background, and why you should be selected..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/30 resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  if (!form.fullName || !form.email || !form.phone) {
                    toast.error("Please fill in the required fields");
                    return;
                  }
                  setStep(2);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-white font-semibold text-sm rounded-xl"
                style={{ background: "linear-gradient(90deg,#1E90FF,#42A5F5)" }}
              >
                Next: Review <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <h2 className="font-bold text-gray-800">Review Your Application</h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Full Name",   value: form.fullName },
                { label: "Email",       value: form.email },
                { label: "Phone",       value: form.phone },
                { label: "Telegram",    value: form.telegramHandle || "—" },
                { label: "Nationality", value: form.nationality || "—" },
                { label: "University",  value: form.university || "—" },
                { label: "Address",     value: form.address || "—" },
                { label: "Gender",      value: form.gender || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5 break-all">{value}</p>
                </div>
              ))}
            </div>

            {form.motivation && (
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Motivation</p>
                <p className="text-sm text-gray-600">{form.motivation}</p>
              </div>
            )}

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={form.agreeTerms}
                onChange={e => set("agreeTerms", e.target.checked)}
                className="mt-1 accent-[#1E90FF]"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I confirm that all the information provided is accurate and I agree to the scholarship terms and conditions.
              </label>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
                <ArrowLeft size={14} /> Edit
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.agreeTerms || isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 text-white font-bold text-sm rounded-xl disabled:opacity-50 transition-all"
                style={{ background: fundingType === "full" ? "linear-gradient(90deg,#1E90FF,#42A5F5)" : "linear-gradient(90deg,#b45309,#F57C00)" }}
              >
                {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

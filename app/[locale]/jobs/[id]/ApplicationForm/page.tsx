"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import { jobsConfig, type Job } from "@/lib/jobs-config";
import { getStoredJobs } from "@/lib/jobs-store";
import { syncSharedJobsToLocal } from "@/lib/jobs-shared";
import { addJobApplicationSupabase } from "@/lib/job-applications-supabase";
import LeftPanel from "./LeftPanel";

const JobApplicationForm = () => {
  const params = useParams();
  const jobId = decodeURIComponent((params.id as string) || "");
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";

  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    email: "",
    phone: "",
    telegramHandle: "",
    university: "",
    address: "",
    coverLetter: "",
    marketingSource: "",
    agreeTerms: false,
    confirmAccuracy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJobLoading, setIsJobLoading] = useState(true);
  const [jobData, setJobData] = useState<Job | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const APPLIED_KEY = "appliedJobs";

  const hasAlreadyApplied = (email: string, jobId: string): boolean => {
    try {
      const raw = localStorage.getItem(APPLIED_KEY);
      const list: { email: string; jobId: string }[] = raw ? JSON.parse(raw) : [];
      const normalEmail = email.trim().toLowerCase();
      return list.some(
        (entry) =>
          entry.email.trim().toLowerCase() === normalEmail &&
          entry.jobId.trim().toLowerCase() === jobId.trim().toLowerCase()
      );
    } catch {
      return false;
    }
  };

  const markAsApplied = (email: string, jobId: string): void => {
    try {
      const raw = localStorage.getItem(APPLIED_KEY);
      const list: { email: string; jobId: string }[] = raw ? JSON.parse(raw) : [];
      const normalEmail = email.trim().toLowerCase();
      const normalJobId = jobId.trim().toLowerCase();
      if (!list.some(e => e.email === normalEmail && e.jobId === normalJobId)) {
        list.push({ email: normalEmail, jobId: normalJobId });
      }
      localStorage.setItem(APPLIED_KEY, JSON.stringify(list));
    } catch {
      // Non-critical
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentUserString = sessionStorage.getItem("currentUser");
      if (currentUserString) {
        try {
          const currentUser = JSON.parse(currentUserString);
          setForm((prev) => ({
            ...prev,
            fullName: currentUser.name || prev.fullName,
            email: currentUser.email || prev.email,
          }));
        } catch (error) {
          console.error("Failed to parse currentUser from sessionStorage:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!jobId) {
      setIsJobLoading(false);
      return;
    }

    const findJob = (): Job | undefined => {
      const storedJobs = getStoredJobs();
      const allJobs = storedJobs.length > 0 ? storedJobs : jobsConfig;
      return allJobs.find(j => j.id === jobId);
    };

    // First try whatever is already available locally
    const local = findJob();
    if (local) {
      setJobData(local);
    }

    // Then sync the shared Supabase store so newly-added admin jobs are found
    (async () => {
      await syncSharedJobsToLocal();
      const synced = findJob();
      if (synced) {
        setJobData(synced);
        setIsJobLoading(false);
        return;
      }

      // Fall back to the backend API
      try {
        const API = process.env.NEXT_PUBLIC_API_BASE_URL || "https://skillbridge-backend2.onrender.com/api";
        const res = await fetch(`${API}/jobs`);
        if (res.ok) {
          const data = await res.json();
          const list: Job[] = Array.isArray(data) ? data : data.data ?? [];
          const found = list.find(j => j.id === jobId) || findJob();
          if (found) setJobData(found);
        }
      } catch {
        // ignore — keep whatever we already have
      }
      setIsJobLoading(false);
    })();
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep1 = () => {
    const errors: string[] = [];
    if (!form.fullName) errors.push("Full Name is required.");
    if (!form.email) errors.push("Email Address is required.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push("Invalid Email Address.");
    if (!form.phone) errors.push("Phone Number is required.");
    if (!form.telegramHandle) errors.push("Telegram Handle is required.");
    if (!form.address) errors.push("Address is required.");
    if (!form.gender) errors.push("Gender is required.");
    if (errors.length > 0) { setValidationErrors(errors); return false; }
    return true;
  };

  const validateStep2 = () => {
    const errors: string[] = [];
    if (isJobLoading) {
      errors.push("Job details are still loading — please wait a moment and try again.");
    } else if (!jobData) {
      errors.push("This job could not be found. Please go back to the jobs page and try again.");
    }
    if (!form.agreeTerms) errors.push("You must agree to the Terms and Conditions.");
    if (!form.confirmAccuracy) errors.push("You must confirm the accuracy of the information.");
    if (errors.length > 0) { setValidationErrors(errors); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    if (hasAlreadyApplied(form.email, jobId)) {
      setValidationErrors([
        `You have already applied for ${jobData?.title || "this job"} with this email address. Each email can only submit one application per job.`,
      ]);
      return;
    }
    setCurrentStep(2);
  };
  const handleBack = () => setCurrentStep(1);

  const handleReset = () => {
    setForm(prev => ({
      ...prev,
      fullName: "", dateOfBirth: "", gender: "", nationality: "", email: "",
      phone: "", telegramHandle: "", university: "", address: "",
      coverLetter: "", marketingSource: "", agreeTerms: false, confirmAccuracy: false,
    }));
    setCurrentStep(1);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    if (hasAlreadyApplied(form.email, jobId)) {
      setValidationErrors([
        `You have already applied for ${jobData?.title || "this job"} with this email address. Each email can only submit one application per job.`,
      ]);
      return;
    }

    setIsSubmitting(true);

    try {
      const applicationData = {
        id: `local-job-${Date.now()}`,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        telegramHandle: form.telegramHandle,
        address: form.address,
        gender: form.gender,
        nationality: form.nationality,
        university: form.university,
        dateOfBirth: form.dateOfBirth || "",
        jobId: jobId,
        jobTitle: jobData?.title || "",
        company: jobData?.company || "",
        coverLetter: form.coverLetter,
        marketingSource: form.marketingSource || "Direct",
        submittedAt: new Date().toISOString(),
        status: "new",
        read: false,
      };

      // Save to localStorage for admin notifications
      const existing = JSON.parse(localStorage.getItem("adminJobNotifications") || "[]");
      localStorage.setItem("adminJobNotifications", JSON.stringify([applicationData, ...existing]));

      // Save to Supabase
      await addJobApplicationSupabase(applicationData);

      // Mark as applied
      markAsApplied(form.email, jobId);

      toast.success("Application Submitted Successfully!");
      handleReset();

      const locale = (params.locale as string) || "en";
      router.push(`/${locale}/jobs/success?jobId=${jobId}`);
    } catch (error: any) {
      console.error("Job application submission error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Toaster position="top-right" reverseOrder={false} />
        {validationErrors.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-red-100 dark:border-red-900/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50">Please fix the following</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{validationErrors.length} field{validationErrors.length > 1 ? "s" : ""} need attention</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {validationErrors.map((err, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {err}
                  </li>
                ))}
              </ul>
              <button onClick={() => setValidationErrors([])} className="w-full bg-[#2196F3] hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm">
                Got it, I&apos;ll fix these
              </button>
            </div>
          </div>
        )}
        <div className="flex min-h-[calc(100vh-64px)]">
          <LeftPanel />
          <div className="flex-1 py-10 px-4 lg:px-10">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Job Application</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {jobData ? `Applying for: ${jobData.title} at ${jobData.company}` : "Complete all steps to submit your application"}
                </p>
              </div>
              <div className="flex items-center justify-center mb-10">
                {[1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                      currentStep === step ? "bg-[#2196F3] text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                      : currentStep > step ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}>
                      {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    <div className="ml-2 mr-6">
                      <p className={`text-xs font-semibold ${currentStep === step ? "text-[#2196F3]" : "text-gray-400"}`}>
                        {step === 1 ? "Personal Info" : "Application Details"}
                      </p>
                    </div>
                    {step < 2 && <div className={`w-16 h-0.5 mr-6 transition-all duration-300 ${currentStep > 1 ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`} />}
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <form onSubmit={(e) => e.preventDefault()} noValidate className="p-8 space-y-8">
                  {currentStep === 1 && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                          <span className="text-[#2196F3] font-bold text-sm">1</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Personal Information</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>

                        <div className="relative">
                          <label htmlFor="gender" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Gender <span className="text-red-500">*</span>
                          </label>
                          <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm">
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                          <ArrowDown className="absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
                        </div>
                        <div>
                          <label htmlFor="nationality" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Nationality</label>
                          <input id="nationality" name="nationality" value={form.nationality} onChange={handleChange} placeholder="Ethiopian" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input id="email" name="email" value={form.email} onChange={handleChange} placeholder="john.doe@example.com" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+251 9XX XXX XXX" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>
                        <div>
                          <label htmlFor="telegramHandle" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Telegram Handle <span className="text-red-500">*</span>
                          </label>
                          <input id="telegramHandle" name="telegramHandle" value={form.telegramHandle} onChange={handleChange} placeholder="@username" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Address <span className="text-red-500">*</span>
                          </label>
                          <textarea id="address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, City, Country" rows={3} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm resize-none" />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button type="button" onClick={handleNext} className="inline-flex items-center bg-[#2196F3] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm">
                          Next <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <button type="button" onClick={handleBack} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label="Go back to previous step">
                          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                          <span className="text-[#2196F3] font-bold text-sm">2</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Application Details</h3>
                      </div>

                      {/* Job info display */}
                      <div className="mb-5">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                          Position <span className="text-red-500">*</span>
                        </label>
                        <div className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-900/60 transition-all duration-200 ${
                          isJobLoading
                            ? "border-blue-200 dark:border-blue-800"
                            : !jobData
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        }`}>
                          {isJobLoading ? (
                            <div className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400">
                              <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                              <span>Fetching job details…</span>
                            </div>
                          ) : !jobData ? (
                            <p className="text-sm text-red-500 dark:text-red-400">Job not found — please go back and try again.</p>
                          ) : (
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#2196F3]/10 dark:bg-[#2196F3]/20 flex items-center justify-center shrink-0">
                                  <svg className="w-4 h-4 text-[#2196F3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">
                                    {jobData.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2196F3]/10 text-[#2196F3] dark:bg-[#2196F3]/20">
                                      {jobData.company}
                                    </span>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                      {jobData.type}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {jobData.salary && (
                                <div className="text-right shrink-0">
                                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">Salary</p>
                                  <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{jobData.salary}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="mt-5">
                        <label htmlFor="coverLetter" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                          Cover Letter
                        </label>
                        <textarea id="coverLetter" name="coverLetter" value={form.coverLetter} onChange={handleChange} placeholder="Tell us why you're a great fit for this position..." rows={5} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm resize-none" />
                      </div>

                      <div className="relative mt-5">
                        <label htmlFor="marketingSource" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">How did you hear about us?</label>
                        <select id="marketingSource" name="marketingSource" value={form.marketingSource} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm">
                          <option value="">Choose</option>
                          <option value="facebook">Facebook</option>
                          <option value="telegram">Telegram</option>
                          <option value="friend">Friend</option>
                          <option value="search">Google Search</option>
                          <option value="instagram">Instagram</option>
                          <option value="other">Other</option>
                        </select>
                        <ArrowDown className="absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
                      </div>
                      <div className="space-y-3 mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-[#2196F3]" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            I agree to the{" "}
                            <Link href="/terms" className="text-[#2196F3] hover:underline font-medium">Terms and Conditions</Link>{" "}
                            and Privacy Policy.
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" name="confirmAccuracy" checked={form.confirmAccuracy} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-[#2196F3]" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">I confirm all information is accurate and true.</span>
                        </label>
                      </div>
                      <div className="flex justify-between mt-8 gap-4">
                        <button type="button" onClick={handleReset} className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-all duration-200">
                          Reset Form
                        </button>
                        <button type="submit" onClick={handleSubmitApplication} className="inline-flex items-center justify-center bg-[#2196F3] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting || isJobLoading}>
                          {isSubmitting ? "Submitting..." : (<>Submit Application <CheckCircle className="ml-2 w-4 h-4" /></>)}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default JobApplicationForm;

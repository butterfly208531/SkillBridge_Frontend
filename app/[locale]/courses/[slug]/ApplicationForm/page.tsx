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
import { useTranslations } from "next-intl";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import { fetchCourses, fetchCourseById, fetchCourseBySlug } from "@/lib/api";
import { coursesConfig, getCourseBySlug } from "@/lib/courses-config";
import { getSeedCourseBySlug } from "@/lib/courses-seed";
import { getPublicCourses } from "@/lib/courses-store";
import { syncSharedCoursesToLocal } from "@/lib/courses-shared";
import { addApplicationSupabase } from "@/lib/applications-supabase";

const ApplicationForm = () => {
  const t = useTranslations("applicationForm");
  const params = useParams();
  const slug = decodeURIComponent((params.slug as string) || "");
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
    courseId: "",          // always starts empty — filled by UUID lookup below
    courseType: "",        // VIP | One to One | Other
    paymentMethod: "",     // Commercial Bank of Ethiopia (CBE) | Telebirr
    marketingSource: "",
    agreeTerms: false,
    confirmAccuracy: false,
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCourseLoading, setIsCourseLoading] = useState(true);
  const [coursePrice, setCoursePrice] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [courseCategory, setCourseCategory] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // ── Duplicate-application helpers ────────────────────────────────────────
  const APPLIED_KEY = "appliedCourses"; // localStorage key

  /**
   * Returns a stable, consistent course key for duplicate tracking.
   * Prefers the resolved UUID; falls back to the URL slug (always available).
   * Storing BOTH means a slug→UUID change on a subsequent visit still matches.
   */
  const courseKeys = (courseId: string): string[] => {
    const keys: string[] = [];
    if (slug) keys.push(slug.trim().toLowerCase());
    if (courseId && courseId !== slug) keys.push(courseId.trim().toLowerCase());
    return keys;
  };

  /** Returns true if this email has already applied for this course (by any key). */
  const hasAlreadyApplied = (email: string, courseId: string): boolean => {
    try {
      const raw = localStorage.getItem(APPLIED_KEY);
      const list: { email: string; courseId: string }[] = raw ? JSON.parse(raw) : [];
      const normalEmail = email.trim().toLowerCase();
      const keys = courseKeys(courseId);
      return list.some(
        (entry) =>
          entry.email.trim().toLowerCase() === normalEmail &&
          keys.includes(entry.courseId.trim().toLowerCase())
      );
    } catch {
      return false;
    }
  };

  /** Persists the email + course keys so future attempts are blocked locally. */
  const markAsApplied = (email: string, courseId: string): void => {
    try {
      const raw = localStorage.getItem(APPLIED_KEY);
      const list: { email: string; courseId: string }[] = raw ? JSON.parse(raw) : [];
      const normalEmail = email.trim().toLowerCase();
      // Write one entry per key (slug + UUID) so both always match
      for (const key of courseKeys(courseId)) {
        if (!list.some(e => e.email === normalEmail && e.courseId === key)) {
          list.push({ email: normalEmail, courseId: key });
        }
      }
      localStorage.setItem(APPLIED_KEY, JSON.stringify(list));
    } catch {
      // Non-critical — silently ignore storage errors
    }
  };
  // ─────────────────────────────────────────────────────────────────────────

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
    if (!slug) {
      setIsCourseLoading(false);
      return;
    }

    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const isUUID = uuidPattern.test(slug);

    const resolveAndLoad = async () => {
      try {
        let resolvedId = isUUID ? slug : "";
        let resolvedName = "";
        let resolvedPrice: number | null = null;
        let resolvedCategory = "";

        // Step 1: Only call fetchCourseById when slug is a UUID — otherwise skip straight to slug endpoint
        if (isUUID) {
          const course = await fetchCourseById(slug);
          if (course?.id) {
            resolvedId       = course.id;
            resolvedName     = course.title;
            resolvedPrice    = course.priceDiscounted > 0 ? course.priceDiscounted : course.priceOriginal;
            resolvedCategory = course.category?.name ?? "";
          }
        }

        // Step 1.5: Try the dedicated slug endpoint if still unresolved
        if (!resolvedName && !isUUID) {
          try {
            const slugCourse = await fetchCourseBySlug(slug);
            if (slugCourse?.id) {
              resolvedId       = slugCourse.id;
              resolvedName     = slugCourse.title;
              resolvedPrice    = slugCourse.priceDiscounted > 0 ? slugCourse.priceDiscounted : slugCourse.priceOriginal;
              resolvedCategory = slugCourse.category?.name ?? "";
            }
          } catch (_) {}
        }

        // Step 2: Landing list search (covers slug → UUID mapping)
        if (!resolvedId || (!isUUID && !uuidPattern.test(resolvedId))) {
          try {
            const list = await fetchCourses();
            const toSlug = (s: string) =>
              s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
            const found = list.find((c: any) => {
              const ts = toSlug(c.title || "");
              return c.id === slug || c.slug === slug || ts === slug || ts.startsWith(slug) || slug.startsWith(ts);
            });
            if (found?.id) {
              resolvedId       = found.id;
              resolvedName     = resolvedName     || found.title;
              resolvedPrice    = resolvedPrice    ?? (found.priceDiscounted > 0 ? found.priceDiscounted : found.priceOriginal);
              resolvedCategory = resolvedCategory || found.category?.name || "";
            }
          } catch (_) {}
        }

        // Step 2.5: Local store + Supabase fallback — admin-added / edited courses
        // live in the Supabase-backed `courses` store that the course page reads,
        // but were previously invisible here because this form only queried the
        // backend API. Pull the shared store (Supabase) into localStorage and match
        // by id, slugified id, or slugified title — same as the course detail page.
        if (!resolvedName) {
          try {
            await syncSharedCoursesToLocal();
            const stored = getPublicCourses();
            const toSlug2 = (s: string) =>
              (s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
            const idSlug = toSlug2(slug);
            const storedMatch = stored.find(
              (c) =>
                c.id === slug ||
                toSlug2(c.id) === idSlug ||
                toSlug2(c.title) === idSlug
            );
            if (storedMatch) {
              resolvedId       = storedMatch.id || slug;
              resolvedName     = storedMatch.title || "";
              resolvedCategory = storedMatch.category || "";
              resolvedPrice    =
                (storedMatch.priceDiscounted ?? 0) > 0
                  ? storedMatch.priceDiscounted
                  : storedMatch.priceOriginal ?? null;
            }
          } catch (_) {}
        }

        // Step 3: Static config fallback — use slug as courseId so submission still works
        if (!resolvedName) {
          const toSlug = (s: string) =>
            s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");
          const configMatch =
            getCourseBySlug(slug) ??
            coursesConfig.find(c => c.slug === slug || toSlug(c.title ?? "") === slug);
          if (configMatch) {
            resolvedName     = configMatch.title    || "";
            resolvedCategory = configMatch.category || "";
            // Use the slug as courseId fallback so submission is not blocked
            resolvedId = configMatch.slug ?? slug;
          }
        }

        // Step 3.5: Built-in seed fallback — always available even when store/API are down
        if (!resolvedName) {
          const seedMatch = getSeedCourseBySlug(slug);
          if (seedMatch) {
            resolvedName     = seedMatch.title || "";
            resolvedCategory = seedMatch.category || "";
            resolvedId       = seedMatch.id;
            resolvedPrice    = seedMatch.priceDiscounted > 0 ? seedMatch.priceDiscounted : seedMatch.priceOriginal;
          }
        }

        if (resolvedName)     setCourseName(resolvedName);
        if (resolvedCategory) setCourseCategory(resolvedCategory);
        if (resolvedPrice !== null) setCoursePrice(resolvedPrice);

        // Set courseId from whatever we resolved (UUID from API or slug fallback)
        if (resolvedId) {
          setForm(prev => ({ ...prev, courseId: resolvedId }));
        }
      } catch (_) {
        // All strategies failed
      } finally {
        setIsCourseLoading(false);
      }
    };

    resolveAndLoad();
  }, [slug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm((prev) => ({ ...prev, [name]: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setReceiptFile(file);
    setReceiptUrl(file ? URL.createObjectURL(file) : "");
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
    if (isCourseLoading) {
      errors.push("Course details are still loading — please wait a moment and try again.");
    } else if (!form.courseId && !courseName) {
      errors.push("This course could not be found. Please go back to the courses page and try again.");
    }
    if (!form.agreeTerms) errors.push("You must agree to the Terms and Conditions.");
    if (!form.confirmAccuracy) errors.push("You must confirm the accuracy of the information.");
    if (!form.courseType) errors.push("Please select a course type.");
    if (!form.paymentMethod) errors.push("Please select a payment method.");
    if (!receiptFile) errors.push("Please upload a screenshot of your payment receipt.");
    if (errors.length > 0) { setValidationErrors(errors); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    // Check for duplicate at step transition — email is confirmed valid here,
    // and slug is always available regardless of async courseId resolution.
    if (hasAlreadyApplied(form.email, form.courseId)) {
      setValidationErrors([
        `You have already applied for ${courseName || "this course"} with this email address. Each email can only submit one application per course.`,
      ]);
      return;
    }
    setCurrentStep(2);
  };
  const handleBack = () => setCurrentStep(1);

  const handleReset = () => {
    // Only reset personal fields — keep course info so step 2 still works
    setForm(prev => ({
      ...prev,
      fullName: "", dateOfBirth: "", gender: "", nationality: "", email: "",
      phone: "", telegramHandle: "", university: "", address: "",
      courseType: "", paymentMethod: "",
      marketingSource: "", agreeTerms: false, confirmAccuracy: false,
    }));
    setReceiptFile(null);
    setReceiptUrl("");
    setCurrentStep(1);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    // ── Duplicate check ───────────────────────────────────────────────────
    // Use form.courseId if resolved, otherwise fall back to the URL slug so
    // the check works even if the async resolution hasn't finished yet.
    const effectiveCourseId = form.courseId || slug;
    if (hasAlreadyApplied(form.email, effectiveCourseId)) {
      setValidationErrors([
        `You have already applied for ${courseName || "this course"} with this email address. Each email can only submit one application per course.`,
      ]);
      return;
    }
    // ─────────────────────────────────────────────────────────────────────

    // Determine if we have a real UUID or just a slug fallback
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    const hasRealUUID = uuidPattern.test(form.courseId);

    if (form.courseId && courseName) {
      const basicCourseInfo = { id: form.courseId, title: courseName, price: coursePrice };
      sessionStorage.setItem("lastEnrolledCourse", JSON.stringify(basicCourseInfo));
      localStorage.setItem(`course-${form.courseId}`, JSON.stringify(basicCourseInfo));
    }
    setIsSubmitting(true);

    // Upload payment receipt to Supabase Storage (best-effort). Provides a
    // durable public URL persisted on the application row and shown to admin.
    let submittedReceiptUrl = "";
    if (receiptFile) {
      const { uploadReceiptSupabase } = await import("@/lib/applications-supabase");
      submittedReceiptUrl = (await uploadReceiptSupabase(receiptFile, form.courseId || "course")) || "";
    }

    // If no real UUID (API was down during load), save locally and treat as success
    if (!hasRealUUID) {
      try {
        const localApp = {
          id: `local-${Date.now()}`,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          telegramHandle: form.telegramHandle,
          address: form.address,
          gender: form.gender,
          nationality: form.nationality,
          university: form.university,
          courseSlug: form.courseId,
          courseName: courseName,
          courseType: form.courseType,
          paymentMethod: form.paymentMethod,
          receiptUrl: submittedReceiptUrl,
          marketingSource: form.marketingSource || "Direct",
          submittedAt: new Date().toISOString(),
          status: "pending_sync",
          read: false,
        };
        const existing = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
        localStorage.setItem("adminNotifications", JSON.stringify([localApp, ...existing]));
        localStorage.setItem("pendingApplications", JSON.stringify([
          localApp,
          ...JSON.parse(localStorage.getItem("pendingApplications") || "[]"),
        ]));
        addApplicationSupabase({
          id: localApp.id,
          fullName: localApp.fullName,
          email: localApp.email,
          phone: localApp.phone,
          telegramHandle: localApp.telegramHandle,
          address: localApp.address,
          gender: localApp.gender,
          nationality: localApp.nationality,
          university: localApp.university,
          dateOfBirth: form.dateOfBirth || "",
          courseSlug: localApp.courseSlug,
          courseName: localApp.courseName,
          courseType: form.courseType,
          paymentMethod: form.paymentMethod,
          receiptUrl: submittedReceiptUrl,
          marketingSource: localApp.marketingSource,
          submittedAt: localApp.submittedAt,
          status: "new",
          read: false,
        });
        // ── mark as applied so future attempts are blocked ───────────────
        markAsApplied(form.email, effectiveCourseId);
        // ─────────────────────────────────────────────────────────────────
        toast.success("Application Submitted Successfully!");
        const locale = (params.locale as string) || "en";
        const searchParams = new URLSearchParams();
        searchParams.set("courseId", form.courseId);
        handleReset();
        router.push(`/${locale}/applications/success?${searchParams.toString()}`);
      } catch (_) {
        toast.error("Failed to save application. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    try {
      const formData = new FormData();
      formData.append("courseId", form.courseId);
      formData.append("courseType", form.courseType);
      formData.append("paymentMethod", form.paymentMethod);
      if (submittedReceiptUrl) formData.append("receiptUrl", submittedReceiptUrl);
      if (receiptFile) formData.append("receipt", receiptFile);
      formData.append("marketingSource", form.marketingSource || "Direct");
      formData.append("fullName", form.fullName);
      if (form.dateOfBirth) formData.append("dateOfBirth", new Date(form.dateOfBirth).toISOString());
      if (form.gender) formData.append("gender", form.gender);
      if (form.nationality) formData.append("nationality", form.nationality);
      formData.append("university", form.university);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("telegramHandle", form.telegramHandle);
      formData.append("address", form.address);
      const response = await fetch(`${API_BASE_URL}/applications/with-receipt`, {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
        body: formData,
      });
      const responseData = await response.json();
      if (!response.ok) {
        // ── specific message for duplicate detected by the backend ──────
        if (response.status === 409) {
          setValidationErrors([
            `You have already applied for ${courseName || "this course"} with this email address. Each email can only submit one application per course.`,
          ]);
          // Persist locally so the next attempt is caught before hitting the API
          markAsApplied(form.email, effectiveCourseId);
          return;
        }
        // ─────────────────────────────────────────────────────────────────────
        throw new Error(responseData.message || "Failed to submit application. Please check your inputs.");
      }

      // Write notification to localStorage so admin sees it immediately
      try {
        const notification = {
          id: responseData.id || `local-${Date.now()}`,
          fullName: form.fullName,
          email: form.email,
          courseId: form.courseId,
          courseName: courseName,
          submittedAt: new Date().toISOString(),
          read: false,
        };
        const existing = JSON.parse(localStorage.getItem("adminNotifications") || "[]");
        localStorage.setItem("adminNotifications", JSON.stringify([notification, ...existing]));
      } catch (_) {}

      // Also persist to Supabase so the admin panel/bell on ANY device sees it
      addApplicationSupabase({
        id: responseData.id || `local-${Date.now()}`,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        telegramHandle: form.telegramHandle,
        address: form.address,
        gender: form.gender,
        nationality: form.nationality,
        university: form.university,
        dateOfBirth: form.dateOfBirth || "",
        courseSlug: form.courseId,
        courseName: courseName,
        courseType: form.courseType,
        paymentMethod: form.paymentMethod,
        receiptUrl: submittedReceiptUrl,
        marketingSource: form.marketingSource || "Direct",
        submittedAt: new Date().toISOString(),
        status: "new",
        read: false,
      });

      // ── mark as applied on successful API submission ─────────────────
      markAsApplied(form.email, effectiveCourseId);
      // ─────────────────────────────────────────────────────────────────────
      toast.success("Application Submitted Successfully!");
      const submittedCourseId = form.courseId;
      const submittedAppId = responseData.id;
      handleReset();
      const locale = (params.locale as string) || "en";
      const searchParams = new URLSearchParams();
      searchParams.set("courseId", submittedCourseId);
      if (submittedAppId) searchParams.set("applicationId", submittedAppId);
      router.push(`/${locale}/applications/success?${searchParams.toString()}`);
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="py-10 px-4 lg:px-10">
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
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t("title")}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {courseName ? `Applying for: ${courseName}` : "Complete all steps to submit your application"}
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
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("userInfo")}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="fullName" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            {t("fields.name.label")} <span className="text-red-500">*</span>
                          </label>
                          <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} placeholder={t("fields.name.placeholder")} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>

                        <div className="relative">
                          <label htmlFor="gender" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            {t("fields.gender.label")} <span className="text-red-500">*</span>
                          </label>
                          <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm">
                            <option value="">{t("select")}</option>
                            <option value="Male">{t("fields.gender.options.male")}</option>
                            <option value="Female">{t("fields.gender.options.female")}</option>
                          </select>
                          <ArrowDown className="absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
                        </div>
                        <div>
                          <label htmlFor="nationality" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{t("fields.nationality.label")}</label>
                          <input id="nationality" name="nationality" value={form.nationality} onChange={handleChange} placeholder={t("fields.nationality.placeholder")} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            {t("fields.email.label")} <span className="text-red-500">*</span>
                          </label>
                          <input id="email" name="email" value={form.email} onChange={handleChange} placeholder="john.doe@example.com" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            {t("fields.phone.label")} <span className="text-red-500">*</span>
                          </label>
                          <input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder={t("fields.phone.placeholder")} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>
                        <div>
                          <label htmlFor="telegramHandle" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            {t("fields.telegram.label")} <span className="text-red-500">*</span>
                          </label>
                          <input id="telegramHandle" name="telegramHandle" value={form.telegramHandle} onChange={handleChange} placeholder={t("fields.telegram.placeholder")} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm" />
                        </div>

                        <div className="md:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            {t("fields.address.label")} <span className="text-red-500">*</span>
                          </label>
                          <textarea id="address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, City, Country" rows={3} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm resize-none" />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <button type="button" onClick={handleNext} className="inline-flex items-center bg-[#2196F3] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm">
                          {t("next")} <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <button type="button" onClick={handleBack} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" aria-label={t("backButton")}>
                          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                          <span className="text-[#2196F3] font-bold text-sm">2</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t("billingInfo")}</h3>
                      </div>
                      {/* Course field — full width, fetched by course ID */}
                      <div className="mb-5">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                          Course <span className="text-red-500">*</span>
                        </label>
                        <div className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-900/60 transition-all duration-200 ${
                          isCourseLoading
                            ? "border-blue-200 dark:border-blue-800"
                            : !form.courseId && !courseName
                            ? "border-red-300 dark:border-red-700"
                            : "border-gray-300 dark:border-gray-600"
                        }`}>
                          {isCourseLoading ? (
                            <div className="flex items-center gap-2 text-sm text-blue-500 dark:text-blue-400">
                              <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                              </svg>
                              <span>Fetching course details…</span>
                            </div>
                          ) : !form.courseId && !courseName ? (
                            <p className="text-sm text-red-500 dark:text-red-400">Course not found — please go back and try again.</p>
                          ) : (
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#2196F3]/10 dark:bg-[#2196F3]/20 flex items-center justify-center shrink-0">
                                  <svg className="w-4 h-4 text-[#2196F3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 truncate">
                                    {courseName || "—"}
                                  </p>
                                  {courseCategory && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2196F3]/10 text-[#2196F3] dark:bg-[#2196F3]/20 mt-0.5">
                                      {courseCategory}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {coursePrice !== null && (
                                <div className="text-right shrink-0">
                                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-none mb-0.5">Price</p>
                                  <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
                                    {coursePrice === 0 ? "Free" : `${coursePrice.toLocaleString()} ETB`}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Course type — VIP / One to One / Other */}
                      <div className="relative mt-5">
                        <label htmlFor="courseType" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                          Course Type <span className="text-red-500">*</span>
                        </label>
                        <select id="courseType" name="courseType" value={form.courseType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm">
                          <option value="">Select course type</option>
                          <option value="VIP">VIP</option>
                          <option value="One to One">One to One</option>
                          <option value="Other">Other</option>
                        </select>
                        <ArrowDown className="absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
                      </div>

                      {/* Payment method — Telebirr / CBE Birr / Bank Transfer */}
                      <div className="relative mt-5">
                        <label htmlFor="paymentMethod" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                          Payment Method <span className="text-red-500">*</span>
                        </label>
                        <select id="paymentMethod" name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm">
                          <option value="">Select payment method</option>
                          <option value="Commercial Bank of Ethiopia (CBE)">Commercial Bank of Ethiopia (CBE)</option>
                          <option value="Telebirr">Telebirr</option>
                        </select>
                        <ArrowDown className="absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
                      </div>

                      {/* Bank account details — shows only the account for the selected payment method */}
                      <div className="mt-6 rounded-xl border border-[#2196F3]/30 bg-[#2196F3]/5 p-4 space-y-3">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          Please transfer the exact course fee to our official account below:
                        </p>
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                          {form.paymentMethod === "Commercial Bank of Ethiopia (CBE)" && (
                            <div>
                              <p className="font-semibold text-[#2196F3]">Commercial Bank of Ethiopia (CBE)</p>
                              <p>Account Name: Yonas Negese</p>
                              <p>Account Number: 1000783760448</p>
                            </div>
                          )}
                          {form.paymentMethod === "Telebirr" && (
                            <div>
                              <p className="font-semibold text-[#2196F3]">Telebirr</p>
                              <p>Name: Yonas Negese</p>
                              <p>Number: 0955935455</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Upload payment receipt */}
                      <div className="mt-4">
                        <label htmlFor="receipt" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                          Upload a screenshot or photo of your bank receipt <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="receipt"
                          name="receipt"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleReceiptChange}
                          className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#2196F3] file:text-white file:font-semibold file:cursor-pointer hover:file:bg-blue-600 border border-gray-300 dark:border-gray-600 rounded-xl px-2 py-2 file:bg-[#2196F3]"
                        />
                        {receiptUrl && (
                          <div className="mt-3">
                            <img
                              src={receiptUrl}
                              alt="Payment receipt preview"
                              className="max-h-48 rounded-xl border border-gray-200 dark:border-gray-700 object-contain"
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{receiptFile?.name}</p>
                          </div>
                        )}
                      </div>

                      <div className="relative mt-5">
                        <label htmlFor="marketingSource" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">{t("fields.referral.label")}</label>
                        <select id="marketingSource" name="marketingSource" value={form.marketingSource} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm">
                          <option value="">{t("choose")}</option>
                          <option value="facebook">{t("fields.referral.options.facebook")}</option>
                          <option value="telegram">{t("fields.referral.options.telegram")}</option>
                          <option value="friend">{t("fields.referral.options.friend")}</option>
                          <option value="search">{t("fields.referral.options.search")}</option>
                          <option value="instagram">{t("instagram")}</option>
                          <option value="other">{t("other")}</option>
                        </select>
                        <ArrowDown className="absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4" />
                      </div>
                      <div className="space-y-3 mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-[#2196F3]" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {t("fields.agreeTermsfirst")}{" "}
                            <Link href="/terms" className="text-[#2196F3] hover:underline font-medium">{t("fields.terms")}</Link>{" "}
                            {t("fields.agreeTermslast")}
                          </span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" name="confirmAccuracy" checked={form.confirmAccuracy} onChange={handleChange} className="mt-0.5 w-4 h-4 accent-[#2196F3]" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{t("fields.confirmAccuracy")}</span>
                        </label>
                      </div>
                      <div className="flex justify-between mt-8 gap-4">
                        <button type="button" onClick={handleReset} className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-all duration-200">
                          {t("reset")}
                        </button>
                        <button type="submit" onClick={handleSubmitApplication} className="inline-flex items-center justify-center bg-[#2196F3] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting || isCourseLoading}>
                          {isSubmitting ? t("submitting") : (<>{t("submit")} <CheckCircle className="ml-2 w-4 h-4" /></>)}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ApplicationForm;

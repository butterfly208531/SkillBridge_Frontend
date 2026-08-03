"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  UploadCloud,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Navbar } from "@/app/[locale]/components/navbar";
import Footer from "@/app/[locale]/components/footer";
import LeftPanel from "./LeftPanel";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

const ApplicationForm = () => {
  const t = useTranslations("applicationForm");
  const pathname = usePathname();
  const slug = decodeURIComponent(pathname.split("/").slice(-2, -1)[0]);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    courseId: slug ? slug : "",
    paymentMethod: "",
    paymentOption: "",
    receipt: null as File | null,
    paymentReference: "",
    marketingSource: "",
    agreeTerms: false,
    confirmAccuracy: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coursePrice, setCoursePrice] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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
    const fetchCourseDetailsBySlug = async () => {
      if (!slug || !API_BASE_URL) return;
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Authentication required to load course details. Please log in.");
        setCoursePrice(null);
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/courses`, {
          method: "GET",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          let errorMessage = "Failed to fetch all courses.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = `Failed to fetch all courses: ${response.status} ${response.statusText}`;
          }
          if (response.status === 401) {
            toast.error(`Session expired or unauthorized: ${errorMessage}. Please log in again.`);
          } else {
            toast.error(errorMessage);
          }
          throw new Error(errorMessage);
        }
        const allCourses = await response.json();
        let foundCourse = null;
        for (const course of allCourses) {
          const generatedSlug = slugify(course.id);
          if (generatedSlug === slug) {
            foundCourse = course;
            break;
          }
        }
        if (foundCourse) {
          const priceToUse = foundCourse.priceDiscounted > 0 ? foundCourse.priceDiscounted : foundCourse.priceOriginal;
          setCoursePrice(priceToUse);
          setForm((prev) => ({ ...prev, courseId: foundCourse.id }));
          setCourseName(foundCourse.title);
        } else {
          toast.error(`Course with slug "${slug}" not found.`);
          setCoursePrice(null);
          setForm((prev) => ({ ...prev, courseId: "" }));
        }
      } catch (error: any) {
        console.error("Error fetching course details by slug:", error);
        toast.error(error.message || "An unexpected error occurred while loading course details.");
      }
    };
    fetchCourseDetailsBySlug();
  }, [slug, API_BASE_URL]);

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

  const validateStep1 = () => {
    const errors: string[] = [];
    if (!form.fullName) errors.push("Full Name is required.");
    if (!form.email) errors.push("Email Address is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push("Invalid Email Address.");
    if (!form.phone) errors.push("Phone Number is required.");
    if (!form.telegramHandle) errors.push("Telegram Handle is required.");
    if (!form.university) errors.push("University is required.");
    if (!form.address) errors.push("Address is required.");
    if (!form.dateOfBirth) errors.push("Date of Birth is required.");
    if (!form.gender) errors.push("Gender is required.");
    if (errors.length > 0) { setValidationErrors(errors); return false; }
    return true;
  };

  const validateStep2 = () => {
    const errors: string[] = [];
    if (!form.courseId) errors.push("Course is not selected.");
    if (!form.paymentMethod) errors.push("Payment Method is required.");
    if (!form.paymentOption) errors.push("Payment Option is required.");
    if (!form.paymentReference) errors.push("Payment Reference (Transaction ID) is required.");
    if (form.paymentMethod !== "cash" && !form.receipt)
      errors.push('Payment Receipt is required for the selected method. If paying cash, select "Cash Payment".');
    if (!form.agreeTerms) errors.push("You must agree to the Terms and Conditions.");
    if (!form.confirmAccuracy) errors.push("You must confirm the accuracy of the information.");
    if (errors.length > 0) { setValidationErrors(errors); return false; }
    return true;
  };

  const handleNext = () => { if (validateStep1()) setCurrentStep(2); };
  const handleBack = () => setCurrentStep(1);

  const handleReset = () => {
    setForm({
      fullName: "", dateOfBirth: "", gender: "", nationality: "", email: "",
      phone: "", telegramHandle: "", university: "", address: "", courseId: "",
      paymentMethod: "", paymentOption: "", receipt: null, paymentReference: "",
      marketingSource: "", agreeTerms: false, confirmAccuracy: false,
    });
    setCourseName("");
    setCurrentStep(1);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    if (form.courseId && courseName) {
      const basicCourseInfo = { id: form.courseId, title: courseName, price: coursePrice };
      sessionStorage.setItem("lastEnrolledCourse", JSON.stringify(basicCourseInfo));
      localStorage.setItem(`course-${form.courseId}`, JSON.stringify(basicCourseInfo));
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("courseId", form.courseId);
      formData.append("paymentMethod", form.paymentMethod);
      formData.append("paymentReference", form.paymentReference);
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
      formData.append("paymentOption", form.paymentOption);
      if (form.receipt) {
        formData.append("receipt", form.receipt);
      } else {
        toast.error("Payment receipt is required.");
        setIsSubmitting(false);
        return;
      }
      const response = await fetch(`${API_BASE_URL}/applications/with-receipt`, {
        method: "POST",
        headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` },
        body: formData,
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to submit application. Please check your inputs.");
      }
      toast.success("Application Submitted Successfully!");
      handleReset();
      const params = new URLSearchParams();
      params.set("courseId", form.courseId);
      if (responseData.id) params.set("applicationId", responseData.id);
      router.push(`/applications/success?${params.toString()}`);
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions: Record<string, string> = {
    telebirr: "to: Ibrahim Ghazali\n0960171717",
    cbe: "to: Ibrahim Ghazali\n100041753914",
    boa: "to: Ibrahim Ghazali\nXXXXXXXXXXX",
    awash: "to: Ibrahim Ghazali\nXXXXXXXXXXX",
    cash: "Pay at our office. No receipt upload required for this method.",
  };

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
        <div className='flex flex-col lg:flex-row min-h-[calc(100vh-80px)]'>
          <LeftPanel />
          <div className='flex-1 py-10 px-4 lg:px-10 overflow-y-auto bg-white dark:bg-gray-900'>
            <Toaster position='top-right' reverseOrder={false} />
            {validationErrors.length > 0 && (
              <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'>
                <div className='bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-red-100 dark:border-red-900/40'>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0'>
                      <svg className='w-5 h-5 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z' />
                      </svg>
                    </div>
                    <div>
                      <h3 className='text-base font-semibold text-gray-900 dark:text-gray-50'>Please fix the following</h3>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{validationErrors.length} field{validationErrors.length > 1 ? "s" : ""} need attention</p>
                    </div>
                  </div>
                  <ul className='space-y-2 mb-6'>
                    {validationErrors.map((err, i) => (
                      <li key={i} className='flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300'>
                        <span className='mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0' />
                        {err}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setValidationErrors([])} className='w-full bg-[#2196F3] hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm'>
                    Got it, I&apos;ll fix these
                  </button>
                </div>
              </div>
            )}
            <div className='max-w-4xl mx-auto'>
              <div className='text-center mb-8'>
                <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white mb-2'>{t("title")}</h2>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  {courseName ? `Applying for: ${courseName}` : "Complete all steps to submit your application"}
                </p>
              </div>
              <div className='flex items-center justify-center mb-10'>
                {[1, 2].map((step) => (
                  <div key={step} className='flex items-center'>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                      currentStep === step ? "bg-[#2196F3] text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                      : currentStep > step ? "bg-green-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                    }`}>
                      {currentStep > step ? <CheckCircle className='w-5 h-5' /> : step}
                    </div>
                    <div className='ml-2 mr-6'>
                      <p className={`text-xs font-semibold ${currentStep === step ? "text-[#2196F3]" : "text-gray-400"}`}>
                        {step === 1 ? "Personal Info" : "Payment Info"}
                      </p>
                    </div>
                    {step < 2 && <div className={`w-16 h-0.5 mr-6 transition-all duration-300 ${currentStep > 1 ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`} />}
                  </div>
                ))}
              </div>
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden'>
                <form onSubmit={(e) => e.preventDefault()} className='p-8 space-y-8'>

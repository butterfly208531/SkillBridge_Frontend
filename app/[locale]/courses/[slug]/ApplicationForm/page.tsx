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
          console.error(
            "Failed to parse currentUser from sessionStorage:",
            error
          );
        }
      }
    }
  }, []);
  useEffect(() => {
    const fetchCourseDetailsBySlug = async () => {
      if (!slug || !API_BASE_URL) return;

      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error(
          "Authentication required to load course details. Please log in."
        );
        setCoursePrice(null);
        return;
      }

      try {
        console.log("Attempting to fetch all courses for URL slug:", slug);
        const response = await fetch(`${API_BASE_URL}/courses`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          let errorMessage = "Failed to fetch all courses.";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (jsonError) {
            errorMessage = `Failed to fetch all courses: ${response.status} ${response.statusText}`;
          }

          if (response.status === 401) {
            toast.error(
              `Session expired or unauthorized: ${errorMessage}. Please log in again.`
            );
          } else {
            toast.error(errorMessage);
          }
          throw new Error(errorMessage);
        }

        const allCourses = await response.json();
        console.log("Fetched all courses:", allCourses);

        let foundCourse = null;
        for (const course of allCourses) {
          const generatedSlug = slugify(course.id);
          console.log(
            `Comparing URL slug "${slug}" with generated slug "${generatedSlug}" from title "${course.title}"`
          );
          if (generatedSlug === slug) {
            foundCourse = course;
            break;
          }
        }

        if (foundCourse) {
          const priceToUse =
            foundCourse.priceDiscounted > 0
              ? foundCourse.priceDiscounted
              : foundCourse.priceOriginal;
          setCoursePrice(priceToUse);
          setForm((prev) => ({ ...prev, courseId: foundCourse.id }));
          setCourseName(foundCourse.title);
          console.log(
            `Course found! ID: ${foundCourse.id}, Price: ${priceToUse}`
          );
        } else {
          toast.error(
            `Course with slug "${slug}" not found. Please ensure the course exists.`
          );
          setCoursePrice(null);
          setForm((prev) => ({ ...prev, courseId: "" }));
          console.warn(
            `Course with slug "${slug}" not found in fetched courses.`
          );
        }
      } catch (error: any) {
        console.error("Error fetching course details by slug:", error);
        toast.error(
          error.message ||
            "An unexpected error occurred while loading course details."
        );
      }
    };
    fetchCourseDetailsBySlug();
  }, [slug, API_BASE_URL]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      setForm((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep1 = () => {
    const errors: string[] = [];

    if (!form.fullName) errors.push("Full Name is required.");
    if (!form.email) errors.push("Email Address is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.push("Invalid Email Address.");
    if (!form.phone) errors.push("Phone Number is required.");
    if (!form.telegramHandle) errors.push("Telegram Handle is required.");
    if (!form.university) errors.push("University is required.");
    if (!form.address) errors.push("Address is required.");
    if (!form.dateOfBirth) errors.push("Date of Birth is required.");
    if (!form.gender) errors.push("Gender is required.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  };
  const validateStep2 = () => {
    const errors: string[] = [];

    if (!form.courseId) errors.push("Course is not selected.");
    if (!form.paymentMethod) errors.push("Payment Method is required.");
    if (!form.paymentOption) errors.push("Payment Option is required.");
    if (!form.paymentReference)
      errors.push("Payment Reference (Transaction ID) is required.");
    if (form.paymentMethod !== "cash" && !form.receipt)
      errors.push(
        'Payment Receipt is required for the selected method. If paying cash, select "Cash Payment".'
      );

    if (!form.agreeTerms)
      errors.push("You must agree to the Terms and Conditions.");
    if (!form.confirmAccuracy)
      errors.push("You must confirm the accuracy of the information.");

    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }

    // Store course data before submission
    if (form.courseId && courseName) {
      const basicCourseInfo = {
        id: form.courseId,
        title: courseName,
        price: coursePrice,
      };
      sessionStorage.setItem('lastEnrolledCourse', JSON.stringify(basicCourseInfo));
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
      if (form.dateOfBirth) {
        formData.append(
          "dateOfBirth",
          new Date(form.dateOfBirth).toISOString()
        );
      }
      if (form.gender) {
        formData.append("gender", form.gender);
      }
      if (form.nationality) {
        formData.append("nationality", form.nationality);
      }
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

      const response = await fetch(
        `${API_BASE_URL}/applications/with-receipt`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Application submission failed:", responseData);
        throw new Error(
          responseData.message ||
            "Failed to submit application. Please check your inputs."
        );
      }

      toast.success("Application Submitted Successfully!");
      console.log("Application Process Completed:", responseData);
      handleReset();


      // Redirect with proper parameters
      const params = new URLSearchParams();
      params.set("courseId", form.courseId);
      if (responseData.id) {
        params.set("applicationId", responseData.id);
      }

      router.push(`/applications/success?${params.toString()}`);
    } catch (error: any) {
      console.error("Application submission error:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      fullName: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      email: "",
      phone: "",
      telegramHandle: "",
      university: "",
      address: "",
      courseId: "",
      paymentMethod: "",
      paymentOption: "",
      receipt: null,
      paymentReference: "",
      marketingSource: "",
      agreeTerms: false,
      confirmAccuracy: false,
    });
    setCourseName("");
    setCurrentStep(1);
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

        {/* Split layout */}
        <div className='flex flex-col lg:flex-row min-h-[calc(100vh-80px)]'>

          <LeftPanel />

          {/* Right panel: the form */}
          <div className='flex-1 py-10 px-4 lg:px-10 overflow-y-auto bg-white dark:bg-gray-900'>
        <Toaster position='top-right' reverseOrder={false} />

        {/* Validation error modal */}
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
              <button
                onClick={() => setValidationErrors([])}
                className='w-full bg-[#2196F3] hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 text-sm'
              >
                Got it, I'll fix these
              </button>
            </div>
          </div>
        )}
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-extrabold text-gray-900 dark:text-white mb-2'>
              {t("title")}
            </h2>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              {courseName ? `Applying for: ${courseName}` : "Complete all steps to submit your application"}
            </p>
          </div>

          {/* Step indicator */}
          <div className='flex items-center justify-center mb-10'>
            {[1, 2].map((step) => (
              <div key={step} className='flex items-center'>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-300 ${
                  currentStep === step
                    ? "bg-[#2196F3] text-white shadow-lg shadow-blue-200 dark:shadow-blue-900"
                    : currentStep > step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <div className='ml-2 mr-6'>
                  <p className={`text-xs font-semibold ${currentStep === step ? "text-[#2196F3]" : "text-gray-400"}`}>
                    {step === 1 ? "Personal Info" : "Payment Info"}
                  </p>
                </div>
                {step < 2 && (
                  <div className={`w-16 h-0.5 mr-6 transition-all duration-300 ${currentStep > 1 ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                )}
              </div>
            ))}
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden'>

          <form onSubmit={(e) => e.preventDefault()} className='p-8 space-y-8'>
            {currentStep === 1 && (
              <div>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center'>
                    <span className='text-[#2196F3] font-bold text-sm'>1</span>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                    {t("userInfo")}
                  </h3>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <label htmlFor='fullName' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.name.label")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='fullName'
                      name='fullName'
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder={t("fields.name.placeholder")}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                  <div>
                    <label htmlFor='dateOfBirth' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.dob.label")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      type='date'
                      id='dateOfBirth'
                      name='dateOfBirth'
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                  <div className='relative'>
                    <label htmlFor='gender' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.gender.label")} <span className='text-red-500'>*</span>
                    </label>
                    <select
                      id='gender'
                      name='gender'
                      value={form.gender}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    >
                      <option value=''>{t("select")}</option>
                      <option value='Male'>{t("fields.gender.options.male")}</option>
                      <option value='Female'>{t("fields.gender.options.female")}</option>
                      <option value='Other'>{t("other")}</option>
                    </select>
                    <ArrowDown className='absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4' />
                  </div>
                  <div>
                    <label htmlFor='nationality' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.nationality.label")}
                    </label>
                    <input
                      id='nationality'
                      name='nationality'
                      value={form.nationality}
                      onChange={handleChange}
                      placeholder={t("fields.nationality.placeholder")}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.email.label")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='email'
                      name='email'
                      value={form.email}
                      onChange={handleChange}
                      placeholder='john.doe@example.com'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                  <div>
                    <label htmlFor='phone' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.phone.label")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='phone'
                      name='phone'
                      value={form.phone}
                      onChange={handleChange}
                      placeholder={t("fields.phone.placeholder")}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                  <div>
                    <label htmlFor='telegramHandle' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.telegram.label")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='telegramHandle'
                      name='telegramHandle'
                      value={form.telegramHandle}
                      onChange={handleChange}
                      placeholder={t("fields.telegram.placeholder")}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                  <div>
                    <label htmlFor='university' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.university.label")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='university'
                      name='university'
                      value={form.university}
                      onChange={handleChange}
                      placeholder='Addis Ababa University'
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label htmlFor='address' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.address.label")} <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      id='address'
                      name='address'
                      value={form.address}
                      onChange={handleChange}
                      placeholder='123 Main St, City, Country'
                      rows={3}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm resize-none'
                    />
                  </div>
                </div>
                <div className='flex justify-end mt-6'>
                  <button
                    type='button'
                    onClick={handleNext}
                    className='inline-flex items-center bg-[#2196F3] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm'
                  >
                    {t("next")} <ArrowRight className='ml-2 w-4 h-4' />
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className='flex items-center gap-3 mb-6'>
                  <button
                    type='button'
                    onClick={handleBack}
                    className='w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                    aria-label={t("backButton")}
                  >
                    <ArrowLeft className='w-4 h-4 text-gray-600 dark:text-gray-300' />
                  </button>
                  <div className='w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center'>
                    <span className='text-[#2196F3] font-bold text-sm'>2</span>
                  </div>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
                    {t("billingInfo")}
                  </h3>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <label htmlFor='courseId' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      Selected Course
                    </label>
                    <input
                      id='courseId'
                      name='courseId'
                      value={courseName || "Loading course..."}
                      readOnly
                      className={`w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 shadow-sm dark:text-gray-100 text-sm ${
                        courseName ? "border-green-400 dark:border-green-500" : "border-gray-300 dark:border-gray-600"
                      }`}
                    />
                    {coursePrice && courseName && (
                      <p className='mt-1.5 text-sm text-green-600 dark:text-green-400 font-semibold'>
                        Price: {coursePrice} ETB
                      </p>
                    )}
                  </div>
                  <div className='relative'>
                    <label htmlFor='paymentMethod' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.paymentMethod.label")} <span className='text-red-500'>*</span>
                    </label>
                    <select
                      id='paymentMethod'
                      name='paymentMethod'
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    >
                      <option value=''>{t("selectPaymentMethod")}</option>
                      <option value='telebirr'>{t("fields.paymentMethod.options.telebirr")}</option>
                      <option value='cbe'>{t("fields.paymentMethod.options.cbe")}</option>
                      <option value='boa'>{t("fields.paymentMethod.options.boa")}</option>
                      <option value='awash'>{t("fields.paymentMethod.options.awash")}</option>
                      <option value='cash'>{t("cashPayment")}</option>
                    </select>
                    <ArrowDown className='absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4' />
                    {form.paymentMethod && (
                      <div className='mt-2 text-xs text-gray-700 dark:text-gray-200 whitespace-pre-line bg-blue-50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 px-3 py-2 rounded-lg'>
                        {paymentOptions[form.paymentMethod as keyof typeof paymentOptions]}
                      </div>
                    )}
                  </div>
                  <div className='relative'>
                    <label htmlFor='paymentOption' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.paymentOption.label")} <span className='text-red-500'>*</span>
                    </label>
                    <select
                      id='paymentOption'
                      name='paymentOption'
                      value={form.paymentOption}
                      onChange={handleChange}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    >
                      <option value=''>{t("select")}</option>
                      <option value='one-time'>{t("fields.paymentOption.options.one-time")}</option>
                      <option value='installment'>{t("installment")}</option>
                    </select>
                    <ArrowDown className='absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4' />
                  </div>
                  <div>
                    <label htmlFor='uploadReceipt' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.receipt.label")} <span className='text-red-500'>*</span>
                    </label>
                    <div className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 flex items-center gap-3'>
                      <input type='file' id='uploadReceipt' name='receipt' onChange={handleChange} className='hidden' accept='image/*,application/pdf' />
                      <label htmlFor='uploadReceipt' className='inline-flex items-center px-3 py-1.5 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold text-[#2196F3] bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 cursor-pointer transition-colors'>
                        <UploadCloud className='mr-1.5 h-4 w-4' />
                        {t("chooseFile")}
                      </label>
                      <span className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                        {form.receipt ? `${form.receipt.name} (${(form.receipt.size / 1024 / 1024).toFixed(2)} MB)` : t("noFileChosen")}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor='paymentReference' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                      {t("fields.transactionId.label")} <span className='text-red-500'>*</span>
                    </label>
                    <input
                      id='paymentReference'
                      name='paymentReference'
                      value={form.paymentReference}
                      onChange={handleChange}
                      placeholder={t("fields.transactionId.placeholder")}
                      className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                    />
                  </div>
                </div>

                <div className='relative mt-5'>
                  <label htmlFor='marketingSource' className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                    {t("fields.referral.label")}
                  </label>
                  <select
                    id='marketingSource'
                    name='marketingSource'
                    value={form.marketingSource}
                    onChange={handleChange}
                    className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 dark:text-gray-100 appearance-none pr-12 focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 text-sm'
                  >
                    <option value=''>{t("choose")}</option>
                    <option value='facebook'>{t("fields.referral.options.facebook")}</option>
                    <option value='telegram'>{t("fields.referral.options.telegram")}</option>
                    <option value='friend'>{t("fields.referral.options.friend")}</option>
                    <option value='search'>{t("fields.referral.options.search")}</option>
                    <option value='instagram'>{t("instagram")}</option>
                    <option value='other'>{t("other")}</option>
                  </select>
                  <ArrowDown className='absolute right-3 top-[42px] text-gray-400 dark:text-gray-500 pointer-events-none w-4 h-4' />
                </div>

                <div className='space-y-3 mt-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700'>
                  <label className='flex items-start gap-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      name='agreeTerms'
                      checked={form.agreeTerms}
                      onChange={handleChange}
                      className='mt-0.5 w-4 h-4 accent-[#2196F3]'
                    />
                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                      {t("fields.agreeTermsfirst")}{" "}
                      <a href='/terms' className='text-[#2196F3] hover:underline font-medium'>
                        {t("fields.terms")}
                      </a>{" "}
                      {t("fields.agreeTermslast")}
                    </span>
                  </label>
                  <label className='flex items-start gap-3 cursor-pointer'>
                    <input
                      type='checkbox'
                      name='confirmAccuracy'
                      checked={form.confirmAccuracy}
                      onChange={handleChange}
                      className='mt-0.5 w-4 h-4 accent-[#2196F3]'
                    />
                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                      {t("fields.confirmAccuracy")}
                    </span>
                  </label>
                </div>

                <div className='flex justify-between mt-8 gap-4'>
                  <button
                    type='button'
                    onClick={handleReset}
                    className='inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium text-sm transition-all duration-200'
                  >
                    {t("reset")}
                  </button>
                  <button
                    type='submit'
                    onClick={handleSubmitApplication}
                    className='inline-flex items-center justify-center bg-[#2196F3] text-white px-8 py-3 rounded-xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("submitting") : (
                      <>{t("submit")} <CheckCircle className='ml-2 w-4 h-4' /></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
          </div>  {/* end right panel */}
        </div>  {/* end split layout */}
      </div>
      <Footer />
    </>
  );
};

export default ApplicationForm;

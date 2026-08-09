"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function SuccessPage() {
  const t = useTranslations("SuccessPage");
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. First try to get from session storage
        const sessionCourse = sessionStorage.getItem("lastEnrolledCourse");
        if (sessionCourse) {
          const parsedCourse = JSON.parse(sessionCourse);
          if (!courseId || parsedCourse.id === courseId) {
            setCourse(parsedCourse);
            return;
          }
        }

        // 2. Validate courseId
        if (!courseId) {
          throw new Error(t("noCourseId"));
        }

        // 3. Try to fetch from API with error timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

        const response = await fetch(`/api/courses/${courseId}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          // 4. If API fails, check localStorage for basic info
          const localCourse = localStorage.getItem(`course-${courseId}`);
          if (localCourse) {
            setCourse(JSON.parse(localCourse));
            return;
          }
          throw new Error(t("courseFetchError"));
        }

        const courseData = await response.json();
        setCourse(courseData);

        // 5. Store data for future fallbacks
        sessionStorage.setItem(
          "lastEnrolledCourse",
          JSON.stringify(courseData)
        );
        localStorage.setItem(
          `course-${courseId}`,
          JSON.stringify({
            id: courseId,
            title: courseData.title || "Course",
            instructor: courseData.instructor?.name || "Instructor",
            startDate: courseData.startDate || "To be announced",
            duration: courseData.duration || "",
          })
        );
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMessage =
          err instanceof Error
            ? err.name === "AbortError"
              ? t("timeoutError")
              : err.message
            : t("unknownError");
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup if component unmounts
    };
  }, [courseId, t]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto'></div>
          <p className='mt-4 text-gray-600 dark:text-gray-300'>
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center'>
          <div className='text-red-500 dark:text-red-400 mb-4'>
            <svg
              className='w-12 h-12 mx-auto'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              ></path>
            </svg>
            <p className='mt-2 font-medium'>{error || t("courseNotFound")}</p>
          </div>
          <div className='flex justify-center gap-3 mt-6'>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm'
            >
              {t("tryAgain")}
            </button>
            <Link
              href='/courses'
              className='px-4 py-2 border hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm'
            >
              {t("browseCourses")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden'>
          {/* Header with course image */}
          <div className='relative h-40 bg-gradient-to-r from-blue-500 to-purple-600'>
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className='w-full h-full object-cover opacity-70'
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/course-placeholder.jpg";
                }}
              />
            ) : (
              <div className='w-full h-full bg-gray-200 dark:bg-gray-700'></div>
            )}
            <div className='absolute inset-0 flex items-center justify-center'>
              <CheckCircle className='h-20 w-20 text-[#17c625] drop-shadow-lg' />
            </div>
          </div>

          {/* Content */}
          <div className='p-6 sm:p-8'>
            <div className='flex justify-between items-start'>
              <div>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-white'>
                  {t("enrollmentSuccess")}
                </h1>
                <h2 className='text-xl font-semibold text-blue-600 dark:text-blue-400 mt-1'>
                  {course.title}
                </h2>
                {course.category?.name && (
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    {course.category.name}
                  </p>
                )}
              </div>
              <button
                onClick={() => router.back()}
                className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                aria-label={t("goBack")}
              >
                <ArrowLeft className='w-6 h-6' />
              </button>
            </div>


            {/* Success Message */}
            <div className='mt-8 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800'>
              <p className='text-blue-700 dark:text-blue-300 font-medium'>
                {t("confirmationMessage")}
              </p>
              <p className='text-sm text-blue-600 dark:text-blue-400 mt-2'>
                {t("additionalInstructions")}
              </p>
            </div>

            {/* Next Steps */}
            <div className='mt-8'>
              <h3 className='text-lg font-medium text-gray-800 dark:text-gray-200 mb-3'>
                {t("nextSteps")}
              </h3>
              <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
                <li className='flex items-start'>
                  <span className='text-green-500 dark:text-green-400 mr-2'>
                    ✓
                  </span>
                  <span>{t("step1")}</span>
                </li>
                <li className='flex items-start'>
                  <span className='text-green-500 dark:text-green-400 mr-2'>
                    ✓
                  </span>
                  <span>{t("step2")}</span>
                </li>
                <li className='flex items-start'>
                  <span className='text-blue-500 dark:text-blue-400 mr-2'>
                    •
                  </span>
                  <span>{t("step3")}</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className='mt-8 flex flex-wrap gap-4'>
              <Link
                href={`/courses/${course.id}`}
                className='px-6 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 text-sm font-medium'
              >
                {t("viewCourse")}
              </Link>
              <Link
                href='/'
                className='px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 text-sm font-medium'
              >
                {t("backToHome")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

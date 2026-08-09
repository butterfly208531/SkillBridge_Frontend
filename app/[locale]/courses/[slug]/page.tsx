"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  Award,
  Users,
  BookOpen,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { courseDetailsConfig } from "@/lib/course-details-config";
import { Navbar } from "../../components/navbar";
import { useEffect, useState } from "react";
import { fetchCourses, fetchCourseById, fetchCourseBySlug } from "@/lib/api";
import { getStoredCourses } from "@/lib/courses-store";

/** Normalise a string to a URL slug for loose matching */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function CourseDetailPage() {
  const t = useTranslations();
  const locale = useLocale();
  const params = useParams();
  const id = params.slug as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const courseMessages = t.raw("courseMessages") as any;

  useEffect(() => {
    const loadCourse = async () => {
      try {
        // 1. Try the dedicated single-course endpoints first (most accurate)
        let foundCourse: any = await fetchCourseBySlug(id).catch(() => null);
        if (!foundCourse) {
          foundCourse = await fetchCourseById(id).catch(() => null);
        }

        // 2. Fall back to scanning the full list — match by id, slug, or title
        if (!foundCourse) {
          const courses = await fetchCourses();
          const idSlug = toSlug(id);
          foundCourse = courses.find(
            (c: any) =>
              c.id === id ||
              c.slug === id ||
              toSlug(c.slug || "") === idSlug ||
              toSlug(c.title || "") === idSlug
          );
        }

        // 3. Try localStorage store (admin-added courses use slug as id)
        // Also resolve any admin-set prices that may have been lost in the API merge
        const stored = getStoredCourses();
        const idSlug = toSlug(id);
        const storedMatch = stored.find(
          (c) =>
            c.id === id ||
            toSlug(c.id) === idSlug ||
            toSlug(c.title) === idSlug
        );

        if (!foundCourse) {
          if (storedMatch) {
            // Shape it like a backend Course so the rest of the transform works
            foundCourse = {
              id: storedMatch.id,
              title: storedMatch.title,
              shortDescription: storedMatch.shortDescription,
              detailedDescription: "",
              imageUrl: storedMatch.adminImageUrl || storedMatch.imageUrl,
              priceOriginal: storedMatch.priceOriginal,
              priceDiscounted: storedMatch.priceDiscounted,
              duration: storedMatch.duration,
              level: "Beginner",
              rating: storedMatch.rating,
              studentsEnrolled: 0,
              startDate: storedMatch.startDate,
              category: { id: "", name: storedMatch.category, description: "", status: "" },
              instructor: { id: "", name: "Instructor", email: "", imageUrl: "", role: "", status: "" },
              modules: [],
              learningOutcomes: [],
              prerequisites: [],
            };
          }
        } else if (storedMatch) {
          // Course was found via API — but the API may return 0 for prices if it uses
          // different field names. Patch in the admin-set localStorage prices when the
          // API returns nothing useful, handling common field-name variants.
          const apiOriginal =
            foundCourse.priceOriginal ??
            foundCourse.price_original ??
            foundCourse.originalPrice ??
            foundCourse.price ??
            0;
          const apiDiscounted =
            foundCourse.priceDiscounted ??
            foundCourse.price_discounted ??
            foundCourse.discountedPrice ??
            foundCourse.monthlyPrice ??
            0;
          foundCourse = {
            ...foundCourse,
            priceOriginal:  apiOriginal  > 0 ? apiOriginal  : storedMatch.priceOriginal,
            priceDiscounted: apiDiscounted > 0 ? apiDiscounted : storedMatch.priceDiscounted,
          };
        }

        console.log("Found Course:", foundCourse);

        if (!foundCourse) {
          throw new Error("COURSE_NOT_FOUND");
        }

        // courseDetailsConfig is keyed by human-readable slug.
        // Try id first, then slug derived from the found course title.
        const titleSlug = toSlug(foundCourse.title || "");
        const courseConfig =
          courseDetailsConfig[id] ||
          courseDetailsConfig[titleSlug] ||
          courseDetailsConfig[foundCourse.slug || ""] ||
          {};

        const instructor = foundCourse.instructor || {};
        const transformedCourse = {
          ...foundCourse,
          ...courseConfig,
          image: foundCourse.imageUrl || courseConfig.image || "",
          instructorImage:
            instructor.imageUrl || courseConfig.instructorImage || "",
          category: foundCourse.category?.name || foundCourse.category || "",
          instructor: instructor.name || foundCourse.instructor || "",
          description: foundCourse.shortDescription || "",
          longDescription: foundCourse.detailedDescription || "",
          // Handle both camelCase and snake_case API field name variants
          price:
            foundCourse.priceOriginal ||
            foundCourse.price_original ||
            foundCourse.originalPrice ||
            (typeof foundCourse.price === "number" ? foundCourse.price : 0) ||
            0,
          discount:
            foundCourse.priceDiscounted ||
            foundCourse.price_discounted ||
            foundCourse.discountedPrice ||
            foundCourse.monthlyPrice ||
            0,
          learningOutcomes:
            (foundCourse.learningOutcomes || []).map((lo: any) =>
              typeof lo === "string" ? lo : lo.text
            ),
          prerequisites:
            (foundCourse.prerequisites || []).map((pre: any) =>
              typeof pre === "string" ? pre : pre.text
            ),
          curriculum:
            (foundCourse.modules || []).map((module: any) => ({
              title: module.title,
              duration: module.duration,
              lessons: (module.lessons || []).map((lesson: any) => ({
                title: lesson.title,
                duration: lesson.duration,
              })),
            })),
        };
        setCourse(transformedCourse);
      } catch (error) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, t]);

if (loading) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        {/* Back button skeleton */}
        <div className="flex items-center mb-6 w-fit">
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-2"></div>
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content skeleton */}
          <div className="lg:col-span-2">
            {/* Badges and rating skeleton */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
            </div>

            {/* Title skeleton */}
            <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>

            {/* Description skeleton */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>

            {/* Stats skeleton */}
            <div className="flex flex-wrap gap-6 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>

            {/* Image skeleton */}
            <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden mb-8 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>

            {/* Tabs skeleton */}
            <div className="mb-12">
              <div className="space-y-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                    <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border rounded-lg overflow-hidden shadow-sm">
              <div className="p-6">
                {/* Price skeleton */}
                <div className="flex items-baseline gap-2 mb-4">
                  <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
                </div>

                {/* Payment options skeleton */}
                <div className="space-y-4 mb-6">
                  <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Button skeleton */}
                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>

                {/* Features skeleton */}
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


  if (error) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <h1 className='text-3xl font-bold mb-4'>Error Loading Course</h1>
        <p className='text-gray-600 mb-8'>
          We encountered a problem loading this course. Please try again.
        </p>
        <div className='flex justify-center gap-4'>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
          <Button asChild variant='outline'>
            <Link href={`/${locale}/courses`}>Back to Courses</Link>
          </Button>
        </div>
      </div>
    );
  }


  return (
    <>
      <Navbar />
      <div className='container mx-auto px-4 py-12'>
        <Link
          href={`/${locale}/courses`}
          className='flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors mb-6 w-fit'
        >
          <ArrowLeft className='w-5 h-5 mr-2' />
          <span className='font-medium'>{courseMessages.back}</span>
        </Link>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='mb-8'>
              <div className='flex flex-wrap gap-2 mb-4'>
                <Badge className='bg-blue-500'>{course.category}</Badge>
                <Badge variant='outline'>{course.level}</Badge>
                <div className='flex items-center ml-auto'>
                  <Star className='h-4 w-4 fill-yellow-400 text-yellow-400 mr-1' />
                  <span className='font-medium'>{course.rating || 0}</span>
                  <span className='text-gray-500 ml-1'>
                    ({course.reviews} {courseMessages.reviews || 0})
                  </span>
                </div>
              </div>

              <h1 className='text-2xl sm:text-3xl font-bold mb-4'>
                {course.title}
              </h1>

              <p className='text-gray-600 mb-6'>{course.description}</p>

              <div className='flex flex-wrap gap-6 mb-6'>
                <div className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-blue-500' />
                  <span>{course.duration}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <BookOpen className='h-5 w-5 text-blue-500' />
                  <span>
                    {course.lessons} {courseMessages.lessons}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Users className='h-5 w-5 text-blue-500' />
                  <span>
                    {course.students} {courseMessages.students}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Award className='h-5 w-5 text-blue-500' />
                  <span>{courseMessages.award}</span>
                </div>
              </div>

              <div className='relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden mb-8'>
                {course?.image ? (
                  <Image
                    src={course.image}
                    alt={course.title || "Course image"}
                    fill
                    className='object-cover'
                    priority
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-gray-400'>
                    <span>No image available</span>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-8 mb-12'>
                  <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all hover:shadow-md'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800 dark:text-white'>
                      {courseMessages.tabContent.aboutCourse}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-300 mb-4 leading-relaxed'>
                      {course.longDescription || course.description}
                    </p>
                  </div>

                  <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm transition-all hover:shadow-md'>
                    <h3 className='text-xl font-bold mb-4 text-gray-800 dark:text-white'>
                      {courseMessages.tabContent.learn}
                    </h3>
                    <ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                      {course.learningOutcomes?.map(
                        (outcome: string, index: number) => (
                          <li
                            key={index}
                            className='flex items-start gap-2 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150'
                          >
                            <CheckCircle className='h-5 w-5 text-green-500 shrink-0 mt-0.5' />
                            <span className='text-gray-700 dark:text-gray-300'>
                              {outcome}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
            </div>
          </div>

          <div className='lg:col-span-1'>
            <div className='sticky top-24'>
              <div className='border rounded-lg overflow-hidden shadow-sm'>
                <div className='p-6'>
                  <div className='flex items-baseline gap-2 mb-4'>
                    <span className='text-3xl font-bold'>
                      {course.price} <span className="text-sm">{"ETB"}</span>
                    </span>
                  </div>

                  <div className='space-y-4 mb-6'>
                    <h3 className='font-bold'>
                      {courseMessages.tabContent.payOpt}
                    </h3>
                    <RadioGroup defaultValue='one-time'>
                      <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='one-time' id='one-time' />
                        <Label htmlFor='one-time'>
                          {courseMessages.tabContent.otp} (
                          {course.price} <span className="text-sm">{" ETB"} </span>
                          )
                        </Label>
                      </div>
                      {course.discount > 0 && (
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='monthly' id='monthly' />
                          <Label htmlFor='monthly'>
                            {courseMessages.tabContent.subscription} (
                            {course.discount}{" "}
                            <span className="text-sm">ETB</span>{" "}
                            {courseMessages.tabContent.perMonth}{" "}
                            {(() => {
                              const match = course.duration.match(/^(\d+)\s*(\w+)/);
                              if (!match) return course.duration;
                              return `${match[1]} ${match[2]}`;
                            })()}
                            )
                          </Label>
                        </div>
                      )}
                    </RadioGroup>
                  </div>
                  <Button asChild className='w-full mb-4' size='lg'>
                    <Link href={`/${locale}/courses/${course?.id || id}/ApplicationForm`}>
                      {courseMessages.tabContent.enroll}
                    </Link>
                  </Button>

                  <div className='text-sm text-gray-500 space-y-3'>
                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      <span>{courseMessages.tabContent.lifeTime}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Users className='h-4 w-4' />
                      <span>{courseMessages.tabContent.access}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Award className='h-4 w-4' />
                      <span>{courseMessages.award}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

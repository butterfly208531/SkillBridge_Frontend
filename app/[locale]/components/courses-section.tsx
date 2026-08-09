"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/app/[locale]/components/ui/card";
import { Badge } from "@/app/[locale]/components/ui/badge";
import { ArrowUpRight, Clock } from "lucide-react";
import { AnimatedCard } from "@/app/[locale]/components/ui/animated-card";
import { SectionHeading } from "./ui/section-heading";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { coursesConfig } from "@/lib/courses-config";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { fetchCourses } from "@/lib/api";
import { getStoredCourses, getEffectiveImage } from "@/lib/courses-store";

// Remove old per-component lookup — getEffectiveImage handles all matching in courses-store

export function CoursesSection() {
  const t = useTranslations();

  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // Build a map of stored courses so adminImageUrl survives the API merge
        const storedMap = Object.fromEntries(
          getStoredCourses().map(s => [s.id, s])
        );

        const data = await fetchCourses();
        const transformedCourses = data.map((course: any) => {
          // Match stored course by slug or title to pick up adminImageUrl
          const storedMatch = storedMap[course.slug || course.id]
            || Object.values(storedMap).find(s =>
                s.title.toLowerCase() === (course.title || "").toLowerCase()
              );
          const adminImageUrl = storedMatch?.adminImageUrl;
          const image = getEffectiveImage({
            id:           course.id,
            slug:         course.slug || course.id,
            title:        course.title,
            imageUrl:     course.imageUrl,
            adminImageUrl,
          });
          return {
            ...course,
            categoryName:  course.category.name,
            description:   course.shortDescription,
            rating:        course.rating || 0,
            reviews:       course.reviews || 0,
            instructor:    course.instructor?.name,
            image,
            instructorImage: course.instructor?.imageUrl || "",
          };
        });
        setCourses(transformedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    loadCourses();
  }, [t]);

  // Get top 3 courses by student enrollment
  const topCourses = [...courses]
    .sort((a, b) => {
      if (b.reviews !== a.reviews) {
        return b.reviews - a.reviews;
      }
      return b.rating - a.rating;
    })
    .slice(0, 3);

  return (
    <section className='py-16 dark:bg-gray-950'>
      <div className='max-w-7xl mx-auto px-4'>
        <SectionHeading
          title={t("topCoursesHeading.title")}
          subtitle={t("topCoursesHeading.subtitle")}
          center={true}
        />

        <div className='w-full mb-8'>
          <div className='grid min-[840px]:grid-cols-3 gap-8 xl:gap-10 2xl:gap-12'>
            {topCourses.map((course, index) => (
              <AnimatedCard key={course.id} delay={0.1 * index}>
                <Card className='flex overflow-hidden border-none shadow-[2px_2px_15px_rgba(0,0,0,0.2)] dark:bg-gray-900/40 transition-all duration-300 hover:shadow-xl gap-2 h-full  '>
                  <CardHeader className='px-4'>
                    <div className='relative'>
                      <img
                        src={course.image}
                        alt={course.title}
                        className='w-full h-[180px] 2xl:h-[220px] object-cover rounded-sm'
                      />
                      <div className='absolute bottom-4 left-4'>
                        <Badge
                          variant='outline'
                          className='bg-gray-500/80 text-white font-medium px-3 py-1 flex items-center gap-1 rounded-[6px] border-none'
                        >
                          <Clock className='h-4 w-4' />
                          <span>{course.duration}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='px-4'>
                    {/* Category */}
                    <p className='text-sky-500 font-medium text-xs md:text-sm lg:text-base  2xl:text-lg mb-1'>
                      {course.categoryName}
                    </p>

                    {/* Title with Arrow */}
                    <div className='flex justify-between items-start my-2'>
                      <h2 className='text-base sm:text-lg lg:text-xl  2xl:text-2xl font-bold text-gray-900 dark:text-gray-50'>
                        {course.title}
                      </h2>
                      <ArrowUpRight className='h-4 w-4 lg:h-5 lg:w-5 2xl:w-6 2xl:h-6 text-gray-700 dark:text-gray-300' />
                    </div>

                    {/* Description */}
                    <p className='text-gray-600 mb-4 dark:text-gray-400 text-sm md:text-base 2xl:text-lg'>
                      {course.description}
                    </p>

                    {/* Rating */}
                    <div className='flex items-center mb-5'>
                      <span className='text-base md:text-lg font-semibold text-gray-800 mr-2 dark:text-gray-200'>
                        {course.rating}
                      </span>
                      <div className='flex mr-2'>
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 lg:h-5 lg:w-5 2xl:w-6 2xl:h-6 ${
                                i < Math.floor(course.rating)
                                  ? "text-amber-400"
                                  : "text-gray-300"
                              }`}
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                            </svg>
                          ))}
                      </div>
                      <span className='text-gray-500 text-sm md:text-base '>
                        ({course.reviews})
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className='px-4 flex gap-3'>
                    {/* View Details Button */}
                    <Button
                      variant='outline'
                      className='flex-1 border-2 border-cyan-400 text-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 font-medium rounded-full bg-transparent'
                      asChild
                    >
                      <Link href={`/courses/${course.id}`}>
                        {t("topCoursesHeading.details")}
                      </Link>
                    </Button>

                    {/* Enroll Now Button */}
                    <Button className='flex-1 bg-green-500 hover:bg-green-600 text-white font-medium rounded-full'>
                      <Link href={`/courses/${course.id}/ApplicationForm`}>
                        {t("topCoursesHeading.enrollNow")}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

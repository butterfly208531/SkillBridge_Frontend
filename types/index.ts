import { LucideIcon } from "lucide-react";

export interface ServiceConfig {
  key: string;
  icon: LucideIcon;
}

export interface SuccessMetricConfig {
  key: number;
  icon: LucideIcon;
}

export interface Service extends ServiceConfig {
  title: string;
  description: string;
}

export interface CourseBase {
  id: number;
  key: string;
  image: string;
  instructorImage: string;
  category: string;
  level: string;
  rating: number;
  reviews: number;
  price: number;
  discount?: number;
  duration: string;
  lessons: number;
  students: number;
  createdAt: string;
  slug: string;
  enrollmentYear: number;
}

export interface CourseTranslation {
  title: string;
  description: string;
  instructor: string;
  instructorTitle?: string;
  learningOutcomes: string[];
  prerequisites: string[];
  curriculum: Array<{
    title: string;
    duration: string;
    lessons: Array<{
      title: string;
      duration: string;
    }>;
  }>;
}

export interface InstructorTranslation {
  name: string;
  title: string;
  description: string;
  socialLinks: Array<{
    twitter?: string;
    linkedin?: string;
  }>
}

export interface Instructor {
  translations: Record<string, InstructorTranslation>
}

export interface Course extends CourseBase {
  translations: Record<string, CourseTranslation>; // Key is locale (en, am, etc.)
}

export interface CoursesConfig {
  key: number;
  image: string;
  instructorImage: string;
  title?: string;
  category?: string;
  level?: string;
  duration?: string;
  rating?: number;
  students?: number;
  status?: string;
  slug?: string;
}

export interface InstructorsConfig {
  key: string;
  image: string;
}

export interface SocialLinks {
  twitter: string;
  linkedin: string;
}

export interface MeetHeroes extends InstructorsConfig {
  name: string;
  title: string;
  description: string;
  socialLinks: SocialLinks[];
}



export interface TestimonialConfig {
  key: string;
  image: string;
}

export interface Testimonial extends TestimonialConfig {
  id: string
  name: string
  title: string
  testimonial: string
  bgColor?: string
}

export interface SuccessMetric extends SuccessMetricConfig {
  value: string;
  label: string;
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

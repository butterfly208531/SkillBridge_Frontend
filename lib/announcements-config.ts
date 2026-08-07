export type AnnouncementCategory = "scholarship" | "course" | "deadline" | "spotlight" | "general";

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  date: string;       // ISO date string
  pinned?: boolean;
  courseId?: string;  // optional link to a course/scholarship
}

export const announcementsConfig: Announcement[] = [
  {
    id: "ann-1",
    title: "New Course Scholarship Added!",
    body: "We're excited to announce a brand new Full-Stack Development scholarship for 2026. This is a fully-funded program — 100% of tuition covered. Apply before September 30, 2026.",
    category: "scholarship",
    date: "2026-08-01",
    pinned: true,
    courseId: "full-stack-development",
  },
  {
    id: "ann-2",
    title: "Spotlight: Top 5 Fully-Funded Courses This Month",
    body: "This month's top fully-funded scholarship opportunities include Full-Stack Development ($500 covered) and Python Programming ($350 covered). Don't miss your chance to apply — seats are limited!",
    category: "spotlight",
    date: "2026-08-05",
    pinned: true,
  },
  {
    id: "ann-3",
    title: "Deadline Extended for Odoo Functional Scholarship",
    body: "Good news! The deadline for the Odoo Functional ERP scholarship has been extended to September 30, 2026. If you missed the original deadline, now is your chance to apply for 50% tuition coverage.",
    category: "deadline",
    date: "2026-07-28",
    courseId: "odoo-functional-erp",
  },
  {
    id: "ann-4",
    title: "AI & Machine Learning Scholarship Closing Soon!",
    body: "Only a few days remaining to apply for the AI & Machine Learning half-funded scholarship. Deadline is August 14, 2026. This covers 50% of the $600 tuition — you pay only $300.",
    category: "deadline",
    date: "2026-08-06",
    courseId: "ai-machine-learning",
  },
  {
    id: "ann-5",
    title: "New Course Added: Flutter & Dart Mastery",
    body: "We've added a new Flutter & Dart Mastery course to our platform. A scholarship program for this course is coming soon. Stay tuned for updates!",
    category: "course",
    date: "2026-07-20",
  },
  {
    id: "ann-6",
    title: "Data Science Scholarship — Applications Now Closed",
    body: "The Data Science fully-funded scholarship application period has ended. Congratulations to all applicants! Winners will be announced shortly. Stay tuned for the next cohort.",
    category: "scholarship",
    date: "2026-07-31",
    courseId: "data-science",
  },
  {
    id: "ann-7",
    title: "SkillBridge Hub Community Milestone: 1000+ Members!",
    body: "Our Telegram community has crossed 1,000 members! Join us for weekly challenges, coding sessions, and exclusive scholarship announcements.",
    category: "general",
    date: "2026-07-15",
  },
  {
    id: "ann-8",
    title: "Python Scholarship Applications Now Open",
    body: "Applications are now open for the Python Programming fully-funded scholarship. This program covers 100% of the $350 tuition. Deadline: October 15, 2026.",
    category: "scholarship",
    date: "2026-07-10",
    courseId: "python-programming",
  },
];

export const categoryMeta: Record<AnnouncementCategory, { label: string; color: string; bg: string; icon: string }> = {
  scholarship: { label: "Scholarship",  color: "text-[#1E90FF]",   bg: "bg-[#1E90FF]/10",  icon: "🎓" },
  course:      { label: "New Course",   color: "text-purple-600",  bg: "bg-purple-50",     icon: "📚" },
  deadline:    { label: "Deadline",     color: "text-red-600",     bg: "bg-red-50",        icon: "⏰" },
  spotlight:   { label: "Spotlight",    color: "text-[#F57C00]",   bg: "bg-[#F57C00]/10",  icon: "⭐" },
  general:     { label: "General",      color: "text-gray-600",    bg: "bg-gray-100",      icon: "📢" },
};

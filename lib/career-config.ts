export interface CareerService {
  id: string;
  iconName: string;
  key: string;
}

export const careerConfig: CareerService[] = [
  { id: "cv-review", iconName: "FileText", key: "cvReview" },
  { id: "linkedin", iconName: "Linkedin", key: "linkedin" },
  { id: "portfolio", iconName: "Layout", key: "portfolio" },
  { id: "github", iconName: "Github", key: "github" },
  { id: "interview-prep", iconName: "MessageSquare", key: "interviewPrep" },
  { id: "mock-interviews", iconName: "Video", key: "mockInterviews" },
  { id: "freelancing", iconName: "Globe", key: "freelancing" },
  { id: "mentorship", iconName: "Heart", key: "mentorship" },
  { id: "internship-support", iconName: "Building", key: "internshipSupport" },
  { id: "job-search", iconName: "Search", key: "jobSearch" },
];

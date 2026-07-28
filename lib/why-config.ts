export interface WhyFeature {
  id: string;
  iconName: string;
  key: string;
}

export const whyConfig: WhyFeature[] = [
  { id: "project-based", iconName: "FolderOpen", key: "projectBased" },
  { id: "mentors", iconName: "Users", key: "mentors" },
  { id: "online-physical", iconName: "Monitor", key: "onlinePhysical" },
  { id: "vip-coaching", iconName: "Star", key: "vipCoaching" },
  { id: "group-bootcamps", iconName: "Users2", key: "groupBootcamps" },
  { id: "real-projects", iconName: "Briefcase", key: "realProjects" },
  { id: "internships", iconName: "Building2", key: "internships" },
  { id: "scholarships", iconName: "Award", key: "scholarships" },
  { id: "career-support", iconName: "TrendingUp", key: "careerSupport" },
  { id: "community", iconName: "MessageCircle", key: "community" },
  { id: "certificates", iconName: "BadgeCheck", key: "certificates" },
  { id: "flexible", iconName: "Clock", key: "flexible" },
];

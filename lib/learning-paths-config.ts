export interface LearningPathConfig {
  id: string;
  iconName: string;
  color: string;
  stepCount: number;
}

export const learningPathsConfig: LearningPathConfig[] = [
  { id: "softwareEngineering", iconName: "Code2", color: "blue", stepCount: 7 },
  { id: "erpConsultant", iconName: "Database", color: "orange", stepCount: 5 },
  { id: "aiEngineer", iconName: "Brain", color: "purple", stepCount: 7 },
  { id: "studyAbroad", iconName: "GraduationCap", color: "green", stepCount: 5 },
];

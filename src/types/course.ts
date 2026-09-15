export type CourseStatus = "AVAILABLE" | "LOCKED";

export interface CourseModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  status: CourseStatus;
  skills: string[];
  description: string;
  iconName: string;
  challengeCount?: number;
  estimatedDuration?: string;
  targetFocus?: string;
}

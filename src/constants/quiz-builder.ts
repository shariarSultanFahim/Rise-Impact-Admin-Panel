import type { QuizSettings } from "@/types/quiz-builder";

export const COURSE_OPTIONS = [
  { value: "communication-skills", label: "Communication Skills" },
  { value: "time-management", label: "Time Management" },
  { value: "critical-thinking", label: "Critical Thinking" },
  { value: "money-management", label: "Money Management" }
] as const;

export const QUESTION_TYPE_OPTIONS = [
  { value: "multiple-choice", label: "Multiple Choice" },
  { value: "true-false", label: "True/False" },
  { value: "descriptive", label: "Descriptive" }
] as const;

export const DEFAULT_MULTIPLE_CHOICE_OPTIONS = [
  "Option 1",
  "Option 2",
  "Option 3",
  "Option 4"
] as const;

export const QUIZ_DEFAULT_SETTINGS: QuizSettings = {
  title: "",
  courseId: "",
  timeLimit: 30,
  passingScore: 70
};

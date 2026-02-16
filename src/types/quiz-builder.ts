export type QuestionType = "multiple-choice" | "true-false" | "descriptive";

export interface QuizSettings {
  title: string;
  courseId: string;
  timeLimit: number;
  passingScore: number;
}

export interface BaseQuestion {
  type: QuestionType;
  text: string;
  explanation?: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "multiple-choice";
  options: string[];
  correctOptionIndex: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: "true-false";
  correctAnswer: boolean;
}

export interface DescriptiveQuestion extends BaseQuestion {
  type: "descriptive";
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion | DescriptiveQuestion;

export interface QuizFormData {
  settings: QuizSettings;
  questions: Question[];
}

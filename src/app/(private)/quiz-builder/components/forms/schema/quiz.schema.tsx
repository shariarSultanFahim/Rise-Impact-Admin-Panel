import { z } from "zod";

import type { QuizFormData } from "@/types/quiz-builder";

import { descriptiveQuestionSchema } from "./descriptive.schema";
import { multipleChoiceQuestionSchema } from "./multiple.choice.schema";
import { trueFalseQuestionSchema } from "./true.false.schema";

const quizSettingsSchema = z.object({
  title: z.string().min(3, "Quiz title is required"),
  courseId: z.string().min(1, "Select a course"),
  timeLimit: z.number().min(1, "Time limit must be at least 1 minute").max(180),
  passingScore: z.number().min(0, "Passing score must be between 0 and 100").max(100)
});

const questionSchema = z.discriminatedUnion("type", [
  multipleChoiceQuestionSchema,
  trueFalseQuestionSchema,
  descriptiveQuestionSchema
]);

export const quizSchema: z.ZodType<QuizFormData> = z.object({
  settings: quizSettingsSchema,
  questions: z.array(questionSchema).min(1, "Add at least one question")
});

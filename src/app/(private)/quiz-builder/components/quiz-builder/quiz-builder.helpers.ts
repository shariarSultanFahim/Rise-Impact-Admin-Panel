import { z } from "zod";

import type {
  QuizDetail,
  QuizFormData,
  QuizFormQuestion,
  QuizOption,
  QuizQuestionType,
  QuizWritePayload
} from "@/types/quiz-builder-manage";

export const QUESTION_TYPE_OPTIONS: Array<{ value: QuizQuestionType; label: string }> = [
  { value: "MCQ", label: "Multiple Choice" },
  { value: "TRUE_FALSE", label: "True / False" }
];

const optionSchema = z.object({
  optionId: z.string().min(1),
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean()
});

const questionSchema = z
  .object({
    questionId: z.string().optional(),
    type: z.enum(["MCQ", "TRUE_FALSE"]),
    text: z.string().min(3, "Question text is required"),
    marks: z.number().int().min(1, "Marks must be at least 1"),
    explanation: z.string().max(500, "Explanation must be 500 characters or less").optional(),
    options: z.array(optionSchema).min(2, "At least two options are required")
  })
  .superRefine((value, context) => {
    const totalCorrect = value.options.filter((option) => option.isCorrect).length;

    if (totalCorrect !== 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Exactly one correct option is required",
        path: ["options"]
      });
    }

    if (value.type === "TRUE_FALSE" && value.options.length !== 2) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "True/False must have exactly two options",
        path: ["options"]
      });
    }
  });

export const quizFormSchema = z.object({
  title: z.string().min(3, "Quiz title is required"),
  course: z.string().min(1, "Course is required"),
  description: z.string().max(1000, "Description must be 1000 characters or less"),
  timeLimit: z.number().min(0, "Time limit cannot be negative").max(180),
  passingScore: z.number().min(0, "Passing score cannot be negative").max(100),
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
  showResults: z.boolean(),
  questions: z.array(questionSchema)
});

export type EditorMode = "list" | "create" | "edit";

export const defaultQuestion = (type: QuizQuestionType): QuizFormQuestion => {
  if (type === "TRUE_FALSE") {
    return {
      type: "TRUE_FALSE",
      text: "",
      marks: 1,
      explanation: "",
      options: [
        { optionId: "T", text: "True", isCorrect: true },
        { optionId: "F", text: "False", isCorrect: false }
      ]
    };
  }

  return {
    type: "MCQ",
    text: "",
    marks: 1,
    explanation: "",
    options: [
      { optionId: "A", text: "", isCorrect: true },
      { optionId: "B", text: "", isCorrect: false }
    ]
  };
};

export const defaultFormValues: QuizFormData = {
  title: "",
  course: "",
  description: "",
  timeLimit: 30,
  passingScore: 70,
  shuffleQuestions: true,
  shuffleOptions: true,
  showResults: true,
  questions: []
};

export const getOptionIdByIndex = (index: number): string => {
  return String.fromCharCode(65 + index);
};

export const mapQuizDetailToForm = (quiz: QuizDetail): QuizFormData => {
  const sortedQuestions = [...quiz.questions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return {
    title: quiz.title,
    course: quiz.course,
    description: quiz.description ?? "",
    timeLimit: quiz.settings.timeLimit,
    passingScore: quiz.settings.passingScore,
    shuffleQuestions: quiz.settings.shuffleQuestions,
    shuffleOptions: quiz.settings.shuffleOptions,
    showResults: quiz.settings.showResults,
    questions: sortedQuestions.map((question) => ({
      questionId: question.questionId,
      type: question.type,
      text: question.text,
      marks: question.marks,
      explanation: question.explanation ?? "",
      options: question.options.map((option) => ({
        optionId: option.optionId,
        text: option.text,
        isCorrect: option.isCorrect
      }))
    }))
  };
};

export const toPayload = (values: QuizFormData): QuizWritePayload => {
  const payloadQuestions = values.questions.map((question, index) => ({
    ...(question.questionId ? { questionId: question.questionId } : {}),
    type: question.type,
    text: question.text.trim(),
    marks: question.marks,
    explanation: question.explanation?.trim() || undefined,
    order: index,
    options: question.options.map((option) => ({
      optionId: option.optionId,
      text: option.text.trim(),
      isCorrect: option.isCorrect
    }))
  }));

  return {
    title: values.title.trim(),
    course: values.course,
    description: values.description.trim() || undefined,
    settings: {
      timeLimit: values.timeLimit,
      passingScore: values.passingScore,
      shuffleQuestions: values.shuffleQuestions,
      shuffleOptions: values.shuffleOptions,
      showResults: values.showResults
    },
    ...(payloadQuestions.length > 0 ? { questions: payloadQuestions } : {})
  };
};

export const normalizeOptionsAfterRemoval = (
  options: QuizOption[],
  optionIndex: number
): QuizOption[] => {
  const filteredOptions = options.filter((_, index) => index !== optionIndex);
  const hasCorrect = filteredOptions.some((option) => option.isCorrect);

  return filteredOptions.map((option, index) => ({
    ...option,
    optionId: getOptionIdByIndex(index),
    isCorrect: hasCorrect ? option.isCorrect : index === 0
  }));
};

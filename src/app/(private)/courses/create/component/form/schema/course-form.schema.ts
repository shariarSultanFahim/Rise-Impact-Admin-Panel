import { z } from "zod";

import type { CourseForm } from "@/types/course-form";

const lessonSchema = z
  .object({
    id: z.string().min(1, "Lesson ID is required"),
    title: z.string().min(2, "Lesson title is required"),
    type: z.enum(["video", "reading", "quiz"]),
    description: z.string().min(10, "Description must be at least 10 characters"),
    resourceLink: z.string().optional().default(""),
    quizId: z.string().optional().default(""),
    objectives: z.array(z.string().min(2, "Objective is required")),
    prerequisites: z.array(z.string()),
    attachments: z.array(z.string().min(2, "Attachment name is required")),
    isPublished: z.boolean()
  })
  .superRefine((value, context) => {
    if (value.type === "quiz" && value.quizId.trim() === "") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select a quiz",
        path: ["quizId"]
      });
    }
  });

const moduleSchema = z.object({
  id: z.string().min(1, "Module ID is required"),
  title: z.string().min(2, "Module title is required"),
  lessons: z.array(lessonSchema).min(1, "Add at least one lesson")
});

const courseStatusSchema = z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]);

export const courseFormSchema = z.object({
  title: z.string().min(2, "Course title is required"),
  status: courseStatusSchema,
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnailUrl: z
    .string()
    .min(1, "Upload a course thumbnail before publishing.")
    .refine((url) => {
      const maxSizeMB = 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      return url.length <= maxSizeBytes;
    }, "Image must be less than 10MB"),
  modules: z.array(moduleSchema)
}) satisfies z.ZodType<CourseForm>;

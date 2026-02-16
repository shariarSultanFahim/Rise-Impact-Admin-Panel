import { z } from "zod";

import type { CourseForm } from "@/types/course-form";

const lessonSchema = z.object({
  id: z.string().min(1, "Lesson ID is required"),
  title: z.string().min(2, "Lesson title is required"),
  type: z.enum(["video", "reading", "assignment"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  resourceLink: z
    .string()
    .min(1, "Upload the lesson resource before publishing.")
    .url("Resource link must be a valid URL"),
  objectives: z.array(z.string().min(2, "Objective is required")),
  prerequisites: z.array(z.string()),
  attachments: z.array(z.string().min(2, "Attachment name is required")),
  isPublished: z.boolean()
});

const moduleSchema = z.object({
  id: z.string().min(1, "Module ID is required"),
  title: z.string().min(2, "Module title is required"),
  lessons: z.array(lessonSchema).min(1, "Add at least one lesson")
});

export const courseFormSchema = z.object({
  title: z.string().min(2, "Course title is required"),
  status: z.enum(["Active", "In Active", "Upcoming"]),
  publishedAt: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  thumbnailUrl: z.string().min(1, "Upload a course thumbnail before publishing."),
  modules: z.array(moduleSchema).min(1, "Add at least one module")
}) satisfies z.ZodType<CourseForm>;

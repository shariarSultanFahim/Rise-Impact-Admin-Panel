import zod from "zod";

export const notificationSchema = zod
  .object({
    title: zod
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be 200 characters or less"),
    text: zod
      .string()
      .min(1, "Message is required")
      .max(5000, "Message must be 5000 characters or less"),
    audience: zod.enum(["all" as const, "course" as const]),
    courseId: zod.string().optional()
  })
  .superRefine((values, context) => {
    if (values.audience === "course" && !values.courseId) {
      context.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["courseId"],
        message: "Select a course when targeting a specific course"
      });
    }
  });

export type NotificationFormData = zod.infer<typeof notificationSchema>;

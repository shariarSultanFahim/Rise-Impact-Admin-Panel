import zod from "zod";

export const notificationSchema = zod
  .object({
    title: zod
      .string()
      .min(3, "Title must be at least 3 characters")
      .max(80, "Title must be 80 characters or less"),
    message: zod
      .string()
      .min(10, "Message must be at least 10 characters")
      .max(500, "Message must be 500 characters or less"),
    audience: zod.string().min(1, "Select an audience"),
    courseId: zod.string().optional(),
    studentId: zod.string().optional()
  })
  .superRefine((values, context) => {
    if (values.audience === "specific-course" && !values.courseId) {
      context.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["courseId"],
        message: "Select a course"
      });
    }

    if (values.audience === "individual-student" && !values.studentId) {
      context.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["studentId"],
        message: "Select a student"
      });
    }
  });

export type NotificationFormData = zod.infer<typeof notificationSchema>;

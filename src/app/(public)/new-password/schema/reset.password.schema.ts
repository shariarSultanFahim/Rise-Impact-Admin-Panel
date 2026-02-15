import zod from "zod";

export const passwordResetSchema = zod
  .object({
    newPassword: zod.string().min(8, "New password must be at least 8 characters long"),
    confirmPassword: zod.string().min(8, "Confirm password must be at least 8 characters long")
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });
export type PasswordResetFormData = zod.infer<typeof passwordResetSchema>;

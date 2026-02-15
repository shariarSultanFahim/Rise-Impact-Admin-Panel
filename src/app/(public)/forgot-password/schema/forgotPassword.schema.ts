import zod from "zod";

export const forgotPasswordSchema = zod.object({
  email: zod.email("Please enter a valid email address")
});

export type ForgotPasswordFormData = zod.infer<typeof forgotPasswordSchema>;

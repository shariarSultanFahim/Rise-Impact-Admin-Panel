import zod from "zod";

export const loginSchema = zod.object({
  email: zod.email("Please enter a valid email address"),
  password: zod.string("Password is required").min(1, "Password cannot be empty")
});

export type LoginFormData = zod.infer<typeof loginSchema>;

import zod from "zod";

export const loginSchema = zod.object({
  username: zod.string(),
  password: zod.string()
});

export type LoginFormData = zod.infer<typeof loginSchema>;

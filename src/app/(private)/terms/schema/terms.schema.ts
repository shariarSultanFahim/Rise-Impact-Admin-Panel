import { z } from "zod";

export const termsSchema = z.object({
  title: z.string().min(2, "Title is required"),
  details: z.string().min(10, "Details must be at least 10 characters")
});

export type TermsFormData = z.infer<typeof termsSchema>;

import { z } from "zod";

export const termsSchema = z.object({
  slug: z.string().min(1, "Select a legal document"),
  content: z.string()
});

export type TermsFormData = z.infer<typeof termsSchema>;

export const addLegalSchema = z.object({
  title: z.string().min(1, "Title is required")
});

export type AddLegalFormData = z.infer<typeof addLegalSchema>;

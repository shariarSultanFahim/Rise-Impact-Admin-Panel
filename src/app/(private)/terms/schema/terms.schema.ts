import { z } from "zod";

const legalDocumentTypes = [
  "privacy-policy",
  "terms-and-conditions",
  "cookie-policy",
  "disclaimer",
  "return-refund-policy",
  "eula"
] as const;

export const termsSchema = z.object({
  type: z.enum(legalDocumentTypes, {
    message: "Select a legal document type"
  }),
  content: z.string().min(10, "Content must be at least 10 characters")
});

export type TermsFormData = z.infer<typeof termsSchema>;

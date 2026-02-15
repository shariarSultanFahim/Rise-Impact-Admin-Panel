import { z } from "zod";

export const descriptiveQuestionSchema = z.object({
  type: z.literal("descriptive"),
  text: z.string().min(3, "Question text is required"),
  explanation: z.string().max(500, "Explanation must be 500 characters or less").optional()
});

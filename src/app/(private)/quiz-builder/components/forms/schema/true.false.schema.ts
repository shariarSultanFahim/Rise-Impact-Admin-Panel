import { z } from "zod";

export const trueFalseQuestionSchema = z.object({
  type: z.literal("true-false"),
  text: z.string().min(3, "Question text is required"),
  correctAnswer: z.boolean(),
  explanation: z.string().max(500, "Explanation must be 500 characters or less").optional()
});

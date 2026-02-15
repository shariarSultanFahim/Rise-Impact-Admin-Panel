import { z } from "zod";

export const multipleChoiceQuestionSchema = z.object({
  type: z.literal("multiple-choice"),
  text: z.string().min(3, "Question text is required"),
  options: z.array(z.string().min(1, "Option is required")).length(4, "Provide 4 options"),
  correctOptionIndex: z
    .number()
    .int("Select the correct answer")
    .min(0, "Select the correct answer")
    .max(3, "Select the correct answer"),
  explanation: z.string().max(500, "Explanation must be 500 characters or less").optional()
});

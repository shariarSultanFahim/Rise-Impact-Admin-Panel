import { z } from "zod";

export const analyticsFilterSchema = z.object({
  dateRange: z.string().min(1, "Select a date range"),
  course: z.string().min(1, "Select a course")
});

export type AnalyticsFilterFormData = z.infer<typeof analyticsFilterSchema>;

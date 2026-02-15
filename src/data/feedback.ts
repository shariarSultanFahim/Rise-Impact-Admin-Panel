import { FeedbackData } from "@/types/feedback";

import feedbackData from "./feedback.json";

export async function getFeedbackData(): Promise<FeedbackData> {
  return feedbackData as FeedbackData;
}

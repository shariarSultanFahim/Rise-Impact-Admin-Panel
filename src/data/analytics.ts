import type { AnalyticsData } from "@/types/analytics";

import analyticsData from "./analytics.json";

export async function getAnalyticsData(): Promise<AnalyticsData> {
  return analyticsData as AnalyticsData;
}

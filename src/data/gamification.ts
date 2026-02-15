import type { GamificationData } from "@/types/gamification";

import gamificationData from "./gamification.json";

export async function getGamificationData(): Promise<GamificationData> {
  return gamificationData as GamificationData;
}

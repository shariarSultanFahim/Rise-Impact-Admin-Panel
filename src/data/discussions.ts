import type { DiscussionsData } from "@/types/discussions";

import discussionsData from "./discussions.json";

export async function getDiscussionsData(): Promise<DiscussionsData> {
  return discussionsData as DiscussionsData;
}

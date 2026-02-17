import type { UserDetailsData } from "@/types/user-details";

import userDetailsData from "./user-details.json";

export async function getUserDetails(userId: string): Promise<UserDetailsData | null> {
  const users = userDetailsData as Record<string, UserDetailsData>;
  return users[userId] ?? null;
}

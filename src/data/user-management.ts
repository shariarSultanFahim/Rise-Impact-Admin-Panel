import type { UserManagementData } from "@/types/user-management";

import userManagementData from "./user-management.json";

export async function getUserManagementData(): Promise<UserManagementData> {
  return userManagementData as UserManagementData;
}

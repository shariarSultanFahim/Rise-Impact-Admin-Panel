import type { NotificationsData } from "@/types/notifications";

import notificationsData from "./notifications.json";

export async function getNotificationsData(): Promise<NotificationsData> {
  return notificationsData as NotificationsData;
}

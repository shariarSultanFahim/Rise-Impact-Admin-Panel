import { Suspense } from "react";

import { getNotificationsData } from "@/data/notifications";

import NotificationsContent from "./component/NotificationsContent";
import NotificationsSkeleton from "./component/NotificationsSkeleton";

async function NotificationsLoader() {
  const data = await getNotificationsData();

  return <NotificationsContent data={data} />;
}

export default function NotificationsPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsLoader />
      </Suspense>
    </section>
  );
}

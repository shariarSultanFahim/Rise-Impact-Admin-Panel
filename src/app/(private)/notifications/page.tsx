import { Suspense } from "react";

import { getCoursesData } from "@/data/courses";
import { getNotificationsData } from "@/data/notifications";
import { getUserManagementData } from "@/data/user-management";

import NotificationsContent from "./component/NotificationsContent";
import NotificationsSkeleton from "./component/NotificationsSkeleton";

async function NotificationsLoader() {
  const [data, coursesData, usersData] = await Promise.all([
    getNotificationsData(),
    getCoursesData(),
    getUserManagementData()
  ]);
  const students = usersData.users.filter((user) => user.role === "Student");

  return <NotificationsContent data={data} courses={coursesData.courses} students={students} />;
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

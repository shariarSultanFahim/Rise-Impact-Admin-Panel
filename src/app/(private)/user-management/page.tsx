import { Suspense } from "react";

import { getUserManagementData } from "@/data/user-management";
import UserManagement from "./component/UserManagement";
import UserManagementSkeleton from "./component/UserManagementSkeleton";

async function UserManagementContent() {
  const data = await getUserManagementData();

  return <UserManagement data={data} />;
}

export default function UserManagementPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<UserManagementSkeleton />}>
        <UserManagementContent />
      </Suspense>
    </section>
  );
}
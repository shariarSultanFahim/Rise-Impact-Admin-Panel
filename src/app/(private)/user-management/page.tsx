"use client";

import { useState } from "react";

import { UserManageQueryParams } from "@/types/users-manage";

import { useGetUsers } from "@/lib/api/user/get-users";

import UserManagement from "./component/UserManagement";
import UserManagementSkeleton from "./component/UserManagementSkeleton";

export default function UserManagementPage() {
  const [params, setParams] = useState<UserManageQueryParams>({
    page: 1,
    limit: 10
  });

  const { data, isPending } = useGetUsers(params);

  if (isPending) {
    return (
      <section className="flex flex-col gap-6">
        <UserManagementSkeleton />
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <UserManagement data={data} params={params} onParamsChange={setParams} />
    </section>
  );
}

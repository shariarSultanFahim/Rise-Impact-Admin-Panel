"use client";

import { useState } from "react";

import type { UserManageQueryParams } from "@/types/users-manage";

import UserManagement from "./component/UserManagement";

export default function UserManagementPage() {
  const [params, setParams] = useState<UserManageQueryParams>({
    page: 1,
    limit: 10
  });

  return (
    <section className="flex flex-col gap-6">
      <UserManagement params={params} onParamsChange={setParams} />
    </section>
  );
}

"use client";

import { useState } from "react";

import type { DiscussionQueryParams } from "@/types";

import { Discussions } from "./component";

export default function DiscussionsPage() {
  const [params, setParams] = useState<DiscussionQueryParams>({
    page: 1,
    limit: 3,
    sort: "-createdAt"
  });

  return (
    <section className="flex flex-col gap-6">
      <Discussions params={params} onParamsChange={setParams} />
    </section>
  );
}

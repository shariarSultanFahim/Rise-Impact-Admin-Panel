import { Suspense } from "react";

import { getDiscussionsData } from "@/data/discussions";

import { Discussions, DiscussionsSkeleton } from "./component";

async function DiscussionsContent() {
  const data = await getDiscussionsData();

  return <Discussions data={data} />;
}

export default function DiscussionsPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<DiscussionsSkeleton />}>
        <DiscussionsContent />
      </Suspense>
    </section>
  );
}

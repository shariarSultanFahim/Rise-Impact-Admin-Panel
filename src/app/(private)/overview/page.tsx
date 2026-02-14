import { Suspense } from "react";

import { getOverviewData } from "@/data/overview";
import Overview from "./components/Overview";
import OverviewSkeleton from "./components/OverviewSkeleton";

async function OverviewContent() {
  const data = await getOverviewData();

  return <Overview data={data} />;
}

export default function OverviewPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewContent />
      </Suspense>
    </section>
  );
}

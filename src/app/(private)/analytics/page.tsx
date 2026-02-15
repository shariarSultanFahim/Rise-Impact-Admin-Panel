import { Suspense } from "react";

import { getAnalyticsData } from "@/data/analytics";

import AnalyticsContent from "./component/AnalyticsContent";
import AnalyticsSkeleton from "./component/AnalyticsSkeleton";

async function AnalyticsLoader() {
  // Simulate network delay
  //   await new Promise((resolve) => setTimeout(resolve, 10000));

  const data = await getAnalyticsData();

  return <AnalyticsContent data={data} />;
}

export default function AnalyticsPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsLoader />
      </Suspense>
    </section>
  );
}

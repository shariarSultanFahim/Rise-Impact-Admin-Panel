import { Suspense } from "react";

import { getGamificationData } from "@/data/gamification";

import GamificationContent from "./component/GamificationContent";
import GamificationSkeleton from "./component/GamificationSkeleton";

async function GamificationLoader() {
  const data = await getGamificationData();

  return <GamificationContent data={data} />;
}

export default function GamificationPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<GamificationSkeleton />}>
        <GamificationLoader />
      </Suspense>
    </section>
  );
}

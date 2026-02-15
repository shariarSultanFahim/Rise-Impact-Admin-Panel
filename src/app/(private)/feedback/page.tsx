import { Suspense } from "react";

import { getFeedbackData } from "@/data/feedback";

import FeedbackContent from "./component/FeedbackContent";
import FeedbackSkeleton from "./component/FeedbackSkeleton";

async function FeedbackLoader() {
  const data = await getFeedbackData();

  return <FeedbackContent data={data} />;
}

export default function FeedbackPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<FeedbackSkeleton />}>
        <FeedbackLoader />
      </Suspense>
    </section>
  );
}

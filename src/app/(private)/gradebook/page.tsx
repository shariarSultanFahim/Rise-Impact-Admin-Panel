import { Suspense } from "react";

import { getGradebookData } from "@/data/gradebook";

import { Gradebook, GradebookSkeleton } from "./component";

async function GradebookContent() {
  const data = await getGradebookData();

  return <Gradebook data={data} />;
}

export default function GradebookPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<GradebookSkeleton />}>
        <GradebookContent />
      </Suspense>
    </section>
  );
}

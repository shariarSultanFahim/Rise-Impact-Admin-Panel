import { Suspense } from "react";

import QuizBuilderForm from "./components/QuizBuilderForm";
import QuizBuilderSkeleton from "./components/QuizBuilderSkeleton";

export default function QuizBuilderPage() {
  return (
    <section className="space-y-6">
      <Suspense fallback={<QuizBuilderSkeleton />}>
        <QuizBuilderForm />
      </Suspense>
    </section>
  );
}

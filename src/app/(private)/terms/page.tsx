import { Suspense } from "react";

import TermsForm from "./component/TermsForm";
import TermsSkeleton from "./component/TermsSkeleton";

export default function TermsAndConditionsPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Terms & Condition</h1>
        <p className="text-sm text-muted-foreground">Manage Terms and condition</p>
      </div>

      <Suspense fallback={<TermsSkeleton />}>
        <TermsForm />
      </Suspense>
    </section>
  );
}

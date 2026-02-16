import { Suspense } from "react";

import { getLegalDocumentsData } from "@/data/legal-documents";

import TermsForm from "./component/TermsForm";
import TermsSkeleton from "./component/TermsSkeleton";

async function TermsLoader() {
  const data = await getLegalDocumentsData();

  return <TermsForm data={data} />;
}

export default function TermsAndConditionsPage() {
  return (
    <section className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Legal Documents</h1>
        <p className="text-sm text-muted-foreground">
          Manage privacy policies, terms, and other legal documents.
        </p>
      </div>

      <Suspense fallback={<TermsSkeleton />}>
        <TermsLoader />
      </Suspense>
    </section>
  );
}

import type { LegalDocumentsData } from "@/types/legal-document";

import legalDocumentsData from "./legal-documents.json";

export async function getLegalDocumentsData(): Promise<LegalDocumentsData> {
  return legalDocumentsData as LegalDocumentsData;
}

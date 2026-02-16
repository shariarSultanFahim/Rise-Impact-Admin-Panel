export type LegalDocumentType =
  | "privacy-policy"
  | "terms-and-conditions"
  | "cookie-policy"
  | "disclaimer"
  | "return-refund-policy"
  | "eula";

export interface LegalDocumentOption {
  id: LegalDocumentType;
  label: string;
  description: string;
}

export interface LegalDocumentItem {
  type: LegalDocumentType;
  title: string;
  content: string;
}

export interface LegalDocumentsData {
  options: LegalDocumentOption[];
  documents: LegalDocumentItem[];
}

export interface LegalPageItem {
  slug: string;
  title: string;
  updatedAt: string;
}

export interface LegalPageDetails {
  _id: string;
  slug: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt: string;
}

export interface GetAllLegalResponse {
  success: boolean;
  message: string;
  data: LegalPageItem[];
}

export interface DetailsLegalResponse {
  success: boolean;
  message: string;
  data: LegalPageDetails;
}

export interface CreateLegalPayload {
  title: string;
  content: string;
}

export interface CreateLegalResponse {
  success: boolean;
  message: string;
  data: LegalPageDetails;
}

export interface DeleteLegalResponse {
  success: boolean;
  message: string;
}

export interface UpdateLegalPayload {
  slug: string;
  title?: string;
  content?: string;
}

export interface UpdateLegalResponse {
  success: boolean;
  message: string;
  data: LegalPageDetails;
}

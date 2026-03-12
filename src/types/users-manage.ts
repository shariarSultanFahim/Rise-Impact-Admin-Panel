export type UserManageStatus = "ACTIVE" | "INACTIVE" | "RESTRICTED";
export type UserManageRole = "STUDENT";

export interface UserManageQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sort?: string;
  role?: UserManageRole | "";
  status?: UserManageStatus | "";
}

export interface UserManageItem {
  _id: string;
  name: string;
  role: UserManageRole;
  email: string;
  profilePicture: string;
  status: UserManageStatus;
  verified: boolean;
  enrollmentCount: number;
  createdAt: string;
  lastActiveDate: string | null;
}

export interface UserManagePagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface UserManageResponse {
  success: boolean;
  message: string;
  pagination: UserManagePagination;
  data: UserManageItem[];
}

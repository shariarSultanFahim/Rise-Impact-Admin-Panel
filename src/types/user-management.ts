export interface UserManagementHeading {
  title: string;
  subtitle: string;
}

export interface UserManagementFilters {
  roles: string[];
  status: string[];
}

export interface UserManagementStat {
  id: string;
  title: string;
  value: string;
}

export interface UserManagementUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  courses: string;
  lastActive: string;
}

export interface UserManagementPagination {
  page: number;
  totalPages: number;
  showing: number;
  total: number;
}

export interface UserManagementData {
  heading: UserManagementHeading;
  filters: UserManagementFilters;
  stats: UserManagementStat[];
  users: UserManagementUser[];
  pagination: UserManagementPagination;
}

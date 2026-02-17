export interface UserDetailsCourse {
  id: string;
  title: string;
  status: "In Progress" | "Completed" | "Not Started";
  progress: number;
  enrolledDate: string;
  grade?: number;
}

export interface UserDetailsActivity {
  id: string;
  activity: string;
  timestamp: string;
}

export interface UserDetailsStat {
  id: string;
  title: string;
  value: string;
}

export interface UserDetailsInfo {
  id: string;
  name: string;
  email: string;
  role: "Student" | "Instructor" | "Admin";
  status: "Active" | "Inactive";
  phone?: string;
  joinDate: string;
  lastActive: string;
  bio?: string;
}

export interface UserDetailsData {
  info: UserDetailsInfo;
  stats: UserDetailsStat[];
  courses: UserDetailsCourse[];
  recentActivity: UserDetailsActivity[];
}

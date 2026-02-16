export type CourseStatus = "Active" | "In Active" | "Upcoming";

export interface CoursesHeading {
  title: string;
  subtitle: string;
}

export interface CoursesFilters {
  status: string[];
}

export interface CoursesStat {
  id: string;
  title: string;
  value: string;
}

export interface CourseCardItem {
  id: string;
  title: string;
  status: CourseStatus;
  imageUrl: string;
  modules: number;
  students: number;
  completionRate: number;
}

export interface CoursesPagination {
  showing: number;
  total: number;
  totalPages: number;
  page: number;
}

export interface CoursesData {
  heading: CoursesHeading;
  filters: CoursesFilters;
  stats: CoursesStat[];
  courses: CourseCardItem[];
  pagination: CoursesPagination;
}

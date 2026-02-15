export interface GradebookHeading {
  title: string;
  subtitle: string;
}

export interface GradebookStat {
  id: string;
  title: string;
  value: string;
}

export interface GradebookFilters {
  courses: string[];
}

export interface GradebookStudent {
  id: string;
  name: string;
  course: string;
  quiz1: number;
  quiz2: number;
  quiz3: number;
  overall: number;
  completion: number;
}

export interface GradebookPagination {
  page: number;
  totalPages: number;
  showing: number;
  total: number;
}

export interface GradebookData {
  heading: GradebookHeading;
  stats: GradebookStat[];
  filters: GradebookFilters;
  students: GradebookStudent[];
  pagination: GradebookPagination;
}

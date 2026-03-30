// Statistic type with growth indicators
export interface Statistic {
  value: number;
  growth: number;
  growthType: "increase" | "decrease" | "no_change";
}

// Gradebook Summary Response (6.1)
export interface GradebookSummary {
  avgQuizScore: Statistic;
  avgCompletion: Statistic;
  pendingAssignments: number;
  atRiskStudents: number;
}

export interface GradebookAdminSummaryResponse {
  success: boolean;
  message: string;
  data: GradebookSummary;
}

// Student Gradebook Item (6.2)
export interface GradebookItem {
  _id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string | null;
  courseTitle: string;
  quizzesAttempted: number;
  totalQuizzes: number;
  overallQuizPercentage: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  completionPercentage: number;
  lastActivityDate: string | null;
  enrolledAt: string;
}

// Pagination envelope
export interface GradebookPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Gradebook List Response (6.2)
export interface GradebookAdminListResponse {
  success: boolean;
  pagination: GradebookPagination;
  data: GradebookItem[];
}

// Query parameters for gradebook list
export interface GradebookAdminQueryParams {
  page?: number;
  limit?: number;
  courseId?: string;
  searchTerm?: string;
  status?: "ACTIVE" | "COMPLETED";
}

// Legacy types (kept for compatibility with existing components)
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

export interface GradebookData {
  heading: GradebookHeading;
  stats: GradebookStat[];
  filters: GradebookFilters;
  students: GradebookStudent[];
  pagination: GradebookPagination;
}

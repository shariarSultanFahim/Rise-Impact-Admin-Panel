export interface Feedback {
  id: string;
  userId: string;
  message: string;
  rating?: number;
  category?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeedbackInput {
  message: string;
  rating?: number;
  category?: string;
}

export interface UpdateFeedbackInput {
  status?: "pending" | "reviewed" | "resolved";
  message?: string;
}

export interface FeedbackResponse {
  data: Feedback[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FeedbackHeading {
  title: string;
  subtitle: string;
}

export interface FeedbackFilters {
  courses: string[];
}

export interface FeedbackStat {
  id: string;
  title: string;
  value: string;
}

export interface FeedbackSubmission {
  id: string;
  studentName: string;
  assignment: string;
  course: string;
  score: number | null;
  rating: number | null;
  submittedAt: string;
  answer: string;
  instructorFeedback: string;
}

export interface FeedbackPagination {
  page: number;
  totalPages: number;
  showing: number;
  total: number;
}

export interface FeedbackData {
  heading: FeedbackHeading;
  filters: FeedbackFilters;
  stats: FeedbackStat[];
  submissions: FeedbackSubmission[];
  pagination: FeedbackPagination;
}

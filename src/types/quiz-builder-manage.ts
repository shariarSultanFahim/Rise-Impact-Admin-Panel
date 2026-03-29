export type QuizQuestionType = "MCQ" | "TRUE_FALSE";

export interface QuizCourseRef {
  _id: string;
  title: string;
}

export interface QuizSettings {
  timeLimit: number;
  passingScore: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
}

export interface QuizOption {
  optionId: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  questionId?: string;
  type: QuizQuestionType;
  text: string;
  options: QuizOption[];
  marks: number;
  explanation?: string;
  order?: number;
}

export interface QuizListItem {
  _id: string;
  title: string;
  course: QuizCourseRef;
  description?: string;
  totalMarks: number;
  settings: Pick<QuizSettings, "timeLimit" | "passingScore">;
  createdAt: string;
}

export interface QuizDetail {
  _id: string;
  title: string;
  course: string;
  description?: string;
  totalMarks: number;
  settings: QuizSettings;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface QuizListQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface QuizListResponse {
  success: boolean;
  message?: string;
  pagination: QuizPagination;
  data: QuizListItem[];
}

export interface QuizDetailResponse {
  success: boolean;
  message: string;
  data: QuizDetail;
}

export interface QuizMutationResponse {
  success: boolean;
  message: string;
  data: QuizDetail;
}

export interface DeleteQuizResponse {
  success: boolean;
  message: string;
}

export interface CourseOption {
  _id: string;
  title: string;
}

export interface CourseOptionsResponse {
  success: boolean;
  message?: string;
  data: CourseOption[];
}

export interface QuizQuestionInput {
  questionId?: string;
  type: QuizQuestionType;
  text: string;
  options: QuizOption[];
  marks: number;
  explanation?: string;
  order?: number;
}

export interface QuizWritePayload {
  title: string;
  course: string;
  description?: string;
  settings: QuizSettings;
  questions?: QuizQuestionInput[];
}

export interface QuizFormQuestion {
  questionId?: string;
  type: QuizQuestionType;
  text: string;
  marks: number;
  explanation?: string;
  options: QuizOption[];
}

export interface QuizFormData {
  title: string;
  course: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  questions: QuizFormQuestion[];
}

export type LessonContentType = "VIDEO" | "READING" | "ASSIGNMENT";

export interface ApiResponseBase {
  success: boolean;
  message: string;
}

export interface CourseModule {
  moduleId: string;
  title: string;
  order: number;
}

export interface AddModuleResponse extends ApiResponseBase {
  data: CourseModule;
}

export interface UpdateModulePayload {
  title: string;
}

export interface UpdateModuleResponse extends ApiResponseBase {
  data?: CourseModule;
}

export interface LessonItem {
  _id: string;
  courseId: string;
  moduleId: string;
  title: string;
  type: LessonContentType;
  description: string;
  learningObjectives: string[];
  order: number;
  isVisible: boolean;
  attachments: string[];
  prerequisiteLesson?: string | null;
  readingContent?: string;
  assignmentInstructions?: string;
  contentFile?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonResponse extends ApiResponseBase {
  data: LessonItem;
}

export interface UpdateLessonResponse extends ApiResponseBase {
  data?: LessonItem;
}

export interface GetLessonByIdResponse extends ApiResponseBase {
  data: LessonItem;
}

export type DeleteResponse = ApiResponseBase;

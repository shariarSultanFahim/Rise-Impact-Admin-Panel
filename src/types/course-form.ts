export type LessonType = "video" | "reading" | "assignment";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

export interface LessonForm {
  id: string;
  backendId?: string;
  isDraft?: boolean;
  title: string;
  type: LessonType;
  description: string;
  resourceLink?: string;
  objectives: string[];
  prerequisites: string[];
  attachments: string[];
  isPublished: boolean;
}

export interface ModuleForm {
  id: string;
  backendId?: string;
  title: string;
  lessons: LessonForm[];
}

export interface CourseForm {
  title: string;
  status: CourseStatus;
  description: string;
  thumbnailUrl: string;
  modules: ModuleForm[];
}

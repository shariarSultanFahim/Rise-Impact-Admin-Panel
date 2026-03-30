export type LessonType = "video" | "reading" | "quiz";
export type CourseStatus = "DRAFT" | "PUBLISHED" | "SCHEDULED";

export interface LessonAttachment {
  url?: string;
  name?: string;
}

export type LessonAttachmentValue = string | LessonAttachment;

export interface LessonForm {
  id: string;
  backendId?: string;
  title: string;
  type: LessonType;
  description: string;
  resourceLink?: string;
  quizId?: string;
  objectives: string[];
  prerequisites: string[];
  attachments: LessonAttachmentValue[];
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

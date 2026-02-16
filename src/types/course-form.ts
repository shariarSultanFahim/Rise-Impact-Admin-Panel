export type LessonType = "video" | "reading" | "assignment";

export interface LessonForm {
  id: string;
  title: string;
  type: LessonType;
  description: string;
  resourceLink: string;
  objectives: string[];
  prerequisites: string[];
  attachments: string[];
  isPublished: boolean;
}

export interface ModuleForm {
  id: string;
  title: string;
  lessons: LessonForm[];
}

export interface CourseForm {
  title: string;
  status: "Active" | "In Active" | "Upcoming";
  publishedAt: string;
  description: string;
  thumbnailUrl: string;
  modules: ModuleForm[];
}

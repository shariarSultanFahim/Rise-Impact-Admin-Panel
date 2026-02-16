import type { CourseForm } from "./course-form";
import type { CourseStatus } from "./courses";

export interface CourseDetail extends CourseForm {
  id: string;
  status: CourseStatus;
  thumbnailPreviewUrl: string;
}

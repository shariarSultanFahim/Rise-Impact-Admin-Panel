import type { CourseForm, ModuleForm } from "./course-form";

export interface CourseDetail extends CourseForm {
  id: string;
  thumbnailPreviewUrl: string;
}

export interface CourseDetailByIdItem {
  _id: string;
  title: string;
  status: string;
  thumbnail: string;
  description: string;
  modules: ModuleForm[];
}

export interface CourseDetailByIdResponse {
  success: boolean;
  message: string;
  data?: CourseDetailByIdItem;
}

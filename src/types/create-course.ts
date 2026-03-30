import type { CourseManageItem, CourseManageStatus } from "./course-manage";

export interface CreateCoursePayload {
  title: string;
  description: string;
  status: CourseManageStatus;
  thumbnail: File;
}

export interface CreateCourseResponseData extends CourseManageItem {
  id?: string;
}

export interface CreateCourseResponse {
  success: boolean;
  message: string;
  data: CreateCourseResponseData;
}

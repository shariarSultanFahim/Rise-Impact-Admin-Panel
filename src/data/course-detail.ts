import type { CourseDetail } from "@/types/course-detail";

import courseDetailData from "./course-detail.json";

export async function getCourseDetail(courseId: string): Promise<CourseDetail | null> {
  const courses = courseDetailData as CourseDetail[];
  return courses.find((course) => course.id === courseId) ?? null;
}

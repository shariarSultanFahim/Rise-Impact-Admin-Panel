import type { CoursesData } from "@/types/courses";

import coursesData from "./courses.json";

export async function getCoursesData(): Promise<CoursesData> {
  return coursesData as CoursesData;
}

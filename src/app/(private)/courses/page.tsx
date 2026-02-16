import { Suspense } from "react";

import { getCoursesData } from "@/data/courses";

import Courses from "./component/Courses";
import CoursesSkeleton from "./component/CoursesSkeleton";

async function CoursesContent() {
  const data = await getCoursesData();

  return <Courses data={data} />;
}

export default function CoursesPage() {
  return (
    <section className="flex flex-col gap-6">
      <Suspense fallback={<CoursesSkeleton />}>
        <CoursesContent />
      </Suspense>
    </section>
  );
}

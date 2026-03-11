"use client";

import { useState } from "react";

import { useGetCourses } from "@/lib/api/courses/get-courses";

import type { CourseManageQueryParams } from "@/types";

import Courses from "./component/Courses";
import CoursesSkeleton from "./component/CoursesSkeleton";

export default function CoursesPage() {
  const [params, setParams] = useState<CourseManageQueryParams>({
    page: 1,
    limit: 10
  });

  const { data, isPending } = useGetCourses(params);

  if (isPending) {
    return (
      <section className="flex flex-col gap-6">
        <CoursesSkeleton />
      </section>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="flex flex-col gap-6">
      <Courses data={data} params={params} onParamsChange={setParams} />
    </section>
  );
}

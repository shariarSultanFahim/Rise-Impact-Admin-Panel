"use client";

import { useState } from "react";

import { useGetCourses } from "@/lib/api/courses/get-courses";

import type { CourseManageQueryParams } from "@/types";

import Courses from "./component/Courses";

export default function CoursesPage() {
  const [params, setParams] = useState<CourseManageQueryParams>({
    page: 1,
    limit: 6,
    sort: "-createdAt"
  });

  const { data, isPending } = useGetCourses(params);

  return (
    <section className="flex flex-col gap-6">
      <Courses data={data} isLoading={isPending} params={params} onParamsChange={setParams} />
    </section>
  );
}

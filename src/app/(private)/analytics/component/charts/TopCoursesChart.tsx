"use client";

import type { AnalyticsTopCourse } from "@/types/analytics";

import { CardContent } from "@/components/ui/card";

type TopCoursesChartProps = {
  data: AnalyticsTopCourse[];
};

export default function TopCoursesChart({ data }: TopCoursesChartProps) {
  return (
    <CardContent className="space-y-4">
      {data.map((course, index) => {
        return (
          <div key={course.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white`}
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{course.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.students} students enrolled
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground">{course.completion}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-primary/50">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${course.completion}%` }}
              />
            </div>
          </div>
        );
      })}
    </CardContent>
  );
}

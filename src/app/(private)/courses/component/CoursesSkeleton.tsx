import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CoursesHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-44" />
    </div>
  );
}

export function CoursesFiltersSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
        <Skeleton className="h-10 w-full lg:max-w-md" />
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-10 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CoursesStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={`stat-${index}`} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>
              <Skeleton className="h-4 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CoursesGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={`course-${index}`} className="overflow-hidden shadow-sm">
          <Skeleton className="h-36 w-full" />
          <CardContent className="space-y-4 p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-10" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function CoursesPaginationSkeleton() {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <Skeleton className="h-4 w-40" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

export default function CoursesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <CoursesHeaderSkeleton />
      <CoursesStatsSkeleton />
      <CoursesFiltersSkeleton />
      <CoursesGridSkeleton />
      <CoursesPaginationSkeleton />
    </div>
  );
}

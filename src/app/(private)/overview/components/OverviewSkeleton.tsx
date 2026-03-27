import { Card, CardAction, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`stat-skeleton-${index}`} className="shadow-sm">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
              <CardAction>
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-44" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={`trend-${index}`} className="shadow-sm">
              <CardHeader>
                <Skeleton className="h-5 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <div className="flex justify-between">
                  {Array.from({ length: 6 }).map((__, axisIndex) => (
                    <Skeleton key={`axis-${index}-${axisIndex}`} className="h-3 w-8" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`activity-${index}`}
              className="flex items-start gap-3 rounded-md bg-white p-2"
            >
              <Skeleton className="mt-1 h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

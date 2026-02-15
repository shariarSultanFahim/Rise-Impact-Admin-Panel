import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GamificationSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                <Skeleton className="h-4 w-36" />
              </CardTitle>
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`badge-skeleton-${index}`} className="rounded-lg border p-4">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="mt-2 h-4 w-64" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-40" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={`template-skeleton-${index}`} className="rounded-lg border p-4">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="mt-2 h-3 w-60" />
                  <Skeleton className="mt-3 h-8 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-28" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={`leader-skeleton-${index}`} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-4 w-32" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={`stat-skeleton-${index}`} className="h-6 w-24" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

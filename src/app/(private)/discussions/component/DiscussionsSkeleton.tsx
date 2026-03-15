import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DiscussionFiltersSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full sm:max-w-md" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-full sm:w-[220px]" />
          <Skeleton className="h-9 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function DiscussionListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: items }).map((_, index) => (
          <div
            key={`thread-${index}`}
            className="flex flex-col gap-3 rounded-lg border bg-muted/20 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="flex flex-1 items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-56" />
                <Skeleton className="h-3 w-full max-w-xl" />
                <Skeleton className="h-20 w-full max-w-xs rounded-lg" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DiscussionPaginationSkeleton() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

export function DiscussionDetailSkeleton() {
  return (
    <div className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto pr-1">
      <div className="rounded-xl border bg-muted/20 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-1 items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-56" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`detail-reply-${index}`} className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-xl border bg-primary/5 p-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

export default function DiscussionsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-72" />
      </div>

      <DiscussionFiltersSkeleton />
      <DiscussionListSkeleton />
      <DiscussionPaginationSkeleton />
    </div>
  );
}

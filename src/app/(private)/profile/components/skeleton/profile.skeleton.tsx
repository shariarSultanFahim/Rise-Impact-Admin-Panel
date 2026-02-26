import { Skeleton } from "@/components/ui/skeleton";

export function UserProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="rounded-3xl bg-muted/50 p-6">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="size-28 rounded-full" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
        <div className="rounded-3xl bg-muted/50 p-6">
          <Skeleton className="h-4 w-40" />
          <div className="mt-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

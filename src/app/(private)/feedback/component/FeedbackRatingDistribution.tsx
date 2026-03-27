"use client";

import type { RatingDistributionBucket } from "@/types/feedback";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackRatingDistributionProps {
  isSummaryPending: boolean;
  ratingDistribution: Array<RatingDistributionBucket & { percentage: number }>;
}

export default function FeedbackRatingDistribution({
  isSummaryPending,
  ratingDistribution
}: FeedbackRatingDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isSummaryPending
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={`rating-distribution-skeleton-${index}`} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-2.5 w-full" />
              </div>
            ))
          : ratingDistribution.map((bucket) => (
              <div key={`rating-bucket-${bucket.rating}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{bucket.rating} star</span>
                  <span className="font-medium text-foreground">
                    {bucket.count} ({bucket.percentage}%)
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted">
                  <div
                    className="h-2.5 rounded-full bg-amber-500"
                    style={{ width: `${bucket.percentage}%` }}
                  />
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  );
}

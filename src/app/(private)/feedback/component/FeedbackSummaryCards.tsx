"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

import type { FeedbackAdminSummary, GrowthType } from "@/types/feedback";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FeedbackSummaryCardsProps {
  isSummaryPending: boolean;
  summary?: FeedbackAdminSummary;
  pendingOnly: boolean;
  onPendingOnlyToggle: () => void;
}

const growthTextClass = (growthType: GrowthType) => {
  if (growthType === "increase") {
    return "text-emerald-600";
  }

  if (growthType === "decrease") {
    return "text-rose-600";
  }

  return "text-muted-foreground";
};

const toGrowthText = (value: number, growthType: GrowthType, suffix: string = "%") => {
  if (growthType === "increase") {
    return `+${value}${suffix}`;
  }

  if (growthType === "decrease") {
    return `-${value}${suffix}`;
  }

  return "--";
};

export default function FeedbackSummaryCards({
  isSummaryPending,
  summary,
  pendingOnly,
  onPendingOnlyToggle
}: FeedbackSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {isSummaryPending ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Card key={`feedback-summary-skeleton-${index}`}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-28" />
            </CardContent>
          </Card>
        ))
      ) : (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {summary?.totalReviews.value ?? 0}
              </div>
              <p
                className={`mt-1 text-xs ${growthTextClass(summary?.totalReviews.growthType ?? "no_change")}`}
              >
                {(summary?.totalReviews.growthType ?? "no_change") === "increase" ? (
                  <ArrowUp className="mr-1 inline h-3 w-3" />
                ) : null}
                {(summary?.totalReviews.growthType ?? "no_change") === "decrease" ? (
                  <ArrowDown className="mr-1 inline h-3 w-3" />
                ) : null}
                {toGrowthText(
                  summary?.totalReviews.growth ?? 0,
                  summary?.totalReviews.growthType ?? "no_change"
                )}{" "}
                vs last {summary?.comparisonPeriod ?? "month"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {(summary?.averageRating.value ?? 0).toFixed(1)} / 5.0
              </div>
              <p
                className={`mt-1 text-xs ${growthTextClass(summary?.averageRating.growthType ?? "no_change")}`}
              >
                {(summary?.averageRating.growthType ?? "no_change") === "increase" ? (
                  <ArrowUp className="mr-1 inline h-3 w-3" />
                ) : null}
                {(summary?.averageRating.growthType ?? "no_change") === "decrease" ? (
                  <ArrowDown className="mr-1 inline h-3 w-3" />
                ) : null}
                {toGrowthText(
                  summary?.averageRating.growth ?? 0,
                  summary?.averageRating.growthType ?? "no_change",
                  ""
                )}{" "}
                vs last {summary?.comparisonPeriod ?? "month"}
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer" onClick={onPendingOnlyToggle}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Pending Responses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {summary?.pendingResponses ?? 0}
              </div>
              <p className="mt-1 text-xs text-amber-600">
                {pendingOnly ? "Showing pending only" : "Click to filter pending"}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

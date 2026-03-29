"use client";

import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GradebookSummary } from "@/types";

interface GradebookSummaryCardsProps {
  isSummaryPending: boolean;
  summary?: GradebookSummary;
}

const growthTextClass = (growthType: "increase" | "decrease" | "no_change"): string => {
  switch (growthType) {
    case "increase":
      return "text-emerald-600";
    case "decrease":
      return "text-red-600";
    case "no_change":
      return "text-muted-foreground";
    default:
      return "text-muted-foreground";
  }
};

const toGrowthText = (
  growth: number,
  growthType: "increase" | "decrease" | "no_change"
): string => {
  if (growthType === "increase") return `↑ ${growth}`;
  if (growthType === "decrease") return `↓ ${growth}`;
  return "—";
};

const GrowthIcon = ({ growthType }: { growthType: "increase" | "decrease" | "no_change" }) => {
  if (growthType === "increase") {
    return <TrendingUp className="h-4 w-4 text-emerald-600" />;
  }
  if (growthType === "decrease") {
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  }
  return null;
};

const toSafeNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

export default function GradebookSummaryCards({
  isSummaryPending,
  summary
}: GradebookSummaryCardsProps) {
  if (isSummaryPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`stat-skeleton-${index}`} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const avgQuizScoreValue = toSafeNumber(summary.avgQuizScore?.value);
  const avgCompletionValue = toSafeNumber(summary.avgCompletion?.value);
  const pendingAssignments = toSafeNumber(summary.pendingAssignments);
  const atRiskStudents = toSafeNumber(summary.atRiskStudents);

  const cards = [
    {
      title: "Avg Quiz Score",
      value: `${avgQuizScoreValue.toFixed(1)}%`,
      growth: summary.avgQuizScore
    },
    {
      title: "Avg Completion",
      value: `${avgCompletionValue.toFixed(1)}%`,
      growth: summary.avgCompletion
    },
    {
      title: "Pending Assignments",
      value: String(pendingAssignments),
      growth: null
    },
    {
      title: "At-Risk Students",
      value: String(atRiskStudents),
      growth: null
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={`stat-${index}`} className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">{card.value}</div>
            {card.growth ? (
              <div
                className={`flex items-center gap-1 text-xs font-medium ${growthTextClass(card.growth.growthType)}`}
              >
                <GrowthIcon growthType={card.growth.growthType} />
                <span>
                  {toGrowthText(card.growth.growth, card.growth.growthType)} vs last month
                </span>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">Action needed</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

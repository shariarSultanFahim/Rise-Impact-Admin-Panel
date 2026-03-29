"use client";

import { PencilLineIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { GamificationBadgeCriteriaType, GamificationBadgeItem } from "@/types";

type BadgesAchievementsProps = {
  badges: GamificationBadgeItem[];
  onEditBadge: (badge: GamificationBadgeItem) => void;
};

const criteriaLabelMap: Record<GamificationBadgeCriteriaType, string> = {
  POINTS_THRESHOLD: "Points Threshold",
  COURSES_COMPLETED: "Courses Completed",
  QUIZZES_PASSED: "Quizzes Passed",
  PERFECT_QUIZ: "Perfect Quiz",
  STREAK_DAYS: "Streak Days",
  CUSTOM: "Custom"
};

export default function BadgesAchievements({ badges, onEditBadge }: BadgesAchievementsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">Badges & Achievements</CardTitle>
          <CardDescription className="text-xs">
            Update seeded badge rules and visibility.
          </CardDescription>
        </div>
        <CardAction>
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
            {badges.length} badges
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {badges.length === 0 ? (
          <div className="rounded-md border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
            No badges found.
          </div>
        ) : null}

        {badges.map((badge) => (
          <Card key={badge._id} className="border-muted/60 bg-white">
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {badge.description ?? "No description provided"}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                    badge.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {badge.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-md border border-border/60 bg-muted/30 px-2 py-1">
                  Icon: {badge.icon}
                </span>
                <span className="rounded-md border border-border/60 bg-muted/30 px-2 py-1">
                  Criteria: {criteriaLabelMap[badge.criteria.type]}
                </span>
                <span className="rounded-md border border-border/60 bg-muted/30 px-2 py-1">
                  Threshold: {badge.criteria.threshold}
                </span>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => onEditBadge(badge)}
                >
                  <PencilLineIcon className="size-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

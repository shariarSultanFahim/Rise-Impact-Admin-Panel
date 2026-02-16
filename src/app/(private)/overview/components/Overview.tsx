import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpen,
  CheckSquare,
  MessageSquareText,
  Percent,
  UserPlus,
  Users
} from "lucide-react";

import type { OverviewData, OverviewIconKey } from "@/types/overview";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import CompletionTrendsChart from "../../analytics/component/charts/CompletionTrendsChart";

const ICONS: Record<OverviewIconKey, LucideIcon> = {
  students: Users,
  courses: BookOpen,
  completion: Percent,
  approvals: CheckSquare,
  feedback: MessageSquareText,
  discussion: MessageSquareText,
  badges: BadgeCheck,
  "activity-student": UserPlus,
  "activity-quiz": BookOpen,
  "activity-feedback": MessageSquareText,
  "activity-badge": BadgeCheck
};

interface OverviewProps {
  data: OverviewData;
}

export default function Overview({ data }: OverviewProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{data.heading.title}</h1>
        <p className="text-sm text-muted-foreground">{data.heading.subtitle}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const Icon = ICONS[stat.icon];

          return (
            <Card key={stat.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <CardAction>
                  <div className="rounded-full bg-muted p-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
                {stat.delta ? (
                  <div className="text-xs text-emerald-600">
                    {stat.delta} {stat.deltaLabel}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Course Completion Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CompletionTrendsChart data={data.completionTrends} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.activities.map((activity) => {
              const Icon = ICONS[activity.icon];

              return (
                <div key={activity.id} className="flex items-start gap-3 rounded-md bg-white p-2">
                  <div className="mt-1 rounded-full bg-muted p-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <CardDescription className="text-xs">{activity.description}</CardDescription>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {data.summaries.map((summary) => {
          const Icon = ICONS[summary.icon];

          return (
            <Card key={summary.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {summary.title}
                </CardTitle>
                <CardAction>
                  <div className="rounded-full bg-muted p-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-semibold text-foreground">
                  {summary.value}{" "}
                  <span className="text-xs text-muted-foreground">{summary.label}</span>
                </div>
                <div className="text-xs text-muted-foreground">{summary.subtitle}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

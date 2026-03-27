import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  BookOpen,
  CheckSquare,
  MessageSquareText,
  Percent,
  UserPlus,
  Users
} from "lucide-react";

import type { OverviewData, OverviewIconKey, TrendPeriod } from "@/types/overview";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import CompletionTrendsChart from "./CompletionTrendsChart";
import EnrollmentTrendsChart from "./EnrollmentTrendsChart";
import PeriodCombobox from "./PeriodCombobox";

const ICONS: Record<OverviewIconKey, LucideIcon> = {
  students: Users,
  courses: BookOpen,
  completion: Percent,
  approvals: CheckSquare,
  feedback: MessageSquareText,
  discussion: MessageSquareText,
  badges: BadgeCheck,
  "activity-student": UserPlus,
  "activity-completion": CheckSquare,
  "activity-quiz": BookOpen
};

interface OverviewProps {
  data: OverviewData;
  period: TrendPeriod;
  onPeriodChange: (period: TrendPeriod) => void;
}

export default function Overview({ data, period, onPeriodChange }: OverviewProps) {
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
                  <div
                    className={
                      stat.deltaType === "increase"
                        ? "text-xs text-emerald-600"
                        : stat.deltaType === "decrease"
                          ? "text-xs text-rose-600"
                          : "text-xs text-muted-foreground"
                    }
                  >
                    {stat.deltaType === "increase" ? (
                      <ArrowUp className="mr-1 inline h-3 w-3" />
                    ) : null}
                    {stat.deltaType === "decrease" ? (
                      <ArrowDown className="mr-1 inline h-3 w-3" />
                    ) : null}
                    {stat.delta} {stat.deltaLabel}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Trends</h2>
          <PeriodCombobox value={period} onChange={onPeriodChange} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Enrollment Trends</CardTitle>
            </CardHeader>
            <EnrollmentTrendsChart data={data.enrollmentTrends} />
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Completion Trends</CardTitle>
            </CardHeader>
            <CompletionTrendsChart data={data.completionTrends} />
          </Card>
        </div>
      </div>

      <div>
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
    </div>
  );
}

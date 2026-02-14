import {
  BadgeCheck,
  BookOpen,
  CheckSquare,
  MessageSquareText,
  Percent,
  UserPlus,
  Users
} from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { OverviewData, OverviewIconKey } from "@/types/overview";
import type { LucideIcon } from "lucide-react";

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

function buildChartPoints(values: number[], width: number, height: number) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const lastIndex = Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = (index / lastIndex) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

export default function Overview({ data }: OverviewProps) {
  const chartWidth = 320;
  const chartHeight = 140;
  const chartPoints = buildChartPoints(data.chart.values, chartWidth, chartHeight);

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
            <div className="rounded-lg border bg-muted/20 p-4">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="h-40 w-full"
                aria-hidden
              >
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  points={chartPoints}
                />
                {data.chart.values.map((value, index) => {
                  const lastIndex = Math.max(data.chart.values.length - 1, 1);
                  const x = (index / lastIndex) * chartWidth;
                  const max = Math.max(...data.chart.values);
                  const min = Math.min(...data.chart.values);
                  const range = max - min || 1;
                  const y = chartHeight - ((value - min) / range) * chartHeight;

                  return (
                    <circle key={`${value}-${index}`} cx={x} cy={y} r="3" fill="#f59e0b" />
                  );
                })}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {data.chart.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
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
                <div key={activity.id} className="flex gap-3">
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
                <div className="text-2xl font-semibold text-foreground">{summary.value} <span className="text-xs text-muted-foreground">{summary.label}</span></div>
                <div className="text-xs text-muted-foreground">{summary.subtitle}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

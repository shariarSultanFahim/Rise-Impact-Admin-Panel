"use client";

import type { AnalyticsHeatmapDay } from "@/types/analytics";

import { CardContent } from "@/components/ui/card";

const HEATMAP_LEVELS = [
  "bg-muted",
  "bg-[#576045]/10",
  "bg-[#576045]/40",
  "bg-[#576045]/60",
  "bg-[#576045]"
];

type EngagementHeatmapChartProps = {
  data: AnalyticsHeatmapDay[];
};

export default function EngagementHeatmapChart({ data }: EngagementHeatmapChartProps) {
  return (
    <CardContent className="space-y-3">
      <div className="grid grid-cols-[auto_1fr] gap-3 text-xs text-muted-foreground">
        <div className="space-y-3">
          {data.map((row) => (
            <div key={row.day} className="flex h-5 items-center">
              {row.day}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {data.map((row) => (
            <div key={`${row.day}-row`} className="grid grid-cols-7 gap-2">
              {row.values.map((value, index) => {
                const safeIndex = Math.min(Math.max(value, 0), HEATMAP_LEVELS.length - 1);

                return (
                  <div
                    key={`${row.day}-${index}`}
                    className={`h-5 w-full rounded-sm ${HEATMAP_LEVELS[safeIndex]}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {HEATMAP_LEVELS.slice(1).map((level) => (
            <span key={level} className={`h-2.5 w-2.5 rounded-sm ${level}`} />
          ))}
        </div>
        <span>More</span>
      </div>
    </CardContent>
  );
}

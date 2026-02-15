"use client";

import * as React from "react";

import type { TooltipProps } from "recharts";
import { ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
  children: React.ReactElement;
};

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, children, ...props }, ref) => {
    const style = Object.entries(config).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[`--color-${key}`] = value.color;
      return acc;
    }, {});

    return (
      <div ref={ref} className={cn("h-56 w-full", className)} style={style} {...props}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

type ChartTooltipContentProps = TooltipProps<number, string> & {
  config?: ChartConfig;
};

function ChartTooltipContent({ active, payload, label, config }: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="space-y-1 rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="space-y-0.5">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? "value");
          const configItem = config?.[key];
          const labelText = configItem?.label ?? key;

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{labelText}</span>
              <span className="font-medium text-foreground">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChartTooltip = Tooltip;

export { ChartContainer, ChartTooltip, ChartTooltipContent };

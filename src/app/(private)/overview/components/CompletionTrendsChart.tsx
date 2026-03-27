"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { OverviewCompletionTrends } from "@/types/overview";

import { CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  completion: {
    label: "Completions",
    color: "#f59e0b"
  }
};

interface CompletionTrendsChartProps {
  data: OverviewCompletionTrends[];
}

export default function CompletionTrendsChart({ data }: CompletionTrendsChartProps) {
  return (
    <CardContent>
      <ChartContainer config={chartConfig}>
        <LineChart data={data} margin={{ left: -5, right: 16 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent config={chartConfig} />} />
          <Line
            dataKey="value"
            stroke="var(--color-completion)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </CardContent>
  );
}

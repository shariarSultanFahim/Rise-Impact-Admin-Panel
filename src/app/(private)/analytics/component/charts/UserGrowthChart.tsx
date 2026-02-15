"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { AnalyticsLinePoint } from "@/types/analytics";

import { CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  growth: {
    label: "Students",
    color: "#f97316"
  }
};

type UserGrowthChartProps = {
  data: AnalyticsLinePoint[];
};

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  return (
    <CardContent>
      <ChartContainer config={chartConfig}>
        <LineChart data={data} margin={{ left: -5, right: 16 }}>
          <CartesianGrid vertical={true} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent config={chartConfig} />} />
          <Line
            dataKey="value"
            stroke="var(--color-growth)"
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </CardContent>
  );
}

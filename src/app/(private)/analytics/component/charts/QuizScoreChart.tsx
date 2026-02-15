"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import type { AnalyticsBarPoint } from "@/types/analytics";

import { CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  score: {
    label: "Students",
    color: "#576045"
  }
};

type QuizScoreChartProps = {
  data: AnalyticsBarPoint[];
};

export default function QuizScoreChart({ data }: QuizScoreChartProps) {
  return (
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart data={data} margin={{ left: -5, right: 16 }}>
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent config={chartConfig} />} />
          <Bar dataKey="value" fill="var(--color-score)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  );
}

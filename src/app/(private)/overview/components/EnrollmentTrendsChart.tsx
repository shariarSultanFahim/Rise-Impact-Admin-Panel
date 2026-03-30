"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { OverviewEnrollmentTrends } from "@/types/overview";

import { CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  enrollment: {
    label: "Enrollments",
    color: "#0ea5e9"
  }
};

interface EnrollmentTrendsChartProps {
  data: OverviewEnrollmentTrends[];
}

export default function EnrollmentTrendsChart({ data }: EnrollmentTrendsChartProps) {
  return (
    <CardContent>
      <ChartContainer config={chartConfig}>
        <BarChart data={data} margin={{ left: -5, right: 16 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={12} />
          <YAxis tickLine={false} axisLine={false} width={32} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent config={chartConfig} />} />
          <Bar dataKey="value" fill="var(--color-enrollment)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  );
}

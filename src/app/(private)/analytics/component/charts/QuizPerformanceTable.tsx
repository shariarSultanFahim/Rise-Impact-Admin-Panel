"use client";

import { AlertCircle } from "lucide-react";

import type { AnalyticsQuizPerformanceItem } from "@/types/analytics";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const scoreToneClass = (value: number): string => {
  if (value > 70) {
    return "text-emerald-600";
  }

  if (value >= 50) {
    return "text-amber-600";
  }

  return "text-rose-600";
};

interface QuizPerformanceTableProps {
  courseTitle?: string;
  data: AnalyticsQuizPerformanceItem[];
  hasSelection: boolean;
}

export default function QuizPerformanceTable({
  courseTitle,
  data,
  hasSelection
}: QuizPerformanceTableProps) {
  if (!hasSelection) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-dashed border-muted p-4 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4" />
        Select a course to view quiz performance.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-muted p-4 text-sm text-muted-foreground">
        No quiz attempts in this period.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courseTitle ? <p className="text-sm text-muted-foreground">Course: {courseTitle}</p> : null}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Pass Rate</TableHead>
              <TableHead className="text-right">Attempts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.title}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className={scoreToneClass(item.avgScore)}>
                  {item.avgScore.toFixed(1)}%
                </TableCell>
                <TableCell className={scoreToneClass(item.passRate)}>
                  {item.passRate.toFixed(1)}%
                </TableCell>
                <TableCell className="text-right">{item.totalAttempts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

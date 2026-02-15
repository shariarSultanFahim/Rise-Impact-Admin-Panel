"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GradebookData } from "@/types/gradebook";

import GradebookTable from "./GradebookTable";

interface GradebookProps {
  data: GradebookData;
}

export default function Gradebook({ data }: GradebookProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{data.heading.title}</h1>
        <p className="text-sm text-muted-foreground">{data.heading.subtitle}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => {
          const valueClass =
            stat.id === "needs-attention" ? "text-rose-500" : "text-foreground";

          return (
            <Card key={stat.id} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-semibold ${valueClass}`}>{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <GradebookTable
        students={data.students}
        filters={data.filters}
        pagination={data.pagination}
      />
    </div>
  );
}

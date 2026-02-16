import Image from "next/image";

import { BarChart3, BookOpen, Pencil, Trash2, Users } from "lucide-react";

import type { CourseCardItem } from "@/types/courses";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_STYLES: Record<CourseCardItem["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "In Active": "bg-slate-100 text-slate-600",
  Upcoming: "bg-amber-100 text-amber-700"
};

interface CourseCardProps {
  course: CourseCardItem;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden border-muted/60 bg-card pt-0 shadow-sm">
      <figure className="relative h-40 w-full overflow-hidden">
        <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
        <figcaption className="sr-only">{course.title} course thumbnail</figcaption>
        <Badge className={`absolute top-3 right-3 ${STATUS_STYLES[course.status]}`}>
          {course.status}
        </Badge>
      </figure>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{course.title}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
          <div className="flex flex-col items-center gap-1 rounded-xl bg-[#E9EAEA] p-2">
            <BookOpen className="h-4 w-4 text-foreground" />
            <span className="text-[11px]">Modules</span>
            <span className="text-sm font-semibold text-foreground">{course.modules}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl bg-[#E9EAEA] p-2">
            <Users className="h-4 w-4 text-foreground" />
            <span className="text-[11px]">Students</span>
            <span className="text-sm font-semibold text-foreground">{course.students}</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-xl bg-[#E9EAEA] p-2">
            <BarChart3 className="h-4 w-4 text-foreground" />
            <span className="text-[11px]">Complete</span>
            <span className="text-sm font-semibold text-foreground">{course.completionRate}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex-1 gap-2 border-primary">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            size="icon-sm"
            aria-label="Delete course"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

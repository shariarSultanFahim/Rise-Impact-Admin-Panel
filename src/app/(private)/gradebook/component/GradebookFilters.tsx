"use client";

import { ChevronDown, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { CourseOption } from "@/types";

interface GradebookFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCourse: string | null;
  selectedCourseLabel: string;
  courseOptions: CourseOption[];
  onCourseChange: (courseId: string) => void;
  isCourseOptionsPending: boolean;
}

const truncateText = (value: string, maxLength: number = 20): string => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
};

export default function GradebookFilters({
  searchTerm,
  onSearchChange,
  selectedCourse,
  selectedCourseLabel,
  courseOptions,
  onCourseChange,
  isCourseOptionsPending
}: GradebookFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-xl">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by student name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-white pl-9"
          aria-label="Search students"
        />
      </div>

      {isCourseOptionsPending ? (
        <Skeleton className="h-9 w-48" />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 border-primary bg-white">
              <span className="max-w-[150px] truncate text-sm">
                {truncateText(selectedCourseLabel)}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuRadioGroup value={selectedCourse || "all"} onValueChange={onCourseChange}>
              <DropdownMenuRadioItem value="all">All Courses</DropdownMenuRadioItem>
              {courseOptions.map((course) => (
                <DropdownMenuRadioItem key={course._id} value={course._id} title={course.title}>
                  {truncateText(course.title)}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

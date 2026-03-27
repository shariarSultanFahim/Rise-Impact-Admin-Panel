"use client";

import { ChevronDown, Filter, SearchIcon } from "lucide-react";

import type { CourseOption } from "@/types/feedback";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface SortOption {
  label: string;
  value: string;
}

interface FeedbackFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCourse: string;
  selectedCourseLabel: string;
  courseDropdownOpen: boolean;
  onCourseDropdownOpenChange: (open: boolean) => void;
  onCourseChange: (courseId: string) => void;
  isCoursesPending: boolean;
  courseOptions: CourseOption[];
  sortDropdownOpen: boolean;
  onSortDropdownOpenChange: (open: boolean) => void;
  selectedSortLabel: string;
  sortValue: string;
  onSortChange: (sort: string) => void;
  sortOptions: readonly SortOption[];
  allCoursesValue: string;
}

const truncateText = (value: string, maxLength: number = 15) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

export default function FeedbackFilters({
  searchTerm,
  onSearchChange,
  selectedCourse,
  selectedCourseLabel,
  courseDropdownOpen,
  onCourseDropdownOpenChange,
  onCourseChange,
  isCoursesPending,
  courseOptions,
  sortDropdownOpen,
  onSortDropdownOpenChange,
  selectedSortLabel,
  sortValue,
  onSortChange,
  sortOptions,
  allCoursesValue
}: FeedbackFiltersProps) {
  return (
    <div className="flex flex-col gap-4 py-0 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search in review text..."
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          className="bg-white pl-9"
        />
      </div>

      <DropdownMenu open={courseDropdownOpen} onOpenChange={onCourseDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full gap-2 border-primary sm:w-44 sm:justify-between"
          >
            <span className="inline-flex items-center justify-center rounded-md text-xs text-muted-foreground">
              <Filter className="h-3 w-3" />
            </span>
            <span className="max-w-[92px] truncate" title={selectedCourseLabel}>
              {truncateText(selectedCourseLabel)}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuRadioGroup value={selectedCourse} onValueChange={onCourseChange}>
            <DropdownMenuRadioItem value={allCoursesValue}>All Courses</DropdownMenuRadioItem>
            {isCoursesPending ? (
              <DropdownMenuRadioItem value="loading" disabled>
                Loading courses...
              </DropdownMenuRadioItem>
            ) : (
              courseOptions.map((course) => (
                <DropdownMenuRadioItem key={course._id} value={course._id}>
                  <span title={course.title}>{truncateText(course.title)}</span>
                </DropdownMenuRadioItem>
              ))
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu open={sortDropdownOpen} onOpenChange={onSortDropdownOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full gap-2 border-primary sm:w-44 sm:justify-between"
          >
            <span className="max-w-[120px] truncate" title={selectedSortLabel}>
              {selectedSortLabel}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuRadioGroup value={sortValue} onValueChange={onSortChange}>
            {sortOptions.map((sortOption) => (
              <DropdownMenuRadioItem key={sortOption.value} value={sortOption.value}>
                {sortOption.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

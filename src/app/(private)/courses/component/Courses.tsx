"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { useDebounceValue } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { CourseManageQueryParams, CourseManageResponse, CourseManageStatus } from "@/types";

import CourseCard from "./CourseCard";

const STATUS_OPTIONS: Array<{ label: string; value: CourseManageStatus | "" }> = [
  { label: "All", value: "" },
  { label: "Draft", value: "DRAFT" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Scheduled", value: "SCHEDULED" },
  { label: "Archived", value: "ARCHIVED" }
];

interface CoursesProps {
  data: CourseManageResponse;
  params: CourseManageQueryParams;
  onParamsChange: (params: CourseManageQueryParams) => void;
}

export default function Courses({ data, params, onParamsChange }: CoursesProps) {
  const [searchTerm, setSearchTerm] = useState(params.searchTerm ?? "");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 600);
  const activeStatus = params.status ?? "";
  const currentPage = data.pagination.page;
  const totalPages = data.pagination.totalPage;

  useEffect(() => {
    if ((params.searchTerm ?? "") === debouncedSearchTerm) {
      return;
    }

    onParamsChange({ ...params, searchTerm: debouncedSearchTerm, page: 1 });
  }, [debouncedSearchTerm, onParamsChange, params]);

  const stats = [
    { id: "total", title: "Total Courses", value: String(data.pagination.total) },
    {
      id: "published",
      title: "Published",
      value: String(data.data.filter((c) => c.status === "PUBLISHED").length)
    },
    {
      id: "draft",
      title: "Drafts",
      value: String(data.data.filter((c) => c.status === "DRAFT").length)
    },
    {
      id: "enrolled",
      title: "Total Enrolled",
      value: String(data.data.reduce((sum, c) => sum + c.enrollmentCount, 0))
    }
  ];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (value: string) => {
    onParamsChange({ ...params, status: value as CourseManageStatus | "", page: 1 });
  };

  const handlePageChange = (page: number) => {
    onParamsChange({ ...params, page });
  };

  const activeStatusLabel = STATUS_OPTIONS.find((o) => o.value === activeStatus)?.label ?? "All";

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage and track all your courses</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/courses/create">
            <Plus className="h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id} className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search courses..."
              className="bg-white pl-9"
              aria-label="Search courses"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-primary">
                  <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs text-muted-foreground">
                    <Filter className="h-3 w-3" />
                  </span>
                  {activeStatusLabel}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuRadioGroup value={activeStatus} onValueChange={handleStatusChange}>
                  {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuRadioItem key={option.value || "all"} value={option.value}>
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.data.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {data.data.length} of {data.pagination.total} courses
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;
            return (
              <Button
                key={`page-${page}`}
                variant={isActive ? "default" : "outline"}
                size="sm"
                className={isActive ? "bg-primary text-primary-foreground" : ""}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import { useGetGradebookCourseOptions } from "@/lib/api/gradebook/get-course-options";
import { useGetGradebookStudents } from "@/lib/api/gradebook/get-gradebook-students";
import { useGetGradebookSummary } from "@/lib/api/gradebook/get-gradebook-summary";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { GradebookAdminQueryParams } from "@/types";

import GradebookFilters from "./GradebookFilters";
import GradebookSummaryCards from "./GradebookSummaryCards";
import GradebookTable from "./GradebookTable";

interface GradebookParams extends GradebookAdminQueryParams {
  page: number;
  limit: number;
  status: "ACTIVE" | "COMPLETED";
}

export default function GradebookContent() {
  const [params, setParams] = useState<GradebookParams>({
    page: 1,
    limit: 10,
    status: "ACTIVE"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Build query params for API
  const queryParams = useMemo(() => {
    const result: GradebookAdminQueryParams = {
      page: params.page,
      limit: params.limit,
      status: params.status
    };

    if (searchTerm && searchTerm.trim()) {
      result.searchTerm = searchTerm;
    }

    if (selectedCourse && selectedCourse !== "all") {
      result.courseId = selectedCourse;
    }

    return result;
  }, [params, searchTerm, selectedCourse]);

  // API calls
  const {
    data: summaryResponse,
    isPending: isSummaryPending,
    isError: isSummaryError
  } = useGetGradebookSummary();

  const {
    data: listResponse,
    isPending: isListPending,
    isError: isListError
  } = useGetGradebookStudents(queryParams);

  const { data: courseOptionsResponse, isPending: isCourseOptionsPending } =
    useGetGradebookCourseOptions();

  // Extract data from responses
  const summary = summaryResponse?.data;
  const gradebookList = listResponse?.data ?? [];
  const pagination = listResponse?.pagination;
  const courseOptions = courseOptionsResponse?.data ?? [];

  // Get selected course label for display
  const selectedCourseLabel = selectedCourse
    ? courseOptions.find((c) => c._id === selectedCourse)?.title || "Select Course"
    : "All Courses";

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setParams((prev) => ({ ...prev, page: 1 }));
  };

  // Handle course filter change
  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId === "all" ? null : courseId);
    setParams((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Gradebook Management</h1>
        <p className="text-sm text-muted-foreground">
          Monitor student progress, quiz scores, and assignment submissions
        </p>
      </header>

      {/* Summary Cards */}
      <GradebookSummaryCards isSummaryPending={isSummaryPending} summary={summary} />

      {/* Filters & Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <GradebookFilters
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            selectedCourse={selectedCourse}
            selectedCourseLabel={selectedCourseLabel}
            courseOptions={courseOptions}
            onCourseChange={handleCourseChange}
            isCourseOptionsPending={isCourseOptionsPending}
          />
        </CardHeader>
        <CardContent>
          <GradebookTable
            students={gradebookList}
            isLoading={isListPending}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>

      {/* Error States */}
      {isSummaryError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">Failed to load summary. Please try again.</p>
          </CardContent>
        </Card>
      )}

      {isListError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-600">Failed to load gradebook. Please try again.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

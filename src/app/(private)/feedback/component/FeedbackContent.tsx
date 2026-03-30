"use client";

import { useMemo, useState } from "react";

import { useDebounceValue } from "usehooks-ts";

import type { FeedbackAdminItem, FeedbackAdminQueryParams } from "@/types/feedback";

import { useGetAdminFeedbacks } from "@/lib/api/feedback/get-admin-feedbacks";
import { useGetFeedbackAdminSummary } from "@/lib/api/feedback/get-admin-summary";
import { useGetFeedbackCourseOptions } from "@/lib/api/feedback/get-course-options";

import Pagination from "@/components/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import FeedbackFilters from "./FeedbackFilters";
import FeedbackModal from "./FeedbackModal";
import FeedbackRatingDistribution from "./FeedbackRatingDistribution";
import FeedbackSummaryCards from "./FeedbackSummaryCards";
import FeedbackTable from "./FeedbackTable";

const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "-createdAt";
const ALL_COURSES = "ALL_COURSES";

const SORT_OPTIONS = [
  { label: "Newest first", value: "-createdAt" },
  { label: "Oldest first", value: "createdAt" },
  { label: "Highest rating", value: "-rating" },
  { label: "Lowest rating", value: "rating" }
] as const;

export default function FeedbackContent() {
  const [params, setParams] = useState<FeedbackAdminQueryParams>({
    page: 1,
    limit: DEFAULT_LIMIT,
    sort: DEFAULT_SORT
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
  const [selectedCourse, setSelectedCourse] = useState<string>(ALL_COURSES);
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackAdminItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [pendingOnly, setPendingOnly] = useState(false);

  const { data: summaryResponse, isPending: isSummaryPending } = useGetFeedbackAdminSummary();
  const { data: courseOptionsResponse, isPending: isCoursesPending } =
    useGetFeedbackCourseOptions();

  const queryParams = useMemo(
    () => ({
      ...params,
      searchTerm: debouncedSearchTerm || undefined
    }),
    [debouncedSearchTerm, params]
  );

  const { data: feedbackListResponse, isPending: isListPending } =
    useGetAdminFeedbacks(queryParams);

  const summary = summaryResponse?.data;
  const listPagination = feedbackListResponse?.pagination;
  const filteredSubmissions = useMemo(() => {
    const listData = feedbackListResponse?.data ?? [];

    if (!pendingOnly) {
      return listData;
    }

    return listData.filter((submission) => !submission.adminResponse);
  }, [feedbackListResponse?.data, pendingOnly]);

  const totalReviews = summary?.totalReviews.value ?? 0;

  const ratingDistribution = useMemo(() => {
    const buckets = summary?.ratingDistribution ?? [];

    return [5, 4, 3, 2, 1].map((rating) => {
      const matchedBucket = buckets.find((bucket) => bucket.rating === rating);
      const count = matchedBucket?.count ?? 0;
      const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

      return {
        rating,
        count,
        percentage
      };
    });
  }, [summary?.ratingDistribution, totalReviews]);

  const selectedSortLabel =
    SORT_OPTIONS.find((sortOption) => sortOption.value === (params.sort ?? DEFAULT_SORT))?.label ??
    "Newest first";

  const selectedCourseLabel = useMemo(() => {
    if (selectedCourse === ALL_COURSES) {
      return "All Courses";
    }

    return (
      courseOptionsResponse?.data.find((course) => course._id === selectedCourse)?.title ??
      "All Courses"
    );
  }, [courseOptionsResponse?.data, selectedCourse]);

  const handleRowSelect = (submission: FeedbackAdminItem) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page
    }));
  };

  const handleSortChange = (sort: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      sort
    }));
    setSortDropdownOpen(false);
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setParams((prev) => ({
      ...prev,
      page: 1,
      course: courseId === ALL_COURSES ? undefined : courseId
    }));
    setCourseDropdownOpen(false);
  };

  const handlePendingOnlyToggle = () => {
    setPendingOnly((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Feedback Management</h1>
        <p className="text-muted-foreground">Monitor reviews, sentiment, and admin responses</p>
      </div>

      <Card>
        <CardContent>
          <FeedbackFilters
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setParams((prev) => ({
                ...prev,
                page: 1
              }));
            }}
            selectedCourse={selectedCourse}
            selectedCourseLabel={selectedCourseLabel}
            courseDropdownOpen={courseDropdownOpen}
            onCourseDropdownOpenChange={setCourseDropdownOpen}
            onCourseChange={handleCourseChange}
            isCoursesPending={isCoursesPending}
            courseOptions={courseOptionsResponse?.data ?? []}
            sortDropdownOpen={sortDropdownOpen}
            onSortDropdownOpenChange={setSortDropdownOpen}
            selectedSortLabel={selectedSortLabel}
            sortValue={params.sort ?? DEFAULT_SORT}
            onSortChange={handleSortChange}
            sortOptions={SORT_OPTIONS}
            allCoursesValue={ALL_COURSES}
          />
        </CardContent>
      </Card>

      <FeedbackSummaryCards
        isSummaryPending={isSummaryPending}
        summary={summary}
        pendingOnly={pendingOnly}
        onPendingOnlyToggle={handlePendingOnlyToggle}
      />

      <FeedbackRatingDistribution
        isSummaryPending={isSummaryPending}
        ratingDistribution={ratingDistribution}
      />

      <Card>
        <CardContent className="pt-4">
          {isListPending ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={`feedback-row-skeleton-${index}`} className="h-10 w-full" />
              ))}
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="rounded-md border border-border/60 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
              No feedback received yet.
            </div>
          ) : (
            <>
              <FeedbackTable submissions={filteredSubmissions} onSelect={handleRowSelect} />

              <div className="flex flex-col items-start gap-3 border-t px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {filteredSubmissions.length} of {listPagination?.total ?? 0} feedback
                  entries
                </span>
                <Pagination
                  currentPage={listPagination?.page ?? 1}
                  totalPages={listPagination?.totalPage ?? 1}
                  onPageChange={handlePageChange}
                  iconOnly={false}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <FeedbackModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedFeedbackId={selectedSubmission?._id ?? null}
      />
    </div>
  );
}

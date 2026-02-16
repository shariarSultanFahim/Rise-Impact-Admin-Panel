"use client";

import { useMemo, useState } from "react";

import { SearchIcon } from "lucide-react";

import { FeedbackData, FeedbackSubmission } from "@/types/feedback";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import FeedbackModal from "./FeedbackModal";
import FeedbackTable from "./FeedbackTable";

type FeedbackContentProps = {
  data: FeedbackData;
};

export default function FeedbackContent({ data }: FeedbackContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(data.filters.courses[0] ?? "");
  const [selectedSubmission, setSelectedSubmission] = useState<FeedbackSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSubmissions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return data.submissions.filter((submission) => {
      const matchesCourse =
        selectedCourse === data.filters.courses[0] || submission.course === selectedCourse;
      const matchesSearch =
        !normalizedSearch ||
        submission.studentName.toLowerCase().includes(normalizedSearch) ||
        submission.assignment.toLowerCase().includes(normalizedSearch);

      return matchesCourse && matchesSearch;
    });
  }, [data.filters.courses, data.submissions, searchTerm, selectedCourse]);

  const handleRowSelect = (submission: FeedbackSubmission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{data.heading.title}</h1>
        <p className="text-muted-foreground">{data.heading.subtitle}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 py-0 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by student or assignment..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="bg-white pl-9"
            />
          </div>
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              {data.filters.courses.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-4">
          <FeedbackTable submissions={filteredSubmissions} onSelect={handleRowSelect} />
        </CardContent>
        <div className="flex flex-col items-start gap-3 border-t px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {data.pagination.showing} of {data.pagination.total} users
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" type="button">
              Previous
            </Button>
            {Array.from({ length: data.pagination.totalPages }).map((_, index) => {
              const page = index + 1;
              const isActive = page === data.pagination.page;

              return (
                <Button
                  key={`page-${page}`}
                  type="button"
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                >
                  {page}
                </Button>
              );
            })}
            <Button variant="outline" size="sm" type="button">
              Next
            </Button>
          </div>
        </div>
      </Card>

      <FeedbackModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        submission={selectedSubmission}
      />
    </div>
  );
}

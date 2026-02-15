"use client";

import { Download, Search, SlidersHorizontal } from "lucide-react";

import type { GradebookFilters, GradebookPagination, GradebookStudent } from "@/types/gradebook";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface GradebookTableProps {
  students: GradebookStudent[];
  filters: GradebookFilters;
  pagination: GradebookPagination;
}

function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function scoreClass(score: number) {
  if (score >= 90) {
    return "text-emerald-600";
  }
  if (score >= 80) {
    return "text-orange-500";
  }
  return "text-muted-foreground";
}

export default function GradebookTable({ students, filters, pagination }: GradebookTableProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xl">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students..." className="pl-9" aria-label="Search students" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select>
              <SelectTrigger className="w-fit gap-2">
                <span className="inline-flex items-center justify-center rounded-md border border-muted px-2 py-1 text-xs text-muted-foreground">
                  <SlidersHorizontal className="h-3 w-3" />
                </span>
                <SelectValue placeholder={filters.courses[0]} />
              </SelectTrigger>
              <SelectContent>
                {filters.courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="default" className="gap-2">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Card className="border shadow-none">
          <CardHeader className="px-4 py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Quiz 1</TableHead>
                  <TableHead>Quiz 2</TableHead>
                  <TableHead>Quiz 3</TableHead>
                  <TableHead>Overall</TableHead>
                  <TableHead>Completion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-muted" size="sm">
                          <AvatarImage
                            src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${student.name.split(" ")[0]}`}
                            alt={student.name}
                          />
                          <AvatarFallback className="text-xs font-semibold">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.course}
                    </TableCell>
                    <TableCell className={`text-sm font-medium ${scoreClass(student.quiz1)}`}>
                      {student.quiz1}%
                    </TableCell>
                    <TableCell className={`text-sm font-medium ${scoreClass(student.quiz2)}`}>
                      {student.quiz2}%
                    </TableCell>
                    <TableCell className={`text-sm font-medium ${scoreClass(student.quiz3)}`}>
                      {student.quiz3}%
                    </TableCell>
                    <TableCell className={`text-sm font-semibold ${scoreClass(student.overall)}`}>
                      {student.overall}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <progress
                          value={student.completion}
                          max={100}
                          className="h-2 w-28 accent-[#576045]"
                        />
                        <span className="text-xs text-muted-foreground">{student.completion}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {pagination.showing} of {pagination.total} users
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Previous
                </Button>
                {Array.from({ length: pagination.totalPages }).map((_, index) => {
                  const page = index + 1;
                  const isActive = page === pagination.page;
                  return (
                    <Button
                      key={`page-${page}`}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={isActive ? "bg-primary text-primary-foreground" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}

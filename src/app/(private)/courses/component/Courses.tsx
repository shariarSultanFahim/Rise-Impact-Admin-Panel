"use client";

import Link from "next/link";

import { Filter, Plus, Search } from "lucide-react";

import type { CoursesData } from "@/types/courses";

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

import CourseCard from "./CourseCard";

interface CoursesProps {
  data: CoursesData;
}

export default function Courses({ data }: CoursesProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground">{data.heading.title}</h1>
          <p className="text-sm text-muted-foreground">{data.heading.subtitle}</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/courses/create">
            <Plus className="h-4 w-4" />
            Create New Course
          </Link>
        </Button>
      </header>

      <Card className="shadow-sm">
        <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-9" aria-label="Search courses" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select defaultValue={data.filters.status[0]}>
              <SelectTrigger className="w-fit gap-2">
                <span className="inline-flex items-center justify-center rounded-md border border-muted px-2 py-1 text-xs text-muted-foreground">
                  <Filter className="h-3 w-3" />
                </span>
                <SelectValue placeholder={data.filters.status[0]} />
              </SelectTrigger>
              <SelectContent>
                {data.filters.status.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {data.pagination.showing} of {data.pagination.total} courses
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          {Array.from({ length: data.pagination.totalPages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === data.pagination.page;
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
    </div>
  );
}

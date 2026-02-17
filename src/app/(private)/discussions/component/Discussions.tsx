"use client";

import { Search } from "lucide-react";

import type { DiscussionsData } from "@/types/discussions";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import DiscussionThread from "./DiscussionThread";

interface DiscussionsProps {
  data: DiscussionsData;
}

export default function Discussions({ data }: DiscussionsProps) {
  return (
    <div className="flex flex-col gap-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{data.heading.title}</h1>
        <p className="text-sm text-muted-foreground">{data.heading.subtitle}</p>
      </header>

      <Card className="shadow-sm">
        <CardContent>
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="bg-white pl-9"
              aria-label="Search discussions"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">
            Discussion Threads ({data.threads.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.threads.map((thread) => (
            <DiscussionThread key={thread.id} thread={thread} />
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {data.pagination.showing} of {data.pagination.total} threads
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

"use client";

import { Loader2, Pencil, Search, Trash2 } from "lucide-react";

import type { QuizDetail, QuizListItem, QuizPagination } from "@/types/quiz-builder-manage";

import { formatDate } from "@/lib/date";

import Pagination from "@/components/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface QuizListPanelProps {
  quizzes: QuizListItem[];
  isListPending: boolean;
  selectedQuizId: string | null;
  selectedQuiz?: QuizDetail;
  searchTerm: string;
  pagination?: QuizPagination;
  totalPages: number;
  onSearchChange: (value: string) => void;
  onSelectQuiz: (quizId: string) => void;
  onRequestEdit: (quizId: string) => void;
  onRequestDelete: (quiz: { id: string; title: string }) => void;
  onPageChange: (page: number) => void;
}

export default function QuizListPanel({
  quizzes,
  isListPending,
  selectedQuizId,
  selectedQuiz,
  searchTerm,
  pagination,
  totalPages,
  onSearchChange,
  onSelectQuiz,
  onRequestEdit,
  onRequestDelete,
  onPageChange
}: QuizListPanelProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Quiz List</CardTitle>
          <Badge variant="secondary">{pagination?.total ?? quizzes.length} total</Badge>
        </div>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by quiz title"
            className="bg-white pl-9"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Total Marks</TableHead>
              <TableHead>Settings</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isListPending ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading quizzes...
                  </div>
                </TableCell>
              </TableRow>
            ) : quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No quiz found. Create your first quiz.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz) => (
                <TableRow
                  key={quiz._id}
                  className={selectedQuizId === quiz._id ? "bg-muted/50" : ""}
                  onClick={() => onSelectQuiz(quiz._id)}
                >
                  <TableCell className="max-w-[240px] truncate font-medium">{quiz.title}</TableCell>
                  <TableCell>{quiz.course?.title ?? "-"}</TableCell>
                  <TableCell>{quiz.totalMarks}</TableCell>
                  <TableCell>
                    {quiz.settings.timeLimit === 0 ? "No limit" : `${quiz.settings.timeLimit} min`}{" "}
                    / {quiz.settings.passingScore}%
                  </TableCell>
                  <TableCell>{formatDate(quiz.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelectQuiz(quiz._id);
                        }}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();

                          if (selectedQuiz?._id === quiz._id) {
                            onRequestEdit(quiz._id);
                            return;
                          }

                          onSelectQuiz(quiz._id);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={(event) => {
                          event.stopPropagation();
                          onRequestDelete({ id: quiz._id, title: quiz.title });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {quizzes.length} of {pagination?.total ?? 0}
          </p>
          <Pagination
            currentPage={pagination?.page ?? 1}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

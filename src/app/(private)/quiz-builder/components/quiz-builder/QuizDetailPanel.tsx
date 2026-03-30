"use client";

import { Loader2, Pencil, Trash2 } from "lucide-react";

import type { QuizDetail } from "@/types/quiz-builder-manage";

import { formatDate } from "@/lib/date";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizDetailPanelProps {
  selectedQuizId: string | null;
  selectedQuiz?: QuizDetail;
  isDetailsPending: boolean;
  onEdit: (quiz: QuizDetail) => void;
  onDelete: (quiz: { id: string; title: string }) => void;
}

export default function QuizDetailPanel({
  selectedQuizId,
  selectedQuiz,
  isDetailsPending,
  onEdit,
  onDelete
}: QuizDetailPanelProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Quiz Detail</CardTitle>
        <CardDescription>
          {selectedQuizId
            ? "Inspect quiz settings and question order."
            : "Select a quiz from the table to view details."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedQuizId && isDetailsPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading quiz details...
          </div>
        ) : selectedQuiz ? (
          <>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">{selectedQuiz.title}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedQuiz.description || "No description"}
              </p>
            </div>

            <div className="grid gap-2 rounded-lg border border-border p-3 text-sm">
              {/* <p>
                <span className="font-medium">Course:</span> {selectedQuiz.course}
              </p> */}
              <p>
                <span className="font-medium">Time Limit:</span>{" "}
                {selectedQuiz.settings.timeLimit === 0
                  ? "No time limit"
                  : `${selectedQuiz.settings.timeLimit} minutes`}
              </p>
              <p>
                <span className="font-medium">Passing Score:</span>{" "}
                {selectedQuiz.settings.passingScore}%
              </p>
              <p>
                <span className="font-medium">Total Marks:</span> {selectedQuiz.totalMarks}
              </p>
              <p>
                <span className="font-medium">Created:</span> {formatDate(selectedQuiz.createdAt)}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Questions ({selectedQuiz.questions.length})</h4>
              {selectedQuiz.questions
                .slice()
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((question) => (
                  <article
                    key={question.questionId}
                    className="rounded-lg border border-border p-3"
                  >
                    <p className="text-sm font-medium text-foreground">{question.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {question.type} • {question.marks} marks
                    </p>
                  </article>
                ))}
            </div>

            <div className="flex gap-2">
              <Button type="button" className="flex-1" onClick={() => onEdit(selectedQuiz)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={() => onDelete({ id: selectedQuiz._id, title: selectedQuiz.title })}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No quiz selected.</p>
        )}
      </CardContent>
    </Card>
  );
}

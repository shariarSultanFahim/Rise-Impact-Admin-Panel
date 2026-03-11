"use client";

import { Plus } from "lucide-react";
import type { FieldArrayWithId, UseFormReturn } from "react-hook-form";

import type { CourseForm } from "@/types/course-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ModuleCard from "./ModuleCard";

interface CurriculumBuilderProps {
  form: UseFormReturn<CourseForm>;
  modules: FieldArrayWithId<CourseForm, "modules", "id">[];
  activeModuleIndex: number;
  activeLessonIndex: number;
  pendingModuleId: string | null;
  onAddModule: () => void;
  onModuleTitleChange: (moduleIndex: number, nextTitle: string) => void;
  onRemoveModule: (moduleIndex: number) => void;
  onAddLesson: (moduleIndex: number) => void;
  onRemoveLesson: (moduleIndex: number, lessonIndex: number) => void;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
  onEditLesson: (moduleIndex: number, lessonIndex: number) => void;
}

export default function CurriculumBuilder({
  form,
  modules,
  activeModuleIndex,
  activeLessonIndex,
  pendingModuleId,
  onAddModule,
  onModuleTitleChange,
  onRemoveModule,
  onAddLesson,
  onRemoveLesson,
  onSelectLesson,
  onEditLesson
}: CurriculumBuilderProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Curriculum</CardTitle>
        <Button type="button" variant="outline" size="sm" className="gap-2" onClick={onAddModule}>
          <Plus className="h-4 w-4" />
          Add Module
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted px-4 py-6 text-sm text-muted-foreground">
            No module created yet
          </div>
        ) : (
          modules.map((module, moduleIndex) => (
            <ModuleCard
              key={module.id}
              form={form}
              moduleIndex={moduleIndex}
              isActive={moduleIndex === activeModuleIndex}
              activeLessonIndex={activeLessonIndex}
              pendingModuleId={pendingModuleId}
              onSelectLesson={onSelectLesson}
              onModuleTitleChange={onModuleTitleChange}
              onRemoveModule={onRemoveModule}
              onAddLesson={onAddLesson}
              onRemoveLesson={onRemoveLesson}
              onEditLesson={onEditLesson}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

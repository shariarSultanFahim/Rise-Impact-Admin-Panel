"use client";

import { PencilLineIcon } from "lucide-react";

import type { GamificationCertificateTemplate } from "@/types/gamification";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type CertificateTemplatesProps = {
  templates: GamificationCertificateTemplate[];
};

export default function CertificateTemplates({ templates }: CertificateTemplatesProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Certificate Templates</CardTitle>
        <CardDescription className="text-xs">Configure badge-linked certificates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map((template) => (
          <Card key={template.id} className="border-muted/60">
            <CardContent className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{template.title}</p>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                </div>
                <Switch defaultChecked={template.enabled} aria-label={template.title} />
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <PencilLineIcon className="size-4" />
                Edit Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

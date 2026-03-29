"use client";

import { useMutation } from "@tanstack/react-query";
import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

import type {
  AnalyticsExportFormat,
  AnalyticsExportType,
  AnalyticsPeriod,
  ExportAnalyticsResult
} from "@/types/analytics";

import { api as instance } from "@/lib/api";

interface ExportAnalyticsPayload {
  type: AnalyticsExportType;
  format?: AnalyticsExportFormat;
  period?: AnalyticsPeriod;
  course?: string;
}

const getFileNameFromHeaders = (
  headers: AxiosResponseHeaders | Partial<RawAxiosResponseHeaders>
): string => {
  const contentDisposition = headers["content-disposition"];

  if (!contentDisposition) {
    return "analytics-export.csv";
  }

  const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|\")?([^;\"\n]+)/i);

  if (!fileNameMatch?.[1]) {
    return "analytics-export.csv";
  }

  return decodeURIComponent(fileNameMatch[1].replace(/\"/g, "").trim());
};

export const useExportAnalytics = () => {
  return useMutation({
    mutationFn: async ({
      type,
      format = "csv",
      period,
      course
    }: ExportAnalyticsPayload): Promise<ExportAnalyticsResult> => {
      const response = await instance.get<Blob>("/analytics/export", {
        params: {
          type,
          format,
          ...(period ? { period } : {}),
          ...(course ? { course } : {})
        },
        responseType: "blob"
      });

      return {
        fileName: getFileNameFromHeaders(response.headers),
        blob: response.data
      };
    }
  });
};

"use client";

import { useMutation } from "@tanstack/react-query";
import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from "axios";

import type { ExportUsersResult } from "@/types/users-export";

import { api as instance } from "@/lib/api";

const getFileNameFromHeaders = (
  headers: AxiosResponseHeaders | Partial<RawAxiosResponseHeaders>
): string => {
  const contentDisposition = headers["content-disposition"];

  if (!contentDisposition) {
    return "users.csv";
  }

  const fileNameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|\")?([^;\"\n]+)/i);

  if (!fileNameMatch?.[1]) {
    return "users.csv";
  }

  return decodeURIComponent(fileNameMatch[1].replace(/"/g, "").trim());
};

export const useExportUsers = () => {
  return useMutation({
    mutationFn: async (): Promise<ExportUsersResult> => {
      const response = await instance.get<Blob>("/users/export", {
        params: {
          format: "csv"
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

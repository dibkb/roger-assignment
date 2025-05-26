import { mockData } from "./mock.data";
import { z } from "zod";

export const uploadResponseSchema = z.object({
  id: z.string(),
  status: z.literal("success"),
  message: z.string(),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  status: z.literal("error"),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const mockServer = {
  enrich: async (id: string) => {
    const idx = mockData.findIndex((_, idx) => idx === parseInt(id));
    if (idx === -1) {
      return null;
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData[idx]);
      }, 1000);
    });
  },

  upload: async (file: File): Promise<UploadResponse | ErrorResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (file.type !== "text/csv") {
          resolve({
            error: "Invalid file format. Please upload a CSV file.",
            status: "error",
          });
          return;
        }

        resolve({
          id: Math.random().toString(36).substring(7),
          status: "success",
          message: "File uploaded successfully",
        });
      }, 1000);
    });
  },
};

import { z } from "zod";

const csvDataSchema = z.record(z.string());

export const uploadResponseSchema = z.object({
  id: z.string(),
  data: z.array(csvDataSchema),
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

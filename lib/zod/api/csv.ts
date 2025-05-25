import { z } from "zod";

const contactSchema = z.record(z.string().nullable());

export const uploadResponseSchema = z.object({
  id: z.string(),
  data: z.array(contactSchema),
});

export const enrichmentUploadSchema = z.object({
  id: z.string(),
  data: z.array(contactSchema),
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

export type UploadResponse = z.infer<typeof uploadResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

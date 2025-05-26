import { z } from "zod";

export const PersonSchema = z.object({
  full_name: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().email().optional(),
  linkedin_url: z.string().url().optional(),
  company_name: z.string().optional(),
  company_domain: z.string().optional(),
  company_description: z.string().optional(),
});

export type Person = z.infer<typeof PersonSchema>;

export const CostBreakdownSchema = z.object({
  promptTokens: z.number(),
  completionTokens: z.number(),
  promptCost: z.number(),
  completionCost: z.number(),
  totalCost: z.number(),
});

export type CostBreakdown = z.infer<typeof CostBreakdownSchema>;

export const EnrichmentResponseSchema = z.object({
  success: z.boolean(),
  data: PersonSchema.optional(),
  error: z.string().optional(),
  cost: CostBreakdownSchema,
});

export type EnrichmentResponse = z.infer<typeof EnrichmentResponseSchema>;

import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";

export const columnMappingSchema = z.object({
  full_name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  title: z.string(),
  email: z.string(),
  linkedin_url: z.string(),
  company_name: z.string(),
  company_domain: z.string(),
  company_description: z.string(),
});

export type ColumnMapping = z.infer<typeof columnMappingSchema>;

export const columnName = new Agent({
  name: "Column Name Agent",
  instructions: `
You are a Column Name Agent that maps input column names to a standardized format.
Given a list of column names, you should map them to the following structure:

{
  "full_name": "mapped column name or empty string",
  "first_name": "mapped column name or empty string",
  "last_name": "mapped column name or empty string",
  "title": "mapped column name or empty string",
  "email": "mapped column name or empty string",
  "linkedin_url": "mapped column name or empty string",
  "company_name": "mapped column name or empty string",
  "company_domain": "mapped column name or empty string",
  "company_description": "mapped column name or empty string"
}

Rules:
1. Only populate the right-hand side values
2. If no matching column is found, use an empty string
3. Return the response as a JSON object
4. Map columns based on semantic similarity and common naming patterns
5. Consider variations in naming (e.g., "Full Name", "fullname", "name" could all map to "full_name")
`,
  model: openai("gpt-4o-mini"),
});

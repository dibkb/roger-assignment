import { cleanAndParseJson } from "@/lib/clean-json";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { errorResponseSchema } from "@/lib/zod/api/csv";
import { columnName } from "@/src/mastra/agents/columnName";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json(
      errorResponseSchema.parse({ error: "No file uploaded" }),
      { status: 400 }
    );
  }

  const text = await file.text();
  const { data, errors, meta } = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length) {
    return NextResponse.json(
      errorResponseSchema.parse({ error: "Invalid CSV format" }),
      { status: 422 }
    );
  }

  const res = await columnName.generate(JSON.stringify(meta.fields));
  const json = cleanAndParseJson(res.text);

  // Transform the data with new column names
  const transformedData = data.map((row) => {
    const newRow: Record<string, string> = {};

    const reverseMapping: Record<string, string> = {};
    Object.entries(json).forEach(([standardName, originalName]) => {
      if (typeof originalName === "string") {
        reverseMapping[originalName] = standardName;
      }
    });

    Object.entries(row).forEach(([key, value]: [string, string]) => {
      const newKey = reverseMapping[key] || key;

      newRow[newKey] = value;
    });
    return newRow;
  });

  const response = uploadResponseSchema.parse({
    id: uuidv4(),
    data: transformedData,
  });

  return NextResponse.json(response);
}

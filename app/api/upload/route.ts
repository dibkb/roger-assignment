import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { errorResponseSchema } from "@/lib/zod/api/csv";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";

// Define the column mapping
const columnMapping: Record<string, string> = {
  // Add your column mappings here, for example:
  // "Original Column": "New Column",
  // "First Name": "firstName",
  // "Last Name": "lastName",
};

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
  const { data, errors, meta } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length) {
    return NextResponse.json(
      errorResponseSchema.parse({ error: "Invalid CSV format" }),
      { status: 422 }
    );
  }
  console.log(meta.fields);

  // Transform the data with new column names
  const transformedData = data.map((row: any) => {
    const newRow: Record<string, any> = {};
    Object.entries(row).forEach(([key, value]) => {
      const newKey = columnMapping[key] || key; // Use mapped name if exists, otherwise keep original
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

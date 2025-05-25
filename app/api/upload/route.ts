import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { errorResponseSchema } from "@/lib/zod/api/csv";
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
  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  if (errors.length) {
    return NextResponse.json(
      errorResponseSchema.parse({ error: "Invalid CSV format" }),
      { status: 422 }
    );
  }

  const response = uploadResponseSchema.parse({
    id: uuidv4(),
    data: data,
  });

  return NextResponse.json(response);
}

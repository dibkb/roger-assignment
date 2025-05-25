import { enrichmentUploadSchema } from "@/lib/zod/api/csv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log("Received data:", data);
  const parsed = enrichmentUploadSchema.parse(data);
  console.log("Parsed data:", parsed);
  return NextResponse.json({ started: true });
}

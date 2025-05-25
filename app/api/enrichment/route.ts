import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { enrichmentAgent } from "@/src/mastra/agents/enrichment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = uploadResponseSchema.parse(data);
    const row = parsed.data[0];
    const result = await enrichmentAgent.generate(JSON.stringify(row));
    console.log(result.text);
    return NextResponse.json({
      id: parsed.id,
      data: parsed,
    });
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { error: "Failed to enrich contacts" },
      { status: 500 }
    );
  }
}

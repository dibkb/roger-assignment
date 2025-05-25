import { tableUpdates } from "@/lib/tableUpdates";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { enrichmentAgent } from "@/src/mastra/agents/enrichment";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = uploadResponseSchema.parse(data);
    const idx = 4;
    const row = parsed.data[idx];
    const result = await enrichmentAgent.generate(JSON.stringify(row));
    console.log("Index", idx);
    console.log("Result", result.text);
    // parsed.data.forEach(async (row, idx) => {
    //   // console.log("--------------------------------");
    //   // tableUpdates.pushUpdate(parsed.id, idx.toString(), result.text);
    // });
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

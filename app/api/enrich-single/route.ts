import { calculateApiCallCost } from "@/lib/calculate-cost";
import { cleanAndParseJson } from "@/lib/clean-json";
import { mockServer } from "@/mock.server";
import { enrichmentAgent } from "@/src/mastra/agents/enrichment";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for the request body
const enrichSingleSchema = z.object({
  rowIndex: z.string(),
  data: z.record(z.unknown()),
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = enrichSingleSchema.parse(data);

    try {
      // const result = await enrichmentAgent.generate(
      //   JSON.stringify(parsed.data)
      // );
      // const cost = calculateApiCallCost(result.usage);
      // const json = cleanAndParseJson(result.text);
      const json = await mockServer.enrich(parsed.rowIndex);
      return NextResponse.json({
        success: true,
        data: json,
        // cost: cost,
      });
    } catch (error) {
      console.error("Error processing row:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          data: parsed.data,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Validation error:", error);
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

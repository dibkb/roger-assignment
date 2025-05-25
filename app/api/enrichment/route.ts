import { cleanAndParseJson } from "@/lib/clean-json";
import { tableUpdates } from "@/lib/tableUpdates";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { mockServer } from "@/mock.server";
// import { mockServer } from "@/mock.server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = uploadResponseSchema.parse(data);
    const rows = parsed.data;

    // Process all rows concurrently
    const promises = rows.map(async (row, idx) => {
      const result = await mockServer.enrich(idx.toString());
      // const result = await enrichmentAgent.generate(JSON.stringify(row));
      try {
        // const json = cleanAndParseJson(result as string);
        const json = cleanAndParseJson(JSON.stringify(result));

        tableUpdates.pushUpdate(
          parsed.id,
          idx.toString(),
          JSON.stringify(json)
        );
      } catch (error) {
        console.log("Error parsing JSON:", error);
      }
    });

    // Wait for all processing to complete
    await Promise.all(promises);

    // Only mark as completed after all updates are processed
    console.log("All rows processed, marking table as completed");
    tableUpdates.markTableAsCompleted(parsed.id);

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

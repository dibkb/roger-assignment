import { cleanAndParseJson } from "@/lib/clean-json";
import { tableUpdates } from "@/lib/tableUpdates";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { enrichmentAgent } from "@/src/mastra/agents/enrichment";
import { NextRequest, NextResponse } from "next/server";

interface RowData {
  [key: string]: unknown;
}

async function processBatch(
  rows: RowData[],
  startIdx: number,
  batchSize: number,
  tableId: string
) {
  const batch = rows.slice(startIdx, startIdx + batchSize);
  const promises = batch.map(async (row, batchIdx) => {
    const idx = startIdx + batchIdx;
    try {
      const result = await enrichmentAgent.generate(JSON.stringify(row));
      const json = cleanAndParseJson(result.text);
      tableUpdates.pushUpdate(tableId, idx.toString(), JSON.stringify(json));
    } catch (error) {
      console.log("Error processing row:", error);
      tableUpdates.pushUpdate(
        tableId,
        idx.toString(),
        JSON.stringify({ error: "Failed to process row" }),
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  });
  await Promise.all(promises);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = uploadResponseSchema.parse(data);
    const rows = parsed.data;
    const BATCH_SIZE = 5;

    // Process rows in batches of 5
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      await processBatch(rows, i, BATCH_SIZE, parsed.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { error: "Failed to enrich contacts" },
      { status: 500 }
    );
  }
}

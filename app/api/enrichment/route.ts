import { tableUpdates } from "@/lib/tableUpdates";
import { uploadResponseSchema } from "@/lib/zod/api/csv";
import { enrichmentAgent } from "@/src/mastra/agents/enrichment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = uploadResponseSchema.parse(data);

    const idx = 4;
    const row = parsed.data[idx];
    // const result = await enrichmentAgent.generate(JSON.stringify(row));
    console.log("--------------------------------");
    console.log("Index", idx);
    // const json = JSON.parse(result.text);
    tableUpdates.pushUpdate(
      parsed.id,
      idx.toString(),
      JSON.stringify({
        full_name: "Siddharth Shankar Tripathi",
        first_name: "Siddharth",
        last_name: "Shankar Tripathi",
        title: "Founder at Ringg AI",
        email: "sidharth.t@srmap.edu.in",
        linkedin_url: "https://www.linkedin.com/in/sidsst",
        company_name: "Ringg AI",
        company_domain: "ringg.ai",
        company_description:
          "Hire AI voice callers for your business operations in an instant. Our AI callers are multilingual, international and 24x7 available.",
      })
    );
    // clear the table
    // tableUpdates.clearTable(parsed.id);
    console.log("--------------------------------");

    // parsed.data.forEach(async (row, idx) => {
    //   const result = await enrichmentAgent.generate(JSON.stringify(row));
    //   console.log("--------------------------------");
    //   console.log("Index", idx);
    //   tableUpdates.pushUpdate(
    //     parsed.id,
    //     idx.toString(),
    //     JSON.stringify(result.text)
    //   );
    //   console.log("--------------------------------");
    // });
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

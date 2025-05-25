import { tableUpdates } from "@/lib/tableUpdates";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const tableId = req.nextUrl.searchParams.get("tableId");

  if (!tableId) {
    return new NextResponse(null, { status: 404 });
  }

  const isCompleted = tableUpdates.isTableCompleted(tableId);
  return NextResponse.json({
    isCompleted,
    completedTables: tableUpdates.completedTables,
  });
}

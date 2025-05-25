import { NextRequest, NextResponse } from "next/server";
import { tableUpdates } from "@/lib/tableUpdates";

export async function GET(req: NextRequest) {
  const tableId = req.nextUrl.searchParams.get("tableId");

  if (!tableId) {
    return new NextResponse(null, { status: 404 });
  }

  const updates = tableUpdates.subscribe(tableId);
  return NextResponse.json(updates);
}

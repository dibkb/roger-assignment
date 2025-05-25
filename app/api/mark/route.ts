import { tableUpdates } from "@/lib/tableUpdates";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { tableId, rowIds } = data;
  if (!tableId || !rowIds) {
    return new NextResponse(null, { status: 404 });
  }

  tableUpdates.markRead(tableId, rowIds);
  return NextResponse.json({ message: "Marked as read" });
}

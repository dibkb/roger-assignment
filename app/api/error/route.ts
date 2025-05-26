import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Simulate an error by throwing a custom error
    throw new Error("This is a dummy error from the API");
  } catch (error) {
    // Return a 500 status code with the error message
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "NOT SET"
  });
}
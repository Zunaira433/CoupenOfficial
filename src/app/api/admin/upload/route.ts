import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported file type. Use PNG, JPEG, WEBP, GIF, or SVG." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Max 5MB." }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true
  });

  return NextResponse.json({ url: blob.url }, { status: 201 });
}
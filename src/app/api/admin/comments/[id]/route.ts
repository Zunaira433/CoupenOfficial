import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { commentReplySchema } from "@/lib/validation";

// Both protected by the edge middleware in src/middleware.ts (admin only)

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => null);
  const parsed = commentReplySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const comment = await prisma.comment.update({
    where: { id: params.id },
    data: { adminReply: parsed.data.adminReply, adminReplyAt: new Date() }
  });
  return NextResponse.json(comment);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.comment.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
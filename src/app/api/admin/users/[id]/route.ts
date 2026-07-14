import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const roleSchema = z.object({
  role: z.enum(["USER", "ADMIN"])
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => null);
  const parsed = roleSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role: parsed.data.role }
  });

  return NextResponse.json({ id: user.id, role: user.role });
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { affiliate: string } }) {
  const brand = await prisma.brand.findUnique({ where: { slug: params.affiliate } });
  if (!brand) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const type = req.nextUrl.searchParams.get("type") || "affiliate";
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  await prisma.click.create({
    data: { brandId: brand.id, type, ip, userAgent }
  });

  if (type === "coupon") {
    const couponId = req.nextUrl.searchParams.get("couponId");
    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { clicks: { increment: 1 } }
      }).catch(() => {});
    }
  }

  return NextResponse.redirect(brand.affiliateLink, { status: 302 });
}

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const hosting = await prisma.category.upsert({
    where: { slug: "hosting" },
    update: {},
    create: { name: "Hosting", slug: "hosting", description: "Web hosting providers" }
  });

  const ai = await prisma.category.upsert({
    where: { slug: "ai-tools" },
    update: {},
    create: { name: "AI Tools", slug: "ai-tools", description: "AI software tools" }
  });

  const brandA = await prisma.brand.upsert({
    where: { slug: "hostinger" },
    update: {},
    create: {
      name: "Hostinger",
      slug: "hostinger",
      websiteUrl: "https://hostinger.com",
      affiliateLink: "https://hostinger.com/?ref=AFF123",
      description: "Affordable, fast web hosting.",
      categoryId: hosting.id,
      metaTitle: "Hostinger Review, Coupons & Deals 2026",
      metaDesc: "Verified Hostinger coupons, full review, pricing and alternatives.",
      rating: 4.6
    }
  });

  const brandB = await prisma.brand.upsert({
    where: { slug: "bluehost" },
    update: {},
    create: {
      name: "Bluehost",
      slug: "bluehost",
      websiteUrl: "https://bluehost.com",
      affiliateLink: "https://bluehost.com/?ref=AFF456",
      description: "WordPress recommended hosting.",
      categoryId: hosting.id,
      metaTitle: "Bluehost Review, Coupons & Deals 2026",
      metaDesc: "Verified Bluehost coupons, full review, pricing and alternatives.",
      rating: 4.3
    }
  });

  await prisma.coupon.create({
    data: {
      title: "75% OFF Hosting Plans",
      code: "SAVE75",
      discount: "75% OFF",
      description: "Apply at checkout for new accounts.",
      verified: true,
      brandId: brandA.id,
      expiresAt: new Date("2026-12-31")
    }
  });

  await prisma.review.create({
    data: {
      brandId: brandA.id,
      rating: 5,
      title: "Best budget hosting in 2026",
      pros: ["Fast NVMe SSD", "24/7 chat support", "Free domain"],
      cons: ["Renewal price increase"],
      body: "Hostinger delivers excellent performance for the price, with consistent uptime and fast load times."
    }
  });



  console.log("Seed complete:", { hosting, ai, brandA, brandB });
}

main().finally(async () => prisma.$disconnect());

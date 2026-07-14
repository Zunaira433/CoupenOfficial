import { requireUser } from "@/lib/auth";
import * as prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/FavoriteButton";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Heart, Store, LayoutDashboard } from "lucide-react";
import AvatarUpload from "@/components/AvatarUpload";

export const metadata = { title: "Dashboard" };
export const revalidate = 0;

export default async function DashboardPage() {
  let user;
  try {
  user = requireUser();
} catch (err) {
  console.error("Dashboard auth failed:", err);
  redirect("/login?next=/dashboard");
}

 const [favorites, dbUser] = await Promise.all([
    prisma.prisma.favorite.findMany({
      where: { userId: user.userId },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            description: true,
            _count: { select: { coupons: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.prisma.user.findUnique({
      where: { id: user.userId },
      select: { avatarUrl: true }
    })
  ]);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Dashboard" }]} />

     <div className="mb-6">
       <AvatarUpload currentAvatarUrl={dbUser?.avatarUrl || null} displayName={user.email} />
      </div>

      <div className="flex items-center gap-3 mb-10">
        <LayoutDashboard className="w-8 h-8 text-primary" aria-hidden="true" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{user.email}</p>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-red-500" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Saved Brands
          </h2>
          <span className="ml-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            {favorites.length}
          </span>
        </div>

        {favorites.length === 0 ? (
          <div className="card p-10 text-center">
            <Heart className="w-12 h-12 mx-auto text-gray-200 dark:text-gray-700 mb-4" aria-hidden="true" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No saved brands yet. Browse brands and click the{" "}
              <strong className="text-gray-700 dark:text-gray-300">Save</strong> button to bookmark your favourites.
            </p>
            <Link
              href="/brand"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Store className="w-4 h-4" aria-hidden="true" />
              Browse Brands
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {favorites.map(({ brand }) => (
              <div
                key={brand.id}
                className="card p-5 flex items-start gap-4"
              >
                <Link href={`/brand/${brand.slug}`} className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                  {brand.logoUrl ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                      <Image src={brand.logoUrl} alt={`${brand.name} logo`} fill className="object-contain p-1" sizes="56px" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Store className="w-7 h-7 text-primary" aria-hidden="true" />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/brand/${brand.slug}`}
                    className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors focus:outline-none focus-visible:underline truncate block"
                  >
                    {brand.name}
                  </Link>
                  {brand.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{brand.description}</p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {brand._count.coupons} coupon{brand._count.coupons !== 1 ? "s" : ""}
                  </p>
                </div>
                <FavoriteButton brandId={brand.id} initialFavorited={true} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

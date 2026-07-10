import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ReactionButtons from "@/components/ReactionButtons";
import CommentsSection from "@/components/CommentsSection";
import { Store, Star, ExternalLink, Check, X, Award } from "lucide-react";

export const revalidate = 3600;
type Props = { params: { slug: string } };

async function getComparison(slug: string) {
  return prisma.comparison.findUnique({
    where: { slug },
    include: { brandA: true, brandB: true }
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getComparison(params.slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.summary?.slice(0, 160) || c.title,
    alternates: { canonical: `/compare/${c.slug}` },
    openGraph: c.coverUrl ? { images: [{ url: c.coverUrl }] } : undefined
  };
}

function Logo({ url, name }: { url?: string | null; name: string }) {
  return (
    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-white shrink-0">
      {url ? (
        <Image src={url} alt={`${name} logo`} fill className="object-contain p-1.5" sizes="56px" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10">
          <Store className="w-6 h-6 text-primary" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function SideColumn({
  name,
  logoUrl,
  rating,
  pros,
  cons,
  bestFor,
  brandSlug,
  ctaLink,
  ctaLabel
}: {
  name: string;
  logoUrl?: string | null;
  rating?: number | null;
  pros: string[];
  cons: string[];
  bestFor?: string | null;
  brandSlug?: string;
  ctaLink?: string | null;
  ctaLabel?: string | null;
}) {
  return (
    <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Logo url={logoUrl} name={name} />
        <div>
          <h2 className="font-bold text-lg text-gray-900 dark:text-white">{name}</h2>
          {rating != null && rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" aria-hidden="true" />
              <span className="text-sm text-gray-500 dark:text-gray-400">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {pros.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400 mb-2">Pros</p>
          <ul className="space-y-1.5">
            {pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {cons.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-500 dark:text-red-400 mb-2">Cons</p>
          <ul className="space-y-1.5">
            {cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {bestFor && (
        <div className="flex items-start gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <Award className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-gray-600 dark:text-gray-300"><strong className="text-gray-900 dark:text-white">Best for:</strong> {bestFor}</p>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {ctaLink && (
          
          <a  href={ctaLink}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-sm bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            {ctaLabel || "Visit Site"}
          </a>
        )}
        {brandSlug && (
          <Link
            href={`/brand/${brandSlug}`}
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2 text-sm bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            View Deals
          </Link>
        )}
      </div>
    </div>
  );
}

export default async function ComparePage({ params }: Props) {
  const c = await getComparison(params.slug);
  if (!c) notFound();

  const nameA = c.itemAName || c.brandA?.name || "Option A";
  const nameB = c.itemBName || c.brandB?.name || "Option B";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs crumbs={[{ label: "Compare", href: "/compare" }, { label: c.title }]} />

      {c.coverUrl && (
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-8">
          <Image src={c.coverUrl} alt={c.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 896px" />
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">{c.title}</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">{nameA} vs {nameB} — side by side</p>

      <div className="grid sm:grid-cols-2 gap-5 mb-10">
        <SideColumn
  name={nameA}
  logoUrl={c.brandA?.logoUrl}
  rating={c.brandA?.rating}
  pros={c.prosA}
  cons={c.consA}
  bestFor={c.bestForA}
  brandSlug={c.brandA?.slug}
  ctaLink={c.ctaLinkA}
  ctaLabel={c.ctaLabelA}
/>
<SideColumn
  name={nameB}
  logoUrl={c.brandB?.logoUrl}
  rating={c.brandB?.rating}
  pros={c.prosB}
  cons={c.consB}
  bestFor={c.bestForB}
  brandSlug={c.brandB?.slug}
  ctaLink={c.ctaLinkB}
  ctaLabel={c.ctaLabelB}
/>
      </div>

      {c.summary && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Verdict</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{c.summary}</p>
        </div>
      )}

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <ReactionButtons apiBase={`/api/compare/${c.slug}`} loginRedirect={`/compare/${c.slug}`} />
      </div>

      <CommentsSection apiBase={`/api/compare/${c.slug}`} loginRedirect={`/compare/${c.slug}`} />
    </div>
  );
}
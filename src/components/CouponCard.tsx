"use client";
import { useState } from "react";
import Image from "next/image";
import { Shield, Copy, Check, Clock, ExternalLink, Store } from "lucide-react";

type Coupon = {
  id: string;
  title: string;
  code?: string | null;
  discount?: string | null;
  description?: string | null;
  verified: boolean;
  expiresAt?: Date | string | null;
};

type CouponCardProps = {
  coupon: Coupon;
  brandSlug: string;
  brandName?: string;
  brandLogoUrl?: string | null;
};

export default function CouponCard({ coupon, brandSlug, brandName, brandLogoUrl }: CouponCardProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

  async function reveal() {
    setRevealed(true);
    // fire-and-forget click tracking
    fetch(`/go/${brandSlug}?type=coupon&code=${encodeURIComponent(coupon.code || "")}`, { method: "HEAD" }).catch(() => {});
  }

  async function copy() {
    if (!coupon.code) return;
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — do nothing silently
    }
  }

  return (
    <article
      aria-label={coupon.title}
      className={`flex flex-col p-5 bg-white dark:bg-gray-900 border rounded-2xl transition-shadow hover:shadow-md ${
        isExpired
          ? "border-gray-100 dark:border-gray-800 opacity-60"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      {/* Brand header */}
      {(brandName || brandLogoUrl) && (
        <div className="flex items-center gap-2 mb-3">
          {brandLogoUrl ? (
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 shrink-0">
              <Image src={brandLogoUrl} alt={`${brandName} logo`} fill className="object-contain p-0.5" sizes="32px" />
            </div>
          ) : (
            <Store className="w-5 h-5 text-gray-400 shrink-0" aria-hidden="true" />
          )}
          {brandName && <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{brandName}</span>}
        </div>
      )}

      {/* Title & badges */}
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug mb-1">{coupon.title}</h3>
        <div className="flex flex-wrap items-center gap-1.5">
          {coupon.discount && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
              {coupon.discount}
            </span>
          )}
          {coupon.verified && !isExpired && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
              <Shield className="w-3 h-3" aria-hidden="true" />
              Verified
            </span>
          )}
          {isExpired && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              <Clock className="w-3 h-3" aria-hidden="true" />
              Expired
            </span>
          )}
        </div>
      </div>

      {coupon.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 flex-1">{coupon.description}</p>
      )}

     {/* Action */}
      <div className="mt-auto space-y-2">
        {coupon.code ? (
          <>
            {revealed ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
                  <code className="text-sm font-mono font-bold text-primary tracking-wider">{coupon.code}</code>
                </div>
                <button
                  onClick={copy}
                  aria-label={copied ? "Copied!" : "Copy coupon code"}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                </button>
              </div>
            ) : (
              <button
                onClick={reveal}
                disabled={!!isExpired}
                className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reveal Code
              </button>
            )}
            
            <a  href={`/go/${brandSlug}?type=coupon&code=${encodeURIComponent(coupon.code || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Buy Now
            </a>
          </>
        ) : (
          <a
            href={`/go/${brandSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            Get Deal
          </a>
        )}
      </div>

      {coupon.expiresAt && !isExpired && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" aria-hidden="true" />
          Expires {new Date(coupon.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      )}
    </article>
  );
}

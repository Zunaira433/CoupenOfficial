"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Brand = { id: string; name: string };

type CouponData = {
  id: string;
  title: string;
  code: string | null;
  description: string | null;
  discount: string | null;
  brandId: string;
  verified: boolean;
  expiresAt: string | null;
};

export default function EditCouponForm({ coupon }: { coupon: CouponData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then(setBrands)
      .catch(() => {})
      .finally(() => setBrandsLoading(false));
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const payload = {
      ...data,
      verified: data.verified === "on"
    };

    const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/coupons");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Failed to update coupon");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/coupons" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to coupons
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Coupon</h1>

      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Title<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="title" name="title" type="text" required defaultValue={coupon.title}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Code</label>
          <input id="code" name="code" type="text" defaultValue={coupon.code || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Discount</label>
          <input id="discount" name="discount" type="text" defaultValue={coupon.discount || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Brand<span className="text-red-500 ml-0.5">*</span>
          </label>
          <select id="brandId" name="brandId" required disabled={brandsLoading} defaultValue={coupon.brandId}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60">
            {brandsLoading && <option value={coupon.brandId}>Loading…</option>}
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Expires At</label>
          <input id="expiresAt" name="expiresAt" type="date" defaultValue={coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div className="flex items-center gap-2">
          <input id="verified" name="verified" type="checkbox" defaultChecked={coupon.verified}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
          <label htmlFor="verified" className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified</label>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
          <textarea id="description" name="description" rows={3} defaultValue={coupon.description || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60">
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCouponPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      title: fd.get("title"),
      code: fd.get("code") || undefined,
      description: fd.get("description") || undefined,
      discount: fd.get("discount") || undefined,
      brandId: fd.get("brandId"),
      verified: fd.get("verified") === "on",
      expiresAt: fd.get("expiresAt") || undefined
    };
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setLoading(false);
    if (res.ok) { router.push("/admin/coupons"); router.refresh(); }
    else { const j = await res.json(); setError(j.error || "Failed"); }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/coupons" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to coupons
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Add Coupon</h1>

      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        {[
          { name: "title", label: "Title", required: true, placeholder: "20% off sitewide" },
          { name: "brandId", label: "Brand ID (cuid)", required: true, placeholder: "clxxxxxxx" },
          { name: "code", label: "Coupon Code", placeholder: "SAVE20" },
          { name: "discount", label: "Discount Label", placeholder: "20% OFF" },
          { name: "expiresAt", label: "Expires At", type: "date" }
        ].map(({ name, label, required, type = "text", placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
            </label>
            <input
              id={name} name={name} type={type} required={required} placeholder={placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        ))}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
          <textarea id="description" name="description" rows={3} placeholder="Short description of this coupon deal" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" />
        </div>
        <div className="flex items-center gap-3">
          <input id="verified" name="verified" type="checkbox" className="w-4 h-4 accent-primary" />
          <label htmlFor="verified" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Verified</label>
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60">
          {loading ? "Creating…" : "Create Coupon"}
        </button>
      </form>
    </div>
  );
}

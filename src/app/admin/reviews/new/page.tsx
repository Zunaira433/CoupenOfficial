"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Brand = { id: string; name: string };

export default function NewReviewPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch(() => setError("Failed to load brands"))
      .finally(() => setBrandsLoading(false));
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);

    // Convert comma-separated pros/cons text into arrays
    const pros = String(data.pros || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const cons = String(data.cons || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch("/api/admin/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, pros, cons, rating: Number(data.rating) })
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/reviews");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Failed to create review");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/reviews" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to reviews
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Add Review</h1>

      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Brand<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <select
            id="brandId"
            name="brandId"
            required
            disabled={brandsLoading}
            defaultValue=""
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
          >
            <option value="" disabled>
              {brandsLoading ? "Loading brands…" : "Select a brand"}
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Review Title<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Best budget hosting in 2026"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Rating (1–5)<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            required
            min={1}
            max={5}
            step={1}
            placeholder="5"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Review Body<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <textarea
            id="body"
            name="body"
            required
            rows={5}
            placeholder="Write the full review here..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
          />
        </div>

        <div>
          <label htmlFor="pros" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Pros <span className="text-gray-400 font-normal">(comma-separated)</span>
          </label>
          <input
            id="pros"
            name="pros"
            type="text"
            placeholder="Fast SSD, 24/7 support, Free domain"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="cons" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Cons <span className="text-gray-400 font-normal">(comma-separated)</span>
          </label>
          <input
            id="cons"
            name="cons"
            type="text"
            placeholder="Renewal price increase, Limited storage"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create Review"}
        </button>
      </form>
    </div>
  );
}
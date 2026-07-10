"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageUploadField from "@/components/ImageUploadField";

type Category = { id: string; name: string; slug: string };

type BrandData = {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  affiliateLink: string;
  logoUrl: string | null;
  description: string | null;
  categoryId: string;
  rating: number;
};

export default function EditBrandForm({ brand }: { brand: BrandData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError("Failed to load categories"))
      .finally(() => setCategoriesLoading(false));
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(`/api/admin/brands/${brand.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, rating: Number(data.rating) || 0 })
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/brands");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Failed to update brand");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/brands" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to brands
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Brand</h1>

      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Brand Name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="name" name="name" type="text" required defaultValue={brand.name}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Slug<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="slug" name="slug" type="text" required defaultValue={brand.slug}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Website URL<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="websiteUrl" name="websiteUrl" type="url" required defaultValue={brand.websiteUrl}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="affiliateLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Affiliate Link<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="affiliateLink" name="affiliateLink" type="url" required defaultValue={brand.affiliateLink}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <ImageUploadField name="logoUrl" label="Brand Logo" defaultValue={brand.logoUrl || ""} />

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Category<span className="text-red-500 ml-0.5">*</span>
          </label>
          <select id="categoryId" name="categoryId" required disabled={categoriesLoading} defaultValue={brand.categoryId}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60">
            {categoriesLoading && <option value={brand.categoryId}>Loading…</option>}
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rating (0–5)</label>
          <input id="rating" name="rating" type="number" min={0} max={5} step={0.1} defaultValue={brand.rating}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
          <textarea id="description" name="description" rows={4} defaultValue={brand.description || ""}
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
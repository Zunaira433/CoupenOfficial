"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

type Brand = { id: string; name: string };

type ReviewData = {
  id: string;
  brandId: string;
  rating: number;
  title: string;
  pros: string[];
  cons: string[];
  body: string;
};

function ListInput({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  function update(i: number, val: string) {
    const next = [...values];
    next[i] = val;
    onChange(next);
  }
  function add() {
    onChange([...values, ""]);
  }
  function remove(i: number) {
    onChange(values.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={v}
              onChange={(e) => update(i, e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button type="button" onClick={() => remove(i)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" aria-label={`Remove ${label} ${i + 1}`}>
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 flex items-center gap-1.5 text-sm text-primary hover:underline">
        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
        Add {label.replace(/s$/, "")}
      </button>
    </div>
  );
}

export default function EditReviewForm({ review }: { review: ReviewData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [pros, setPros] = useState<string[]>(review.pros.length ? review.pros : [""]);
  const [cons, setCons] = useState<string[]>(review.cons.length ? review.cons : [""]);

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
    const clean = (arr: string[]) => arr.map((s) => s.trim()).filter(Boolean);

    const payload = { ...data, rating: Number(data.rating), pros: clean(pros), cons: clean(cons) };

    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/reviews");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Failed to update review");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/reviews" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to reviews
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Review</h1>

      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        <div>
          <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Brand<span className="text-red-500 ml-0.5">*</span>
          </label>
          <select id="brandId" name="brandId" required disabled={brandsLoading} defaultValue={review.brandId}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60">
            {brandsLoading && <option value={review.brandId}>Loading…</option>}
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Review Title<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="title" name="title" type="text" required defaultValue={review.title}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Rating (1–5)<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="rating" name="rating" type="number" required min={1} max={5} step={1} defaultValue={review.rating}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Review Body<span className="text-red-500 ml-0.5">*</span>
          </label>
          <textarea id="body" name="body" required rows={5} defaultValue={review.body}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" />
        </div>

        <ListInput label="Pros" values={pros} onChange={setPros} />
        <ListInput label="Cons" values={cons} onChange={setCons} />

        {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60">
          {loading ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
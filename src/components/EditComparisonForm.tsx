"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import ImageUploadField from "@/components/ImageUploadField";
import CtaLinkField from "@/components/CtaLinkField";

type Brand = { id: string; name: string };

type ComparisonData = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  itemAName: string | null;
  itemBName: string | null;
  brandAId: string | null;
  brandBId: string | null;
  prosA: string[];
  consA: string[];
  prosB: string[];
  consB: string[];
  bestForA: string | null;
  bestForB: string | null;
  ctaLinkA: string | null;
  ctaLabelA: string | null;
  ctaLinkB: string | null;
  ctaLabelB: string | null;
  summary: string | null;
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
              placeholder={`${label.replace(/s$/, "")} ${i + 1}`}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

export default function EditComparisonForm({ comparison }: { comparison: ComparisonData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);

  const [prosA, setProsA] = useState<string[]>(comparison.prosA.length ? comparison.prosA : [""]);
  const [consA, setConsA] = useState<string[]>(comparison.consA.length ? comparison.consA : [""]);
  const [prosB, setProsB] = useState<string[]>(comparison.prosB.length ? comparison.prosB : [""]);
  const [consB, setConsB] = useState<string[]>(comparison.consB.length ? comparison.consB : [""]);

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

    const payload = {
      ...data,
      brandAId: data.brandAId || null,
      brandBId: data.brandBId || null,
      coverUrl: data.coverUrl || null,
      prosA: clean(prosA),
      consA: clean(consA),
      prosB: clean(prosB),
      consB: clean(consB)
    };

    const res = await fetch(`/api/admin/compare/${comparison.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/compare");
      router.refresh();
    } else {
      const j = await res.json();
      setError(j.error || "Failed to update comparison");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/compare" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to comparisons
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Comparison</h1>

      <form onSubmit={submit} className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Title<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="title" name="title" type="text" required defaultValue={comparison.title}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Slug<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="slug" name="slug" type="text" required defaultValue={comparison.slug}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <ImageUploadField name="coverUrl" label="Cover Image" defaultValue={comparison.coverUrl || ""} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="itemAName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Item A Name</label>
            <input id="itemAName" name="itemAName" type="text" defaultValue={comparison.itemAName || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          </div>
          <div>
            <label htmlFor="itemBName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Item B Name</label>
            <input id="itemBName" name="itemBName" type="text" defaultValue={comparison.itemBName || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="brandAId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Link Brand A</label>
            <select id="brandAId" name="brandAId" disabled={brandsLoading} defaultValue={comparison.brandAId || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <option value="">None</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="brandBId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Link Brand B</label>
            <select id="brandBId" name="brandBId" disabled={brandsLoading} defaultValue={comparison.brandBId || ""}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <option value="">None</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-gray-100 dark:border-gray-800">
  <div className="space-y-4">
    <ListInput label="Pros A" values={prosA} onChange={setProsA} />
    <ListInput label="Cons A" values={consA} onChange={setConsA} />
    <div>
      <label htmlFor="bestForA" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Best For A</label>
      <input id="bestForA" name="bestForA" type="text" defaultValue={comparison.bestForA || ""}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
    </div>
    <CtaLinkField
      title="Link for Option A"
      linkName="ctaLinkA"
      labelName="ctaLabelA"
      defaultLink={comparison.ctaLinkA || ""}
      defaultLabel={comparison.ctaLabelA || ""}
    />
  </div>
  <div className="space-y-4">
    <ListInput label="Pros B" values={prosB} onChange={setProsB} />
    <ListInput label="Cons B" values={consB} onChange={setConsB} />
    <div>
      <label htmlFor="bestForB" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Best For B</label>
      <input id="bestForB" name="bestForB" type="text" defaultValue={comparison.bestForB || ""}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
    </div>
    <CtaLinkField
      title="Link for Option B"
      linkName="ctaLinkB"
      labelName="ctaLabelB"
      defaultLink={comparison.ctaLinkB || ""}
      defaultLabel={comparison.ctaLabelB || ""}
    />
  </div>
</div>

        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Verdict / Summary</label>
          <textarea id="summary" name="summary" rows={4} defaultValue={comparison.summary || ""}
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
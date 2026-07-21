"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageUploadField from "@/components/ImageUploadField";
import RichTextEditor, { RichTextEditorHandle } from "@/components/RichTextEditor";
import { useState, useRef } from "react";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<RichTextEditorHandle>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd);
    const content = editorRef.current?.getHTML() || "";
    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, content })
    });
    setLoading(false);
    if (res.ok) { router.push("/admin/blog"); router.refresh(); }
    else { const j = await res.json(); setError(j.error || "Failed"); }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to posts
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">New Blog Post</h1>
      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        {([
          { name: "title", label: "Title", required: true },
          { name: "slug", label: "Slug", required: true, placeholder: "my-post-slug" },
          { name: "metaTitle", label: "Meta Title", placeholder: "SEO title (max 200 chars)" },
          { name: "metaDesc", label: "Meta Description", placeholder: "SEO description (max 300 chars)" }
        ] as { name: string; label: string; required?: boolean; type?: string; placeholder?: string }[]).map(({ name, label, required, type = "text", placeholder }) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
            </label>
            <input id={name} name={name} type={type} required={required} placeholder={placeholder}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          </div>
        ))}

        <ImageUploadField name="coverUrl" label="Cover Image" />
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} placeholder="Short summary shown in listings" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Content<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <RichTextEditor ref={editorRef} content="" />
        </div>

        {error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60">
          {loading ? "Publishing…" : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
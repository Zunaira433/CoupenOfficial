"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImageUploadField from "@/components/ImageUploadField";
import RichTextEditor from "@/components/RichTextEditor";

type BlogPostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverUrl: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
};

export default function EditBlogPostForm({ post }: { post: BlogPostData }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(post.content);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd);
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PATCH",
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
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Edit Blog Post</h1>

      <form onSubmit={submit} className="space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Title<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="title" name="title" type="text" required defaultValue={post.title}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Slug<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input id="slug" name="slug" type="text" required defaultValue={post.slug}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <ImageUploadField name="coverUrl" label="Cover Image" defaultValue={post.coverUrl || ""} />

        <div>
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Title</label>
          <input id="metaTitle" name="metaTitle" type="text" defaultValue={post.metaTitle || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="metaDesc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Meta Description</label>
          <input id="metaDesc" name="metaDesc" type="text" defaultValue={post.metaDesc || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post.excerpt || ""}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Content<span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <RichTextEditor content={content} onChange={setContent} />
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
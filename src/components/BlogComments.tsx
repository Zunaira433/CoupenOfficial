"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Shield } from "lucide-react";

type CommentT = {
  id: string;
  body: string;
  adminReply: string | null;
  adminReplyAt: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
};

export default function BlogComments({ slug }: { slug: string }) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentT[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch(`/api/blog/${slug}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch(`/api/blog/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: text })
    });
    setSubmitting(false);
    if (res.status === 401) {
      router.push(`/login?next=/blog/${slug}`);
      return;
    }
    if (res.ok) {
      setText("");
      load();
    } else {
      const j = await res.json();
      setError(j.error || "Failed to post comment");
    }
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Comments {!loading && `(${comments.length})`}
        </h2>
      </div>

      <form onSubmit={submit} className="mb-8">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Share your thoughts..."
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="mt-3 px-5 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post Comment"}
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400 dark:text-gray-600 text-sm">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-600 text-sm">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-medium text-gray-900 dark:text-white text-sm">
                  {c.user.name || c.user.email.split("@")[0]}
                </span>
                <time className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(c.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">{c.body}</p>

              {c.adminReply && (
                <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/40">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                    <span className="text-xs font-semibold text-primary">CoupenOfficial Team</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{c.adminReply}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Send, ExternalLink } from "lucide-react";

type Props = {
  id: string;
  body: string;
  adminReply: string | null;
  userName: string;
  postTitle: string;
  postHref: string;
  createdAt: string;
};

export default function CommentModerationRow({ id, body, adminReply, userName, postTitle, postHref, createdAt }: Props) {
  const router = useRouter();
  const [replyText, setReplyText] = useState(adminReply || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveReply() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminReply: replyText })
    });
    setSaving(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Failed to save reply");
    }
  }

  async function deleteComment() {
    if (!confirm("Delete this comment permanently?")) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    setDeleting(false);
    if (res.ok) {
      router.refresh();
    } else {
      setError("Failed to delete comment");
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm">
          <span className="font-medium text-gray-900 dark:text-white">{userName}</span>
          <span className="text-gray-400 dark:text-gray-500"> on </span>
          <Link href={postHref} target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">
            {postTitle}
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </Link>
        </div>
        <time className="text-xs text-gray-400 dark:text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </time>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{body}</p>

      <div className="flex flex-col sm:flex-row gap-2 items-start">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          rows={2}
          placeholder="Write a reply as CoupenOfficial Team..."
          className="flex-1 w-full px-3 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
        />
        <div className="flex gap-2 shrink-0">
          <button
            onClick={saveReply}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            {saving ? "Saving…" : "Reply"}
          </button>
          <button
            onClick={deleteComment}
            disabled={deleting}
            className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Delete comment"
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
    </div>
  );
}
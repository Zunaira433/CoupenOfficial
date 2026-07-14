"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import Avatar from "@/components/Avatar";

export default function AvatarUpload({ currentAvatarUrl, displayName }: { currentAvatarUrl: string | null; displayName: string }) {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        const j = await uploadRes.json();
        setError(j.error || "Upload failed");
        setUploading(false);
        return;
      }
      const { url } = await uploadRes.json();

      const saveRes = await fetch("/api/dashboard/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: url })
      });

      if (saveRes.ok) {
        setAvatarUrl(url);
        router.refresh();
      } else {
        setError("Failed to save photo");
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  }

  async function handleRemove() {
    if (!confirm("Remove your profile photo?")) return;
    setUploading(true);
    setError(null);
    const res = await fetch("/api/dashboard/avatar", { method: "DELETE" });
    setUploading(false);
    if (res.ok) {
      setAvatarUrl(null);
      router.refresh();
    } else {
      setError("Failed to remove photo");
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar src={avatarUrl} name={displayName} size={64} expandable />
      <div>
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors cursor-pointer">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Uploading…
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" aria-hidden="true" />
                Change Photo
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
          {avatarUrl && (
            <button
              onClick={handleRemove}
              disabled={uploading}
              className="px-3 py-2 text-sm text-red-500 border border-red-200 dark:border-red-900/40 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
      </div>
    </div>
  );
}
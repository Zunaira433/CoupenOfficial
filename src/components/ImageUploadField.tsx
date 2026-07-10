"use client";
import { useState } from "react";
import { Upload, Link2, Loader2 } from "lucide-react";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
};

export default function ImageUploadField({ name, label, defaultValue = "" }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"url" | "upload">("url");
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
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setValue(data.url);
      } else {
        const j = await res.json();
        setError(j.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    }
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${mode === "url" ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <Link2 className="w-3 h-3" aria-hidden="true" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${mode === "upload" ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
          >
            <Upload className="w-3 h-3" aria-hidden="true" />
            Upload
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input
          id={name}
          name={name}
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://example.com/image.png"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      ) : (
        <div>
          <input type="hidden" name={name} value={value} />
          <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-primary hover:text-primary cursor-pointer transition-colors">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" aria-hidden="true" />
                Choose file from your PC
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>
        </div>
      )}

      {value && (
        <div className="mt-2 flex items-center gap-2">
          <img src={value} alt="Preview" className="w-12 h-12 object-contain rounded-lg border border-gray-200 dark:border-gray-700 bg-white" />
          <span className="text-xs text-gray-400 truncate">{value}</span>
        </div>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>}
    </div>
  );
}
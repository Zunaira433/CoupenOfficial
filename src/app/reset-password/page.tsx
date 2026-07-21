"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Missing or invalid reset link.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password })
    });
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      const j = await res.json();
      setError(j.error || "Failed to reset password.");
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to login
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
      {success ? (
        <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200">
          <p className="text-sm text-green-700">Your password has been reset. Redirecting you to login…</p>
        </div>
      ) : !token ? (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">
            This reset link is missing or invalid. Please request a new one from the{" "}
            <Link href="/forgot-password" className="underline">forgot password</Link> page.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-4 py-16">Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
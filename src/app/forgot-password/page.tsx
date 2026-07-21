"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    setLoading(false);
    if (res.ok) setSubmitted(true);
    else setError("Something went wrong. Please try again.");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <Link href="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mb-6 focus:outline-none focus-visible:underline">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to login
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
      {submitted ? (
        <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            If an account exists for <strong>{email}</strong>, a password reset link has been sent.
            Please check your inbox (and spam folder).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Enter your account email and we&apos;ll send you a link to reset your password.
          </p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md border px-4 py-2 bg-white text-gray-900 placeholder-gray-400"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
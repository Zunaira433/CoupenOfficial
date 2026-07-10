"use client";
import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage("You're subscribed! Watch your inbox for deals.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Please try again.");
    }
  }

  return (
    <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-3">
        <Mail className="w-6 h-6 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Get exclusive deals</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Join thousands of smart shoppers. We send verified coupon codes — no spam, ever.
      </p>

      {status === "success" ? (
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium" role="alert">
          <CheckCircle className="w-5 h-5" aria-hidden="true" />
          {message}
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3" noValidate>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            disabled={status === "loading"}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 transition-colors whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing…" : "Subscribe Free"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {message}
        </p>
      )}
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        No spam. Unsubscribe any time. We respect your privacy.
      </p>
    </div>
  );
}

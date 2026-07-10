"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const CONSENT_KEY = "cookie-consent";
type Consent = "accepted" | "rejected" | null;

export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY) as Consent;
    setConsent(stored);
    setReady(true);
  }, []);

  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" && <GoogleAnalytics />}

      {ready && consent === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6"
        >
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="w-6 h-6 text-primary shrink-0 hidden sm:block" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-300 flex-1">
              We use cookies to improve your experience and understand site traffic. See our{" "}
              <Link href="/cookies" className="underline text-primary">
                Cookie Policy
              </Link>{" "}
              for details.
            </p>
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => choose("rejected")}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Reject
              </button>
              <button
                onClick={() => choose("accepted")}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
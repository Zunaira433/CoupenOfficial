"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[AppError]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <AlertTriangle className="w-16 h-16 text-red-400 mb-6" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Something went wrong</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        An unexpected error occurred. Our team has been notified. Please try refreshing the page.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        Try again
      </button>
    </div>
  );
}

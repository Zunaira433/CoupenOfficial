import Link from "next/link";
import { Search, Home, Tag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <div className="text-8xl font-extrabold text-primary/20 dark:text-primary/10 select-none mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        We couldn&apos;t find what you&apos;re looking for. Try searching for a brand or browse our latest deals.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <Home className="w-4 h-4" aria-hidden="true" />
          Go home
        </Link>
        <Link href="/search" className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Search className="w-4 h-4" aria-hidden="true" />
          Search brands
        </Link>
        <Link href="/deals" className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Tag className="w-4 h-4" aria-hidden="true" />
          Browse deals
        </Link>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

function buildHref(basePath: string, page: number, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ ...extra, page: String(page) });
  return `${basePath}?${params.toString()}`;
}

export default function Pagination({ currentPage, totalPages, basePath, queryParams = {} }: Props) {
  if (totalPages <= 1) return null;

  const prev = currentPage > 1 ? currentPage - 1 : null;
  const next = currentPage < totalPages ? currentPage + 1 : null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2
  );

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {prev ? (
        <Link
          href={buildHref(basePath, prev, queryParams)}
          aria-label="Previous page"
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </span>
      )}

      {pages.map((p, i) => {
        const showEllipsis = i > 0 && p - pages[i - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {showEllipsis && <span className="text-gray-400 select-none">…</span>}
            {p === currentPage ? (
              <span
                aria-current="page"
                className="min-w-[2.25rem] h-9 flex items-center justify-center rounded-lg bg-primary text-white text-sm font-semibold"
              >
                {p}
              </span>
            ) : (
              <Link
                href={buildHref(basePath, p, queryParams)}
                className="min-w-[2.25rem] h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
              >
                {p}
              </Link>
            )}
          </span>
        );
      })}

      {next ? (
        <Link
          href={buildHref(basePath, next, queryParams)}
          aria-label="Next page"
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
        >
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className="p-2 rounded-lg border border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-700 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  );
}

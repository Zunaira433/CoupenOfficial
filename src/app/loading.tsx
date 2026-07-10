export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" aria-label="Loading page content">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" role="status" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    </div>
  );
}

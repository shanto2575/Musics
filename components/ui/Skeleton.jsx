export function SkeletonCard({ compact = false }) {
  return (
    <div className="animate-pulse rounded-2xl border border-white/5 bg-elevated p-3">
      <div className="mb-3 aspect-square w-full rounded-xl bg-white/5" />
      <div className="mb-2 h-3 w-3/4 rounded bg-white/10" />
      <div className="h-3 w-1/2 rounded bg-white/5" />
      {!compact && <div className="mt-2 h-2.5 w-1/3 rounded bg-white/5" />}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="animate-pulse grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 rounded-2xl border border-white/5 bg-elevated/60 px-3 py-2.5 md:grid-cols-[2.75rem_1.6fr_1.2fr_0.8fr_4rem_auto] md:gap-4 md:px-4">
      <div className="h-11 w-11 rounded-lg bg-white/5" />
      <div className="space-y-2">
        <div className="h-3 w-2/3 rounded bg-white/10" />
        <div className="h-2.5 w-1/3 rounded bg-white/5" />
      </div>
      <div className="hidden h-3 w-24 rounded bg-white/5 md:block" />
      <div className="hidden h-3 w-16 rounded bg-white/5 md:block" />
      <div className="hidden h-3 w-10 rounded bg-white/5 md:block" />
      <div className="h-5 w-12 rounded-full bg-white/5" />
    </div>
  );
}

export function SkeletonGrid({ count = 6, compact = false }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} compact={compact} />
      ))}
    </div>
  );
}
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-white/5 bg-elevated p-3"
        >
          <div className="mb-3 aspect-square w-full rounded-xl bg-white/5" />
          <div className="mb-2 h-3 w-3/4 rounded bg-white/10" />
          <div className="h-3 w-1/2 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

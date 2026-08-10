export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-zinc-400 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
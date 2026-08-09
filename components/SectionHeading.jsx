export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-purple-400">
            {eyebrow}
          </p>
        )}
        <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-xl text-sm text-zinc-400 sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

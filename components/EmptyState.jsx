import { Music4 } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-elevated/50 px-6 py-16 text-center">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 text-purple-300">
        <div
          aria-hidden="true"
          className="absolute -inset-2 rounded-3xl bg-purple-500/10 blur-lg"
        />
        <Music4 size={26} />
      </div>
      <h3 className="font-heading text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-zinc-400">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
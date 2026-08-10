const TONES = {
  purple: "border-purple-400/20 bg-purple-500/10 text-purple-300",
  pink: "border-pink-400/20 bg-pink-500/10 text-pink-300",
  fuchsia: "border-fuchsia-400/20 bg-fuchsia-500/10 text-fuchsia-300",
  emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  red: "border-red-400/20 bg-red-500/10 text-red-300",
  zinc: "border-white/10 bg-white/5 text-zinc-400",
  amber: "border-amber-400/20 bg-amber-500/10 text-amber-300",
};

export default function Badge({ children, tone = "purple", className = "" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
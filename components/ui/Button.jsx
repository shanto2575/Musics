import Link from "next/link";

const VARIANTS = {
  primary:
    "btn-gradient text-white shadow-lg shadow-purple-500/25 hover:brightness-110 hover:shadow-purple-500/40",
  secondary:
    "border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 hover:border-white/20",
  ghost: "text-zinc-300 hover:bg-white/5 hover:text-white",
  danger:
    "bg-red-500/90 text-white shadow-lg shadow-red-500/20 hover:bg-red-400",
  outline: "border border-white/10 text-zinc-200 hover:border-purple-400/40 hover:text-white",
};

const SIZES = {
  sm: "px-4 py-2 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3 text-sm gap-2",
  icon: "h-10 w-10",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href = null,
  className = "",
  ...props
}) {
  const classes = `inline-flex items-center justify-center rounded-full font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
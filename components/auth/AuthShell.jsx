import Link from "next/link";
import { AudioLines } from "lucide-react";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-glow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="animate-glow absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-pink-600/15 blur-3xl [animation-delay:2s]" />
        <div
          className="absolute inset-0 opacity-[0.3] [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <Link
        href="/"
        className="animate-fade-up mb-10 flex items-center gap-2.5 font-heading text-2xl font-bold tracking-tight"
        aria-label="VibeFlow home"
      >
        <span className="btn-gradient flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-purple-500/20">
          <AudioLines size={24} className="text-white" />
        </span>
        Vibe<span className="text-gradient">Flow</span>
      </Link>

      <div className="animate-fade-up relative w-full max-w-md [animation-delay:100ms]">
        <div
          aria-hidden="true"
          className="absolute -inset-1 rounded-[2.25rem] bg-gradient-to-r from-purple-500/25 via-fuchsia-500/10 to-pink-500/25 blur-xl"
        />
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface/85 p-8 shadow-2xl backdrop-blur-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
          />
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-zinc-400">{subtitle}</p>
          )}
          {children}
        </div>
        {footer && (
          <p className="mt-6 text-center text-sm text-zinc-400">{footer}</p>
        )}
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AudioLines, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    authClient
      .getSession()
      .then(({ data }) => {
        if (active && data?.user) {
          router.replace(data.user.role === "admin" ? "/admin" : "/discover");
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const { data, error: signInError } = await authClient.signIn.email({
      email,
      password,
    });
    if (signInError) {
      setError(signInError.message || "Invalid email or password.");
      setLoading(false);
      return;
    }
    router.replace(data?.user?.role === "admin" ? "/admin" : "/discover");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-glow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/25 blur-3xl" />
        <div className="animate-glow absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-pink-600/20 blur-3xl [animation-delay:2s]" />
      </div>

      <Link
        href="/"
        className="mb-10 flex items-center gap-2 font-heading text-2xl font-bold tracking-tight"
      >
        <span className="btn-gradient flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg shadow-purple-500/20">
          <AudioLines size={24} className="text-white" />
        </span>
        Vibe<span className="text-gradient">Flow</span>
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-surface/80 p-8 shadow-2xl backdrop-blur-xl">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Sign in to your account to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-purple-400/60 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient flex h-12 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition duration-300 hover:brightness-110 hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          <Link href="/" className="text-purple-400 transition hover:text-purple-300">
            ← Back to site
          </Link>
        </p>
      </div>
    </main>
  );
}

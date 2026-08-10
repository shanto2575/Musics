"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";

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
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your account to continue."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-purple-400 transition hover:text-purple-300"
          >
            Sign up
          </Link>
          <span aria-hidden="true" className="mx-2 text-zinc-600">
            ·
          </span>
          <Link
            href="/"
            className="text-zinc-400 transition hover:text-white"
          >
            Back to site
          </Link>
        </>
      }
    >
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
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-500 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/40"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
          className="btn-gradient flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition duration-300 hover:brightness-110 hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </AuthShell>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import AuthShell from "@/components/auth/AuthShell";
import PasswordInput from "@/components/auth/PasswordInput";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await authClient.signUp.email({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    if (signUpError) {
      const code = signUpError.code || "";
      const message =
        signUpError.message || "Registration failed. Please try again.";
      if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
        setError("An account with this email already exists.");
      } else if (code === "PASSWORD_TOO_SHORT") {
        setError("Password must be at least 8 characters.");
      } else if (code === "INVALID_EMAIL") {
        setError("Please enter a valid email address.");
      } else {
        setError(message);
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.replace(data?.user?.role === "admin" ? "/admin" : "/discover");
      router.refresh();
    }, 900);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join VibeFlow to start streaming."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-400 transition hover:text-purple-300"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-500 focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/40"
          />
        </div>

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
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-zinc-300"
          >
            Confirm Password
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
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

        {success && (
          <div
            role="status"
            className="flex items-start gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>Account created! Redirecting you to Discover…</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="btn-gradient flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition duration-300 hover:brightness-110 hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
    </AuthShell>
  );
}
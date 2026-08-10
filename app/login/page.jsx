"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ArrowRight, 
  Music, 
  Headphones
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import PasswordInput from "@/components/auth/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
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
    <div className="flex min-h-screen w-full bg-zinc-950 text-white selection:bg-purple-500 selection:text-white overflow-hidden justify-center items-center">
      
      {/* Container with max-width and proper center spacing matching signup page */}
      <div className="flex w-full max-w-7xl min-h-screen items-center justify-between px-4 lg:px-12 xl:px-16 gap-8 lg:gap-12">
        
        {/* ================= LEFT SIDE: AI Music Showcase ================= */}
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between py-12">
          
          {/* Glowing Background Orbs */}
          <div className="absolute -top-20 -left-20 h-[450px] w-[450px] rounded-full bg-purple-600/15 blur-[130px] pointer-events-none animate-pulse" />
          <div className="absolute -bottom-20 -right-20 h-[450px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[130px] pointer-events-none" />

          {/* Top Header / Logo */}
          <div className="relative z-10 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-3 font-bold tracking-tight text-xl group">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white shadow-lg shadow-purple-500/30 group-hover:scale-105 transition duration-300">
                <Music size={22} className="animate-bounce" />
              </div>
              <span className="bg-gradient-to-r from-white via-zinc-200 to-purple-200 bg-clip-text text-transparent font-extrabold text-2xl">
                SONIVA
              </span>
            </Link>
          </div>

          {/* Middle Content: Music AI Branding */}
          <div className="relative z-10 my-auto max-w-lg space-y-8 py-10">
            
            <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300 backdrop-blur-md">
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-purple-400 h-full animate-pulse" />
                <span className="w-0.5 bg-purple-400 h-2/3 animate-ping" />
                <span className="w-0.5 bg-purple-400 h-4/5 animate-pulse" />
              </span>
              Next-Gen AI Audio Studio
            </div>
            
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl leading-[1.08]">
              Feel the sound of <br />
              <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400 bg-clip-text text-transparent">
                intelligent music.
              </span>
            </h1>
            
            <p className="text-base text-zinc-400 leading-relaxed font-normal">
              Step into the future of sound. Generate custom beats, discover AI-curated playlists, and experience studio-quality music tailored to your vibe.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm hover:border-purple-500/30 transition">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Headphones size={18} />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">Lossless Audio</p>
                  <p className="text-zinc-500">Spatial sound engine</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-sm hover:border-purple-500/30 transition">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                  <Sparkles size={18} />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white">AI Beat Maker</p>
                  <p className="text-zinc-500">Instant music gen</p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* ================= RIGHT SIDE: Login Form ================= */}
        <div className="flex w-full lg:w-1/2 flex-col justify-center py-10">
          <div className="mx-auto w-full max-w-md space-y-6 bg-zinc-900/40 border border-white/5 p-8 sm:p-10 rounded-3xl backdrop-blur-xl shadow-2xl">
            
            <div className="flex lg:hidden items-center justify-between mb-2">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white">
                  <Music size={16} />
                </div>
                <span>SONIVA</span>
              </Link>
              <Link href="/" className="text-xs font-medium text-purple-400 hover:text-purple-300">
                Back to site &rarr;
              </Link>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h2>
              <p className="text-sm text-zinc-400">Enter your account to jump straight into the rhythm.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artist@soniva.com"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition outline-none placeholder:text-zinc-600 focus:border-purple-400/80 focus:bg-white/[0.08] focus:ring-4 focus:ring-purple-500/10"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                  className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                >
                  <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition-all duration-300 hover:brightness-110 hover:shadow-purple-600/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Start Listening</span>
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-950 px-3 text-zinc-500 font-medium">New to Soniva?</span>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center w-full rounded-xl border border-white/10 bg-white/[0.02] py-3 text-sm font-semibold text-white hover:bg-white/5 transition-all duration-200"
              >
                Create an Account
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
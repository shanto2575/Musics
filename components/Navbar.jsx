"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AudioLines, LogOut, Menu, Search, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Discover", href: "/discover" },
  { label: "Artists", href: "/artists" },
  { label: "Playlists", href: "/playlists" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { stopAndResetPlayer } = useMusicPlayer();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    authClient
      .getSession()
      .then(({ data }) => {
        if (active) {
          setSession(data || null);
          setCheckingSession(false);
        }
      })
      .catch(() => {
        if (active) setCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      stopAndResetPlayer();
      const { error } = await authClient.signOut();
      if (error) {
        console.error("Sign out failed:", error);
        setLoggingOut(false);
        return;
      }
      setSession(null);
      setCheckingSession(false);
      setOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
      setLoggingOut(false);
    }
  }

  const isAdmin = session?.user?.role === "admin";

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const logoutButton = (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      aria-label="Logout"
      className="flex h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <LogOut size={16} />
      {loggingOut ? "Signing out…" : "Logout"}
    </button>
  );

  const adminLink = (
    <Link
      href="/admin"
      className="btn-gradient rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition duration-300 hover:brightness-110 hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
    >
      Admin Dashboard
    </Link>
  );

  let accountArea = null;
  if (!checkingSession) {
    if (isAdmin) {
      accountArea = (
        <>
          {adminLink}
          {logoutButton}
        </>
      );
    } else if (session) {
      const displayName = session.user?.name || session.user?.email || "User";
      accountArea = (
        <>
          <span
            className="flex h-10 max-w-40 items-center truncate rounded-full border border-white/10 bg-white/5 px-4 text-sm font-medium text-zinc-200"
            title={session.user?.email || displayName}
          >
            {displayName}
          </span>
          {logoutButton}
        </>
      );
    } else {
      accountArea = (
        <>
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="btn-gradient rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition duration-300 hover:brightness-110 hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
          >
            Get Started
          </Link>
        </>
      );
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
          aria-label="VibeFlow home"
        >
          <span className="btn-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-purple-500/20">
            <AudioLines size={20} className="text-white" />
          </span>
          <span>
            SONI<span className="text-gradient">VA</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(link.href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/discover"
            aria-label="Search music"
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
          >
            <Search size={20} />
          </Link>
          {accountArea}
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-background/95 px-4 pt-2 pb-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive(link.href)
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!checkingSession && (
              <div className="mt-2 flex flex-col gap-1 border-t border-white/5 pt-2">
                {isAdmin ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="btn-gradient rounded-full px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/25"
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-red-400/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut size={16} />
                      {loggingOut ? "Signing out…" : "Logout"}
                    </button>
                  </>
                ) : session ? (
                  <>
                    <span className="truncate px-4 py-3 text-sm font-semibold text-zinc-200">
                      {session.user?.name || session.user?.email || "User"}
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:border-red-400/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <LogOut size={16} />
                      {loggingOut ? "Signing out…" : "Logout"}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold text-zinc-300 transition hover:border-white/20 hover:text-white"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="btn-gradient rounded-full px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/25"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

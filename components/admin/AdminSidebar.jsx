"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  AudioLines,
  LayoutDashboard,
  ListMusic,
  LogOut,
  Menu,
  Music,
  Settings,
  UploadCloud,
  Users,
  X,
  ExternalLink,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: ExternalLink },
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Songs", href: "/admin/songs", icon: Music },
  { label: "Upload Song", href: "/admin/upload", icon: UploadCloud },
  { label: "Artists", href: "/admin/artists", icon: Users },
  { label: "Playlists", href: "/admin/playlists", icon: ListMusic },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { stopAndResetPlayer } = useMusicPlayer();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
      setLoggingOut(false);
    }
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="btn-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-purple-500/20">
            <AudioLines size={20} className="text-white" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">
            Vibe<span className="text-gradient">Flow</span>
            <span className="ml-1.5 text-xs font-medium text-zinc-500">Admin</span>
          </span>
        </Link>
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                active
                  ? "btn-gradient text-white shadow-lg shadow-purple-500/25"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/5 p-3">
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-red-500/10 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogOut size={18} />
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/5 bg-surface lg:block">
        {content}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-white/5 bg-surface transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {content}
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/5 bg-background/80 px-4 backdrop-blur-xl lg:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white"
        >
          <Menu size={22} />
        </button>
        <Link
          href="/admin"
          className="font-heading text-base font-bold tracking-tight"
        >
          Vibe<span className="text-gradient">Flow</span> Admin
        </Link>
        <Link
          href="/"
          aria-label="View site"
          className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={20} />
        </Link>
      </header>
    </>
  );
}

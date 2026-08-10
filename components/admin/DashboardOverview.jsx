"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  LayoutDashboard,
  ListMusic,
  Music,
  Settings,
  UploadCloud,
} from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Badge from "@/components/ui/Badge";
import Tabs from "@/components/ui/Tabs";
import EmptyState from "@/components/EmptyState";
import { formatDuration, formatDate } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Upload a song", href: "/admin/upload", icon: UploadCloud },
  { label: "Manage songs", href: "/admin/songs", icon: Music },
  { label: "View playlists", href: "/admin/playlists", icon: ListMusic },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const GRADIENT_BARS = [
  "from-purple-500 to-fuchsia-500",
  "from-fuchsia-500 to-pink-500",
  "from-pink-500 to-rose-400",
  "from-violet-500 to-purple-400",
  "from-indigo-500 to-violet-500",
  "from-rose-400 to-pink-400",
];

export default function DashboardOverview({ songs }) {
  const [tab, setTab] = useState("uploads");

  const genreData = useMemo(() => {
    const counts = new Map();
    for (const song of songs) {
      const key = song.genre || "Unknown";
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const max = entries.length ? Math.max(...entries.map(([, n]) => n)) : 1;
    return entries.map(([genre, count], i) => ({
      genre,
      count,
      pct: Math.round((count / songs.length) * 100),
      height: Math.max(8, Math.round((count / max) * 100)),
      gradient: GRADIENT_BARS[i % GRADIENT_BARS.length],
    }));
  }, [songs]);

  const totalMinutes = useMemo(
    () =>
      Math.round(
        songs.reduce((sum, s) => sum + (Number(s.duration) || 0), 0) / 60
      ),
    [songs]
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-white/5 bg-elevated p-4 transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300 transition group-hover:bg-purple-500/20">
              <Icon size={19} />
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-zinc-200 transition group-hover:text-white">
              {label}
              <ArrowRight
                size={13}
                className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </span>
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-white">
            Library overview
          </h2>
          <p className="mt-0.5 text-sm text-zinc-400">
            {songs.length} songs · {genreData.length} genres ·{" "}
            {totalMinutes} min of music
          </p>
        </div>
        <Tabs
          tabs={[
            {
              id: "uploads",
              label: "Recent Uploads",
              icon: <LayoutDashboard size={13} />,
            },
            {
              id: "genres",
              label: "Genre Mix",
              icon: <ListMusic size={13} />,
            },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      {tab === "uploads" ? (
        songs.length === 0 ? (
          <EmptyState
            title="No songs uploaded yet"
            description="Upload your first song to start building your library."
            action={
              <Link
                href="/admin/upload"
                className="btn-gradient inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
              >
                <UploadCloud size={16} />
                Upload a song
              </Link>
            }
          />
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/5 bg-elevated">
            <ul className="divide-y divide-white/5">
              {songs.slice(0, 6).map((song) => (
                <li
                  key={song.id}
                  className="group flex items-center gap-4 px-4 py-3 transition hover:bg-white/[0.03]"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <CoverImage src={song.coverUrl} alt={`${song.title} cover`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {song.title}
                    </p>
                    <p className="truncate text-xs text-zinc-400">
                      {song.artist}
                    </p>
                  </div>
                  <Badge className="hidden sm:inline-flex">
                    {song.genre || "Unknown"}
                  </Badge>
                  <span className="hidden text-sm tabular-nums text-zinc-400 md:block">
                    {formatDuration(song.duration)}
                  </span>
                  <span className="hidden w-24 text-right text-xs text-zinc-500 lg:block">
                    {formatDate(song.createdAt)}
                  </span>
                  <Link
                    href="/admin/songs"
                    aria-label={`Manage ${song.title}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-zinc-500 opacity-0 transition group-hover:opacity-100 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/5 px-4 py-3">
              <Link
                href="/admin/songs"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 transition hover:text-purple-300"
              >
                View all songs
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="rounded-3xl border border-white/5 bg-elevated p-6">
          {genreData.length === 0 ? (
            <EmptyState
              title="No genres yet"
              description="Genres appear here once songs are uploaded."
            />
          ) : (
            <>
              <div className="flex h-44 items-end justify-between gap-3">
                {genreData.map((item) => (
                  <div
                    key={item.genre}
                    className="group flex h-full flex-1 flex-col items-center justify-end gap-2"
                    title={`${item.genre}: ${item.count} songs`}
                  >
                    <span className="text-xs font-semibold tabular-nums text-zinc-300">
                      {item.count}
                    </span>
                    <div
                      className={`w-full max-w-10 rounded-t-lg bg-gradient-to-t ${item.gradient} transition duration-300 group-hover:brightness-125`}
                      style={{ height: `${item.height}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {genreData.map((item, i) => (
                  <span
                    key={item.genre}
                    className="flex items-center gap-1.5 text-xs text-zinc-400"
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-full bg-gradient-to-br ${item.gradient}`}
                    />
                    {item.genre}
                    <span className="tabular-nums text-zinc-500">
                      · {item.pct}%
                    </span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
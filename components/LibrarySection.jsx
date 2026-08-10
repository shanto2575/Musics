"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Play, Pause, ArrowRight, Clock, ArrowDownAZ, Timer } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import SearchBar from "@/components/SearchBar";
import CoverImage from "@/components/CoverImage";
import Equalizer from "@/components/Equalizer";
import LikeButton from "@/components/LikeButton";
import MusicCard from "@/components/MusicCard";
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import EmptyState from "@/components/EmptyState";
import { SkeletonGrid, SkeletonRow } from "@/components/ui/Skeleton";
import { fetchSongs } from "@/lib/client";
import { GENRES } from "@/lib/seed-data";
import { formatDuration } from "@/lib/utils";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

const SORT_OPTIONS = [
  { value: "recent", label: "Recently added", icon: <Clock size={14} /> },
  { value: "az", label: "Title A–Z", icon: <ArrowDownAZ size={14} /> },
  { value: "za", label: "Title Z–A", icon: <ArrowDownAZ size={14} className="rotate-180" /> },
  { value: "longest", label: "Longest", icon: <Timer size={14} /> },
  { value: "shortest", label: "Shortest", icon: <Timer size={14} className="rotate-180" /> },
];

export default function LibrarySection({
  initialQuery = "",
  embedded = false,
  layout = "list",
  hideHeading = false,
}) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("recent");

  const { currentSong, isPlaying, playSong } = useMusicPlayer();

  useEffect(() => {
    let cancelled = false;
    fetchSongs()
      .then((data) => {
        if (!cancelled) setSongs(data);
      })
      .catch(() => {
        if (!cancelled)
          setError("Couldn't load the music library. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    const matches = songs.filter((song) => {
      const matchesGenre =
        genre === "All" ||
        (song.genre || "").toLowerCase() === genre.toLowerCase();
      if (!matchesGenre) return false;
      if (!q) return true;
      return [song.title, song.artist, song.album, song.genre]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));
    });

    const sorted = [...matches];
    switch (sort) {
      case "az":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "longest":
        sorted.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;
      case "shortest":
        sorted.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      default:
        break;
    }
    return sorted;
  }, [songs, debouncedQuery, genre, sort]);

  return (
    <section
      id="library"
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${
        embedded ? "py-16" : "py-14"
      }`}
    >
      {!hideHeading &&
        (embedded ? (
          <SectionHeading
            eyebrow="Browse"
            title="Music Library"
            description="Search and filter the full VibeFlow catalog."
            action={
              <Link
                href="/discover"
                className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-purple-400 transition hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
              >
                View all
                <ArrowRight size={16} />
              </Link>
            }
          />
        ) : (
          <div className="animate-fade-up mb-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Music <span className="text-gradient">Library</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400 sm:text-base">
              Search, filter, and sort the full VibeFlow catalog.
            </p>
          </div>
        ))}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full lg:max-w-md">
          <SearchBar value={query} onChange={setQuery} />
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
          <Dropdown
            label="Sort"
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
            widthClass="w-52"
            align="right"
          />
          <div className="flex items-center gap-2">
            {["All", ...GENRES].map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={genre === g}
                onClick={() => setGenre(g)}
                className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${
                  genre === g
                    ? "btn-gradient border-transparent text-white shadow-lg shadow-purple-500/25"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loading && !error && filtered.length > 0 && (
        <p className="mb-4 text-xs text-zinc-500">
          {filtered.length} {filtered.length === 1 ? "song" : "songs"}
          {debouncedQuery && (
            <>
              {" "}
              for <span className="text-white">&ldquo;{debouncedQuery}&rdquo;</span>
            </>
          )}
        </p>
      )}

      {loading ? (
        layout === "grid" ? (
          <SkeletonGrid count={10} compact />
        ) : (
          <div className="flex flex-col gap-2" aria-label="Loading songs">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )
      ) : error ? (
        <EmptyState
          title="Something went wrong"
          description={error}
          action={
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError("");
                fetchSongs()
                  .then(setSongs)
                  .catch(() =>
                    setError("Couldn't load the music library. Please try again.")
                  )
                  .finally(() => setLoading(false));
              }}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Retry
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            debouncedQuery || genre !== "All"
              ? `No music found${debouncedQuery ? ` for "${debouncedQuery}"` : ""}`
              : "No songs found."
          }
          description={
            songs.length === 0
              ? "Upload your first song to start building your library."
              : "Try a different search or filter."
          }
        />
      ) : layout === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((song) => (
            <MusicCard key={song.id} song={song} playlist={filtered} compact />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((song, index) => {
            const isCurrent = currentSong && currentSong.id === song.id;
            const playing = isCurrent && isPlaying;
            return (
              <div
                key={song.id}
                role="button"
                tabIndex={0}
                aria-label={`Play ${song.title} by ${song.artist}`}
                onClick={() => playSong(song, filtered)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    playSong(song, filtered);
                  }
                }}
                className={`group grid cursor-pointer grid-cols-[2.75rem_1fr_auto] items-center gap-3 rounded-2xl border bg-elevated/60 px-3 py-2.5 transition duration-200 hover:border-purple-400/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 md:grid-cols-[1.25rem_2.75rem_1.6fr_1.2fr_0.8fr_4rem_auto] md:gap-4 md:px-4 ${
                  isCurrent ? "border-purple-400/40 bg-white/[0.04]" : "border-white/5"
                }`}
              >
                <span className="hidden text-right text-xs tabular-nums text-zinc-600 md:block">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10">
                  <CoverImage src={song.coverUrl} alt={`${song.title} cover`} />
                  {isCurrent && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      {playing ? (
                        <Equalizer className="text-white" />
                      ) : (
                        <Pause size={16} className="text-white" />
                      )}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className={`truncate text-sm font-semibold ${
                      isCurrent ? "text-purple-300" : "text-white"
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {song.artist}
                  </p>
                </div>

                <div className="hidden min-w-0 md:block">
                  <p className="truncate text-sm text-zinc-400">
                    {song.album || "—"}
                  </p>
                </div>

                <div className="hidden md:block">
                  <Badge>{song.genre || "Unknown"}</Badge>
                </div>

                <div className="hidden text-sm tabular-nums text-zinc-400 md:block">
                  {formatDuration(song.duration)}
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    aria-label={
                      playing ? `Pause ${song.title}` : `Play ${song.title}`
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song, filtered);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
                  >
                    {playing ? (
                      <Pause size={17} className="fill-current" />
                    ) : (
                      <Play size={17} className="ml-0.5 fill-current" />
                    )}
                  </button>
                  <LikeButton songId={song.id} size={17} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
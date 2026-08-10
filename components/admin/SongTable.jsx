"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Search, Trash2, UploadCloud, X } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import EmptyState from "@/components/EmptyState";
import Badge from "@/components/ui/Badge";
import EditSongModal from "@/components/admin/EditSongModal";
import DeleteSongModal from "@/components/admin/DeleteSongModal";
import { formatDuration, formatDate } from "@/lib/utils";

export default function SongTable({ initialSongs }) {
  const router = useRouter();
  const [songs, setSongs] = useState(initialSongs);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((song) =>
      [song.title, song.artist, song.album, song.genre]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    );
  }, [songs, query]);

  function refresh() {
    router.refresh();
  }

  function handleSaved(updatedSong) {
    setSongs((prev) =>
      prev.map((s) => (s.id === updatedSong.id ? updatedSong : s))
    );
    setEditing(null);
    refresh();
  }

  function handleDeleted() {
    setSongs((prev) => prev.filter((s) => s.id !== deleting.id));
    setDeleting(null);
    refresh();
  }

  if (songs.length === 0) {
    return (
      <EmptyState
        title="No songs uploaded"
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
    );
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, genres..."
            aria-label="Search songs"
            className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pr-9 pl-9 text-sm text-white transition outline-none placeholder:text-zinc-500 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-500">
          {filtered.length} of {songs.length}{" "}
          {songs.length === 1 ? "song" : "songs"}
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={`No songs found for "${query}"`}
          description="Try a different search term."
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-3xl border border-white/5 bg-elevated shadow-lg md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5 text-[11px] tracking-widest text-zinc-500 uppercase">
                  <th className="px-4 py-3 font-semibold">Cover</th>
                  <th className="px-4 py-3 font-semibold">Song</th>
                  <th className="px-4 py-3 font-semibold">Album</th>
                  <th className="px-4 py-3 font-semibold">Genre</th>
                  <th className="px-4 py-3 font-semibold">Duration</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((song) => (
                  <tr
                    key={song.id}
                    className="transition hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <div className="relative h-11 w-11 overflow-hidden rounded-xl border border-white/10">
                        <CoverImage
                          src={song.coverUrl}
                          alt={`${song.title} cover`}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{song.title}</p>
                      <p className="text-xs text-zinc-400">{song.artist}</p>
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {song.album || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge>{song.genre || "Unknown"}</Badge>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-400">
                      {formatDuration(song.duration)}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {formatDate(song.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${song.title}`}
                          onClick={() => setEditing(song)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${song.title}`}
                          onClick={() => setDeleting(song)}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {filtered.map((song) => (
              <div
                key={song.id}
                className="rounded-2xl border border-white/5 bg-elevated p-4 shadow-lg transition hover:border-purple-400/20"
              >
                <div className="flex items-center gap-3">
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
                  <button
                    type="button"
                    aria-label={`Edit ${song.title}`}
                    onClick={() => setEditing(song)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${song.title}`}
                    onClick={() => setDeleting(song)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <Badge>{song.genre || "Unknown"}</Badge>
                  <span>{song.album || "Single"}</span>
                  <span>·</span>
                  <span>{formatDuration(song.duration)}</span>
                  <span>·</span>
                  <span>{formatDate(song.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {editing && (
        <EditSongModal
          song={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
      {deleting && (
        <DeleteSongModal
          song={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
"use client";

import Link from "next/link";
import { Play, Pause } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function ArtistCard({ song, artistSongs = [] }) {
  const { currentSong, isPlaying, playAt } = useMusicPlayer();
  const isCurrent = artistSongs.some(
    (s) => currentSong && currentSong.id === s.id
  );
  const playing = isCurrent && isPlaying;

  const href = `/discover?artist=${encodeURIComponent(song.artist)}`;

  return (
    <div className="group flex flex-col items-center rounded-2xl border border-transparent p-4 text-center transition duration-300 hover:border-white/10 hover:bg-white/5 hover:shadow-xl hover:shadow-purple-500/5 focus-within:border-white/10">
      <div className="relative mb-4">
        <Link
          href={href}
          aria-label={`Browse ${song.artist}`}
          className="block rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
        >
          <div
            className={`relative h-28 w-28 overflow-hidden rounded-full border border-white/10 shadow-xl transition duration-300 group-hover:scale-105 ${
              isCurrent
                ? "ring-2 ring-purple-400/60 ring-offset-4 ring-offset-elevated"
                : ""
            }`}
          >
            <CoverImage src={song.coverUrl} alt={`${song.artist} profile`} />
          </div>
        </Link>
        <button
          type="button"
          aria-label={`Play ${song.artist}'s music`}
          onClick={() => {
            if (artistSongs.length) playAt(artistSongs, 0);
          }}
          disabled={!artistSongs.length}
          className={`btn-gradient absolute right-0 bottom-0 flex h-11 w-11 translate-x-6 translate-y-1 items-center justify-center rounded-full text-white shadow-xl shadow-purple-500/40 transition duration-300 group-hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed ${
            artistSongs.length
              ? "sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
              : ""
          }`}
        >
          {playing ? (
            <Pause size={18} className="fill-current" />
          ) : (
            <Play size={18} className="ml-0.5 fill-current" />
          )}
        </button>
      </div>

      <Link
        href={href}
        className="max-w-full truncate rounded-full text-sm font-semibold text-white transition hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
      >
        {song.artist}
      </Link>
      <p className="mt-0.5 text-xs text-zinc-500">
        {artistSongs.length} {artistSongs.length === 1 ? "song" : "songs"} ·{" "}
        {song.genre || "Artist"}
      </p>
    </div>
  );
}
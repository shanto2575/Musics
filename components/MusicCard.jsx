"use client";

import { Play, Pause } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Equalizer from "@/components/Equalizer";
import LikeButton from "@/components/LikeButton";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatDuration } from "@/lib/utils";

export default function MusicCard({ song, compact = false, playlist }) {
  const { currentSong, isPlaying, playSong } = useMusicPlayer();
  const isCurrent = currentSong && currentSong.id === song.id;
  const playing = isCurrent && isPlaying;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title} by ${song.artist}`}
      onClick={() => playSong(song, playlist)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          playSong(song, playlist);
        }
      }}
      className={`group relative flex cursor-pointer flex-col rounded-2xl border bg-elevated p-3 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 ${
        isCurrent ? "border-purple-400/50" : "border-white/5"
      }`}
    >
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-xl bg-zinc-800">
        <CoverImage
          src={song.coverUrl}
          alt={`${song.title} cover art`}
          className="transition duration-500 group-hover:scale-105"
        />
        {!compact && (
          <span className="absolute top-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-white/90 backdrop-blur">
            {formatDuration(song.duration)}
          </span>
        )}
        {isCurrent && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
            <Equalizer active={isPlaying} className="text-purple-300" />
            {playing ? "Playing" : "Paused"}
          </div>
        )}
        <button
          type="button"
          aria-label={`Play ${song.title}`}
          onClick={(e) => {
            e.stopPropagation();
            playSong(song, playlist);
          }}
          className="absolute right-2 bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition duration-300 hover:scale-110 hover:shadow-purple-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          {playing ? (
            <Pause size={18} className="fill-current" />
          ) : (
            <Play size={18} className="ml-0.5 fill-current" />
          )}
        </button>
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3
            className={`truncate text-sm font-semibold text-white ${
              isCurrent ? "text-purple-300" : ""
            }`}
          >
            {song.title}
          </h3>
          <p className="truncate text-xs text-zinc-400">{song.artist}</p>
          {!compact && (
            <p className="mt-1 text-[11px] text-zinc-500">
              {song.album || "Single"} · {song.genre || "Music"}
            </p>
          )}
        </div>
        <LikeButton songId={song.id} size={16} />
      </div>
    </div>
  );
}
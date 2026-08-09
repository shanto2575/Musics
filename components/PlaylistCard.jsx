"use client";

import { Play, Pause } from "lucide-react";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function PlaylistCard({ playlist, songs }) {
  const { currentSong, isPlaying, playAt } = useMusicPlayer();
  const isCurrent = songs.some((song) => currentSong && currentSong.id === song.id);
  const playing = isCurrent && isPlaying;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-elevated p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:shadow-purple-500/10">
      <div
        className={`relative mb-4 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${playlist.gradient} shadow-inner`}
      >
        <span className="font-heading text-3xl font-bold text-white/80">
          {playlist.emoji || playlist.name.charAt(0)}
        </span>
        <button
          type="button"
          aria-label={`Play ${playlist.name}`}
          onClick={() => playAt(songs, 0)}
          className="btn-gradient absolute right-3 bottom-3 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full text-white opacity-0 shadow-xl transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-100"
        >
          {playing ? (
            <Pause size={20} className="fill-current" />
          ) : (
            <Play size={20} className="ml-0.5 fill-current" />
          )}
        </button>
      </div>
      <h3 className="text-base font-semibold text-white">{playlist.name}</h3>
      <p className="mt-1 text-sm text-zinc-400">{playlist.description}</p>
      <p className="mt-3 text-xs font-medium text-purple-300">
        {songs.length} {songs.length === 1 ? "song" : "songs"}
      </p>
    </div>
  );
}

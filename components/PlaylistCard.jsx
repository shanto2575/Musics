"use client";

import { Play, Pause } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

function Montage({ playlist, songs }) {
  const covers = songs.slice(0, 4);

  if (covers.length === 0) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${playlist.gradient}`}
      >
        <span className="font-heading text-4xl font-bold text-white/80">
          {playlist.name.charAt(0)}
        </span>
      </div>
    );
  }

  if (covers.length === 1) {
    return (
      <div className="relative h-full w-full">
        <CoverImage src={covers[0].coverUrl} alt={`${playlist.name} cover`} />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${playlist.gradient} opacity-40 mix-blend-multiply`}
        />
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5">
      {covers.map((song, i) => (
        <div key={song.id} className="relative overflow-hidden">
          <CoverImage
            src={song.coverUrl}
            alt={`${playlist.name} cover ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
}

export default function PlaylistCard({ playlist, songs }) {
  const { currentSong, isPlaying, playAt } = useMusicPlayer();
  const isCurrent = songs.some(
    (song) => currentSong && currentSong.id === song.id
  );
  const playing = isCurrent && isPlaying;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-elevated p-5 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-purple-400/40 hover:shadow-xl hover:shadow-purple-500/10">
      <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl shadow-inner">
        <Montage playlist={playlist} songs={songs} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
        />
        <span className="absolute top-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/90 uppercase backdrop-blur">
          {playlist.genre || "Mix"}
        </span>
        <button
          type="button"
          aria-label={`Play ${playlist.name}`}
          onClick={() => {
            if (songs.length) playAt(songs, 0);
          }}
          disabled={!songs.length}
          className="btn-gradient absolute right-3 bottom-3 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full text-white opacity-0 shadow-xl shadow-purple-500/40 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed sm:opacity-100"
        >
          {playing ? (
            <Pause size={20} className="fill-current" />
          ) : (
            <Play size={20} className="ml-0.5 fill-current" />
          )}
        </button>
      </div>
      <h3 className="text-base font-semibold text-white">{playlist.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
        {playlist.description}
      </p>
      <p className="mt-3 text-xs font-medium text-purple-300">
        {songs.length} {songs.length === 1 ? "song" : "songs"}
      </p>
    </div>
  );
}
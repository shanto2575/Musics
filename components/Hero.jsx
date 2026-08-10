"use client";

import { Play, Pause, Sparkles } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Equalizer from "@/components/Equalizer";
import MusicPlayerPanel from "@/components/MusicPlayerPanel";
import Button from "@/components/ui/Button";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

export default function Hero({ stats = null }) {
  const { currentSong, isPlaying, togglePlay } = useMusicPlayer();
  const isSongPlaying = isPlaying && Boolean(currentSong);

  const statItems = stats
    ? [
        { value: `${stats.songs || 0}+`, label: "Songs" },
        { value: `${stats.artists || 0}+`, label: "Artists" },
        { value: `${stats.genres || 0}`, label: "Genres" },
      ]
    : null;

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="animate-glow absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="animate-glow absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-pink-600/15 blur-3xl [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(75%_60%_at_50%_35%,black,transparent)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pt-16 pb-16 sm:px-6 lg:px-8 lg:pt-24 lg:pb-24">
        <div className="animate-fade-up mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-300">
            <Sparkles size={14} />
            Premium music streaming
          </span>
          <h1 className="font-heading mt-6 text-4xl leading-[1.05] font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Music that
            <br className="sm:hidden" />
            <span className="text-gradient"> moves with you</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-zinc-400 sm:text-base">
            Discover new sounds, create your vibe, and stream your favorite
            tracks from one beautifully simple place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/discover" size="lg">
              <Play size={16} className="fill-current" />
              Start listening
            </Button>
            <Button href="/playlists" variant="secondary" size="lg">
              Explore playlists
            </Button>
          </div>

          {statItems && (
            <dl className="mx-auto mt-10 flex max-w-md items-center justify-center gap-8 sm:gap-12">
              {statItems.map((item) => (
                <div key={item.label} className="text-center">
                  <dt className="sr-only">{item.label}</dt>
                  <dd className="font-heading text-2xl font-bold text-white sm:text-3xl">
                    {item.value}
                  </dd>
                  <p className="mt-1 text-[11px] tracking-wide text-zinc-500 uppercase">
                    {item.label}
                  </p>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-5xl items-center gap-12 lg:grid-cols-2 lg:gap-10 lg:mt-20">
          <div className="animate-fade-up">
            <MusicPlayerPanel />
          </div>

          <div className="animate-fade-up relative mx-auto w-full max-w-sm [animation-delay:150ms]">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-500/30 blur-2xl"
            />
            <div className="relative">
              <div
                className={`relative aspect-square overflow-hidden rounded-full border border-white/10 shadow-2xl shadow-purple-900/40 ${
                  isSongPlaying ? "animate-spin-slow" : ""
                }`}
              >
                <CoverImage
                  src={currentSong?.coverUrl}
                  alt={
                    currentSong
                      ? `${currentSong.title} by ${currentSong.artist}`
                      : "VibeFlow"
                  }
                  className="scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/30 to-transparent" />
              </div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white text-black shadow-xl">
                  <span className="font-heading text-lg font-bold">V</span>
                </div>
              </div>

              {currentSong ? (
                <button
                  type="button"
                  aria-label={
                    isSongPlaying
                      ? `Pause ${currentSong.title}`
                      : `Play ${currentSong.title}`
                  }
                  onClick={togglePlay}
                  className="btn-gradient absolute right-4 bottom-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl shadow-purple-500/40 transition duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {isSongPlaying ? (
                    <Pause size={24} className="fill-current" />
                  ) : (
                    <Play size={24} className="ml-0.5 fill-current" />
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-label="No song selected yet"
                  className="absolute right-4 bottom-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-700 text-zinc-400 shadow-xl"
                >
                  <Play size={24} className="ml-0.5 fill-current" />
                </button>
              )}

              {currentSong && (
                <div className="animate-pop absolute bottom-4 -left-2 max-w-[11rem] rounded-2xl border border-white/10 bg-black/60 p-3 shadow-xl backdrop-blur-xl sm:-left-6">
                  <div className="flex items-center gap-2.5">
                    <Equalizer active={isPlaying} className="text-purple-300" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {currentSong.title}
                      </p>
                      <p className="truncate text-xs text-zinc-400">
                        {currentSong.artist}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
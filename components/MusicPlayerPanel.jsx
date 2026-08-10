"use client";

import { useMemo } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Equalizer from "@/components/Equalizer";
import { useMusicPlayer } from "@/context/MusicPlayerContext";

const COL_COUNT = 30;
const ROWS = 18;
const BASELINE = 2;

const SHAPE = [
  0.3, 0.38, 0.33, 0.48, 0.42, 0.55, 0.47, 0.62, 0.72, 0.58,
  0.66, 0.52, 0.6, 0.46, 0.64, 0.76, 0.88, 0.8, 0.95, 0.7,
  0.6, 0.72, 0.55, 0.48, 0.42, 0.5, 0.38, 0.32, 0.26, 0.22,
];

function createRandom(seed = 7) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export default function MusicPlayerPanel() {
  const { currentSong, isPlaying, togglePlay, nextSong, previousSong } =
    useMusicPlayer();
  const active = isPlaying && Boolean(currentSong);
  const hasSong = Boolean(currentSong);

  const columns = useMemo(() => {
    const random = createRandom();
    return Array.from({ length: COL_COUNT }, (_, i) => {
      const shape = SHAPE[i % SHAPE.length];
      const peak = Math.min(1, Math.max(0.24, shape + random() * 0.14 - 0.07));
      return {
        min: BASELINE / ROWS,
        max: peak,
        duration: 0.55 + random() * 0.85,
        delay: -random() * 2.2,
      };
    });
  }, []);

  const state = active ? "active" : hasSong ? "idle" : "stopped";

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-tr from-purple-600/25 via-fuchsia-500/15 to-pink-500/25 blur-3xl"
      />

      <div className="viz-panel">
        <div className="p-4 sm:p-6">
          <div className="viz-grid [--viz-size:5px] sm:[--viz-size:6px] lg:[--viz-size:8px]">
            {columns.map((col, i) => (
              <div
                key={i}
                className={`viz-column ${state}`}
                style={{
                  "--col-min": col.min,
                  "--col-max": col.max,
                  "--col-duration": `${col.duration}s`,
                  "--col-delay": `${col.delay}s`,
                }}
              >
                {Array.from({ length: ROWS }, (_, row) => (
                  <span
                    key={row}
                    className="viz-block"
                    style={{ "--threshold": row / ROWS }}
                  />
                ))}
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />

          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-purple-900/30">
              <CoverImage
                src={currentSong?.coverUrl}
                alt={currentSong ? `${currentSong.title} cover` : "VibeFlow"}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {currentSong?.title ?? "Nothing playing"}
              </p>
              <p className="truncate text-xs text-zinc-400">
                {currentSong?.artist ?? "Select a song to start the vibe"}
              </p>
            </div>
            {active && <Equalizer active className="shrink-0 text-purple-400" />}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Previous song"
              onClick={previousSong}
              disabled={!hasSong}
              className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipBack size={22} className="fill-current" />
            </button>

            <button
              type="button"
              aria-label={active ? "Pause current song" : "Play current song"}
              onClick={togglePlay}
              disabled={!hasSong}
              className="btn-gradient flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl shadow-purple-500/50 ring-1 ring-white/20 transition duration-300 hover:scale-110 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-16 sm:w-16"
            >
              {active ? (
                <Pause size={28} className="fill-current" />
              ) : (
                <Play size={28} className="ml-0.5 fill-current" />
              )}
            </button>

            <button
              type="button"
              aria-label="Next song"
              onClick={nextSong}
              disabled={!hasSong}
              className="flex h-11 w-11 items-center justify-center rounded-full text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipForward size={22} className="fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

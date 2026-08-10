"use client";

import { useMemo } from "react";
import { Pause, Play } from "lucide-react";
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

export default function MusicVisualizer() {
  const { currentSong, isPlaying, togglePlay } = useMusicPlayer();
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
      <button
        type="button"
        onClick={hasSong ? togglePlay : undefined}
        disabled={!hasSong}
        aria-label={
          active
            ? "Pause current song"
            : hasSong
              ? "Play current song"
              : "Select a song to play"
        }
        className="group relative block w-full rounded-[2rem] outline-none transition focus-visible:ring-2 focus-visible:ring-purple-400/70"
      >
        <div className="viz-panel">
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
        </div>

        {hasSong && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-xl shadow-purple-900/40 backdrop-blur-xl transition duration-300 group-hover:scale-110 group-hover:border-purple-400/50 group-hover:bg-white group-hover:text-black group-active:scale-95">
              {active ? (
                <Pause size={24} className="fill-current" />
              ) : (
                <Play size={24} className="ml-0.5 fill-current" />
              )}
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

"use client";

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
} from "lucide-react";
import CoverImage from "@/components/CoverImage";
import Equalizer from "@/components/Equalizer";
import Slider from "@/components/Slider";
import LikeButton from "@/components/LikeButton";
import { useMusicPlayer } from "@/context/MusicPlayerContext";
import { formatDuration } from "@/lib/utils";

export default function MusicPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    muted,
    togglePlay,
    nextSong,
    previousSong,
    seek,
    changeVolume,
    toggleMute,
  } = useMusicPlayer();

  if (!currentSong) return null;

  const maxTime = duration || currentSong.duration || 0;
  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto w-full max-w-7xl px-3 pb-3 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface/90 shadow-[0_-12px_48px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent"
          />

          <div className="flex items-center gap-3 px-3 pt-2.5 sm:px-5">
            <span className="min-w-0 flex-1 text-right text-[11px] tabular-nums text-zinc-500">
              {formatDuration(currentTime)}
            </span>
            <Slider
              value={currentTime}
              min={0}
              max={maxTime || 1}
              onChange={seek}
              ariaLabel="Seek"
              className="w-full flex-[3]"
            />
            <span className="min-w-0 flex-1 text-[11px] tabular-nums text-zinc-500">
              {formatDuration(maxTime)}
            </span>
          </div>

          <div className="mx-auto flex h-16 max-w-full items-center gap-3 px-3 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-black/40">
                <CoverImage
                  src={currentSong.coverUrl}
                  alt={`${currentSong.title} cover`}
                />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-white">
                  {isPlaying && <Equalizer className="text-purple-400" />}
                  {currentSong.title}
                </p>
                <p className="truncate text-xs text-zinc-400">
                  {currentSong.artist}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                aria-label="Previous song"
                onClick={previousSong}
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
              >
                <SkipBack size={19} className="fill-current" />
              </button>
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlay}
                className="btn-gradient flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg shadow-purple-500/30 transition hover:scale-105 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {isPlaying ? (
                  <Pause size={20} className="fill-current" />
                ) : (
                  <Play size={20} className="ml-0.5 fill-current" />
                )}
              </button>
              <button
                type="button"
                aria-label="Next song"
                onClick={nextSong}
                className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
              >
                <SkipForward size={19} className="fill-current" />
              </button>
            </div>

            <div className="hidden flex-1 items-center justify-end gap-3 md:flex lg:gap-4">
              <LikeButton songId={currentSong.id} size={18} />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={muted ? "Unmute" : "Mute"}
                  onClick={toggleMute}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
                >
                  <VolumeIcon size={19} />
                </button>
                <Slider
                  value={muted ? 0 : volume}
                  min={0}
                  max={1}
                  onChange={changeVolume}
                  ariaLabel="Volume"
                  className="w-20 lg:w-28"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
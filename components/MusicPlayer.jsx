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
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="border-t border-white/10 bg-background/90 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="px-3 pt-1 sm:px-4">
          <Slider
            value={currentTime}
            min={0}
            max={maxTime || 1}
            onChange={seek}
            ariaLabel="Seek"
            className="w-full"
          />
        </div>

        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-3 pb-2 sm:px-6 sm:gap-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Previous song"
              onClick={previousSong}
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
            >
              <SkipBack size={20} className="fill-current" />
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
              <SkipForward size={20} className="fill-current" />
            </button>
          </div>

          <div className="hidden flex-1 items-center justify-end gap-4 md:flex lg:gap-5">
            <span className="min-w-[4.5rem] text-right text-[11px] tabular-nums text-zinc-400">
              {formatDuration(currentTime)} / {formatDuration(maxTime)}
            </span>
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
                className="w-24 lg:w-28"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Heart } from "lucide-react";
import { useLikes } from "@/hooks/useLikes";

export default function LikeButton({ songId, size = 18 }) {
  const { liked, toggleLike } = useLikes();
  const isLiked = Boolean(liked[songId]);

  return (
    <button
      type="button"
      aria-label={isLiked ? "Unlike song" : "Like song"}
      aria-pressed={isLiked}
      onClick={(e) => {
        e.stopPropagation();
        toggleLike(songId);
      }}
      className="rounded-full p-1.5 text-zinc-400 transition hover:text-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400/70"
    >
      <Heart
        size={size}
        className={isLiked ? "fill-pink-500 text-pink-500" : ""}
      />
    </button>
  );
}

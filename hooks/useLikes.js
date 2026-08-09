"use client";

import { useCallback, useState } from "react";

const STORAGE_KEY = "vibeflow-likes";

let cachedLikes = null;

function readLikes() {
  if (cachedLikes) return cachedLikes;
  try {
    cachedLikes =
      typeof window === "undefined"
        ? {}
        : JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    cachedLikes = {};
  }
  return cachedLikes;
}

export function useLikes() {
  const [liked, setLiked] = useState(readLikes);

  const toggleLike = useCallback((id) => {
    setLiked((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore storage errors */
      }
      cachedLikes = next;
      return next;
    });
  }, []);

  return { liked, toggleLike };
}

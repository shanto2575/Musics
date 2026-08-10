"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "vibeflow-likes";

const emptyLikes = {};

let cachedRaw = null;
let cachedLikes = emptyLikes;
const listeners = new Set();

function readLikes() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedLikes = raw ? JSON.parse(raw) : emptyLikes;
    }
  } catch {
    cachedLikes = emptyLikes;
  }
  return cachedLikes;
}

function getServerSnapshot() {
  return emptyLikes;
}

function emitChange() {
  for (const listener of listeners) listener();
}

function onStorage(event) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  readLikes();
  emitChange();
}

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useLikes() {
  const liked = useSyncExternalStore(subscribe, readLikes, getServerSnapshot);

  const toggleLike = useCallback((id) => {
    const current = readLikes();
    const next = { ...current };
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
    emitChange();
  }, []);

  return { liked, toggleLike };
}

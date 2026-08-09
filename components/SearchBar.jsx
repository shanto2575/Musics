"use client";

import { Search, X } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search songs, artists, albums, genres...",
}) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search music"
        className="w-full rounded-full border border-white/10 bg-white/5 py-3 pr-10 pl-10 text-sm text-white placeholder-zinc-500 transition outline-none focus:border-purple-400/50 focus:bg-white/[0.07] focus:ring-2 focus:ring-purple-400/20"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

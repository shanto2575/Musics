"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LibrarySection from "@/components/LibrarySection";

export default function MusicLibrary({ initialQuery = "" }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28">
        <div className="relative overflow-hidden border-b border-white/5">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="animate-glow absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-purple-600/15 blur-3xl" />
            <div className="absolute -right-20 -bottom-32 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />
          </div>
          <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
              Discover
            </p>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Find your next <span className="text-gradient">favorite track</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
              Search the library, browse by genre, and press play — the vibe
              follows you everywhere.
            </p>
          </div>
        </div>
        <div className="pt-12">
          <LibrarySection initialQuery={initialQuery} layout="grid" hideHeading />
        </div>
      </main>
      <Footer />
    </>
  );
}
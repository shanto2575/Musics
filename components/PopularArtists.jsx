import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import CoverImage from "@/components/CoverImage";
import EmptyState from "@/components/EmptyState";
import { uniqueArtists } from "@/lib/utils";

export default function PopularArtists({ songs }) {
  const artists = uniqueArtists(songs).slice(0, 6);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Creators"
        title="Popular Artists"
        description="The artists behind the sounds in your library."
        action={
          <Link
            href="/artists"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 transition hover:text-purple-300"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        }
      />

      {artists.length === 0 ? (
        <EmptyState
          title="No artists yet"
          description="Artists appear here once songs are uploaded."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {artists.map((song) => (
            <Link
              key={song.id}
              href={`/discover?artist=${encodeURIComponent(song.artist)}`}
              className="group flex flex-col items-center rounded-2xl border border-transparent p-4 text-center transition duration-300 hover:border-white/10 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
            >
              <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border border-white/10 shadow-lg transition duration-300 group-hover:scale-105">
                <CoverImage
                  src={song.coverUrl}
                  alt={`${song.artist} profile`}
                />
              </div>
              <h3 className="truncate text-sm font-semibold text-white">
                {song.artist}
              </h3>
              <p className="text-xs text-zinc-500">
                {song.genre || "Artist"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

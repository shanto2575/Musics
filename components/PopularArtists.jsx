import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import ArtistCard from "@/components/ArtistCard";
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
            className="inline-flex items-center gap-1.5 rounded-full text-sm font-medium text-purple-400 transition hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
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
          {artists.map((song) => {
            const artistSongs = songs.filter(
              (s) => s.artist.toLowerCase() === song.artist.toLowerCase()
            );
            return (
              <ArtistCard
                key={song.id}
                song={song}
                artistSongs={artistSongs}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
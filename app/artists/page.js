import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import CoverImage from "@/components/CoverImage";
import EmptyState from "@/components/EmptyState";
import Link from "next/link";
import { getAllSongs } from "@/lib/songs";
import { uniqueArtists } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ArtistsPage() {
  let songs = [];
  try {
    songs = await getAllSongs();
  } catch (error) {
    console.error("Failed to load artists:", error);
  }

  const artists = uniqueArtists(songs);
  const sorted = [...artists].sort((a, b) =>
    a.artist.localeCompare(b.artist)
  );

  return (
    <>
      <Navbar />
      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Creators"
          title="Artists"
          description="Every artist in the VibeFlow library."
        />

        {sorted.length === 0 ? (
          <EmptyState
            title="No artists yet"
            description="Artists appear here once songs are uploaded."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {sorted.map((song) => {
              const artistSongs = songs.filter(
                (s) => s.artist.toLowerCase() === song.artist.toLowerCase()
              );
              return (
                <Link
                  key={song.id}
                  href={`/discover?artist=${encodeURIComponent(song.artist)}`}
                  className="group flex flex-col items-center rounded-3xl border border-white/5 bg-elevated p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-purple-400/30 hover:shadow-purple-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
                >
                  <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border border-white/10 shadow-xl transition duration-300 group-hover:scale-105">
                    <CoverImage
                      src={song.coverUrl}
                      alt={`${song.artist} profile`}
                    />
                  </div>
                  <h2 className="truncate text-base font-semibold text-white">
                    {song.artist}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {artistSongs.length}{" "}
                    {artistSongs.length === 1 ? "song" : "songs"}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

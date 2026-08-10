import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ArtistCard from "@/components/ArtistCard";
import EmptyState from "@/components/EmptyState";
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
      <Footer />
    </>
  );
}
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import PlaylistCard from "@/components/PlaylistCard";
import EmptyState from "@/components/EmptyState";
import { getAllSongs } from "@/lib/songs";
import { SAMPLE_PLAYLISTS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function PlaylistsPage() {
  let songs = [];
  try {
    songs = await getAllSongs();
  } catch (error) {
    console.error("Failed to load playlists:", error);
  }

  const playlists = SAMPLE_PLAYLISTS.map((playlist) => {
    const matches = playlist.genre
      ? songs.filter(
          (song) =>
            song.genre.toLowerCase() === playlist.genre.toLowerCase()
        )
      : songs;
    return { ...playlist, songs: matches };
  });

  return (
    <>
      <Navbar />
      <section className="mx-auto w-full max-w-7xl flex-1 px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Curated"
          title="Playlists"
          description="Ready-made mixes for every mood."
        />

        {playlists.every((p) => p.songs.length === 0) ? (
          <EmptyState
            title="No playlists available"
            description="Playlists appear here once matching songs are uploaded."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.name}
                playlist={playlist}
                songs={playlist.songs}
              />
            ))}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

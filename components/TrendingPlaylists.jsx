import SectionHeading from "@/components/SectionHeading";
import PlaylistCard from "@/components/PlaylistCard";
import EmptyState from "@/components/EmptyState";
import { SAMPLE_PLAYLISTS } from "@/lib/seed-data";

export default function TrendingPlaylists({ songs }) {
  const playlists = SAMPLE_PLAYLISTS.map((playlist) => {
    const matches = playlist.genre
      ? songs.filter(
          (song) => song.genre.toLowerCase() === playlist.genre.toLowerCase()
        )
      : songs;
    return { ...playlist, songs: matches };
  });

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Curated"
        title="Trending Playlists"
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
  );
}

import { ListMusic } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import { getAllSongs, isDatabaseConfigured } from "@/lib/songs";
import { SAMPLE_PLAYLISTS } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

export default async function AdminPlaylistsPage() {
  const configured = isDatabaseConfigured();
  let songs = [];
  if (configured) {
    try {
      songs = await getAllSongs();
    } catch (error) {
      console.error("Failed to load playlists for admin:", error);
    }
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
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
          Library
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Playlists
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Playlists are auto-generated from song genres.
        </p>
      </div>

      {playlists.every((p) => p.songs.length === 0) ? (
        <EmptyState
          title="No playlists available"
          description="Upload songs that match a playlist genre to populate them."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.map((playlist) => (
            <div
              key={playlist.name}
              className="overflow-hidden rounded-3xl border border-white/5 bg-elevated"
            >
              <div
                className={`flex h-32 items-center justify-center bg-gradient-to-br ${playlist.gradient}`}
              >
                <span className="font-heading text-2xl font-bold text-white/80">
                  {playlist.name}
                </span>
              </div>
              <div className="p-5">
                <p className="text-sm text-zinc-400">{playlist.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-medium text-purple-300">
                    <ListMusic size={15} />
                    {playlist.songs.length}{" "}
                    {playlist.songs.length === 1 ? "song" : "songs"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {playlist.genre} genre
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

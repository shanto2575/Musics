import { Users } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import CoverImage from "@/components/CoverImage";
import { getAllSongs, isDatabaseConfigured } from "@/lib/songs";
import { uniqueArtists } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminArtistsPage() {
  const configured = isDatabaseConfigured();
  let songs = [];
  if (configured) {
    try {
      songs = await getAllSongs();
    } catch (error) {
      console.error("Failed to load artists for admin:", error);
    }
  }

  const artists = uniqueArtists(songs);

  return (
    <>
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
          Library
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Artists
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Artists derived from your library.
        </p>
      </div>

      {artists.length === 0 ? (
        <EmptyState
          title="No artists yet"
          description="Artists appear here once songs are uploaded."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {artists.map((song) => {
            const artistSongs = songs.filter(
              (s) => s.artist.toLowerCase() === song.artist.toLowerCase()
            );
            return (
              <div
                key={song.id}
                className="flex items-center gap-4 rounded-3xl border border-white/5 bg-elevated p-4 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/30 hover:shadow-lg hover:shadow-purple-500/10"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10 shadow-md">
                  <CoverImage src={song.coverUrl} alt={`${song.artist} profile`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {song.artist}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {artistSongs.length}{" "}
                    {artistSongs.length === 1 ? "song" : "songs"}
                  </p>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 text-purple-300">
                  <Users size={16} />
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

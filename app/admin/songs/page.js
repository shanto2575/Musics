import Link from "next/link";
import { UploadCloud, Music } from "lucide-react";
import SongTable from "@/components/admin/SongTable";
import { getAllSongs, isDatabaseConfigured } from "@/lib/songs";

export const dynamic = "force-dynamic";

export default async function AdminSongsPage() {
  const configured = isDatabaseConfigured();
  let songs = [];
  if (configured) {
    try {
      songs = await getAllSongs();
    } catch (error) {
      console.error("Failed to load songs for admin:", error);
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
            Library
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Songs
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage the songs in your library.
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="btn-gradient inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
        >
          <UploadCloud size={16} />
          Upload Song
        </Link>
      </div>

      {!configured ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-elevated/50 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
            <Music size={26} />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Database not connected
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            Add your <code className="rounded bg-white/5 px-1">MONGODB_URI</code> to{" "}
            <code className="rounded bg-white/5 px-1">.env.local</code> to start
            managing songs.
          </p>
        </div>
      ) : (
        <SongTable initialSongs={songs} />
      )}
    </>
  );
}

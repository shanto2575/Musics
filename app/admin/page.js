import Link from "next/link";
import { Music, Users, Tags, ArrowRight, AlertTriangle } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import CoverImage from "@/components/CoverImage";
import EmptyState from "@/components/EmptyState";
import { getDashboardStats, isDatabaseConfigured } from "@/lib/songs";
import { formatDuration, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const configured = isDatabaseConfigured();

  let data = null;
  if (configured) {
    try {
      data = await getDashboardStats();
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }

  const songs = data?.songs || [];
  const stats = data?.stats || { totalSongs: 0, totalArtists: 0, totalGenres: 0 };
  const recent = songs.slice(0, 6);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Overview of your VibeFlow library.
        </p>
      </div>

      {!configured && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">MongoDB is not configured</p>
            <p className="mt-1 text-amber-200/80">
              Add your <code className="rounded bg-amber-400/10 px-1">MONGODB_URI</code> to{" "}
              <code className="rounded bg-amber-400/10 px-1">.env.local</code> to store songs.
              See Settings for more details.
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Music}
          label="Total Songs"
          value={stats.totalSongs}
          accent="bg-purple-500/10 text-purple-300"
        />
        <StatCard
          icon={Users}
          label="Total Artists"
          value={stats.totalArtists}
          accent="bg-pink-500/10 text-pink-300"
        />
        <StatCard
          icon={Tags}
          label="Total Genres"
          value={stats.totalGenres}
          accent="bg-fuchsia-500/10 text-fuchsia-300"
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Recent Uploads</h2>
        <Link
          href="/admin/songs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 transition hover:text-purple-300"
        >
          Manage songs
          <ArrowRight size={16} />
        </Link>
      </div>

      {songs.length === 0 ? (
        <EmptyState
          title="No songs uploaded yet"
          description="Upload your first song to start building your library."
          action={
            <Link
              href="/admin/upload"
              className="btn-gradient inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110"
            >
              Upload a song
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/5 bg-elevated">
          <ul className="divide-y divide-white/5">
            {recent.map((song) => (
              <li
                key={song.id}
                className="flex items-center gap-4 px-4 py-3 transition hover:bg-white/[0.03]"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <CoverImage src={song.coverUrl} alt={`${song.title} cover`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {song.title}
                  </p>
                  <p className="truncate text-xs text-zinc-400">{song.artist}</p>
                </div>
                <span className="hidden rounded-full border border-purple-400/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-medium text-purple-300 sm:inline-block">
                  {song.genre || "Unknown"}
                </span>
                <span className="hidden text-sm tabular-nums text-zinc-400 md:block">
                  {formatDuration(song.duration)}
                </span>
                <span className="hidden w-24 text-right text-xs text-zinc-500 lg:block">
                  {formatDate(song.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

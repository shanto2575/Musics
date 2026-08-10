import Link from "next/link";
import { Music, Users, Tags, UploadCloud, AlertTriangle } from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import DashboardOverview from "@/components/admin/DashboardOverview";
import { getDashboardStats, isDatabaseConfigured } from "@/lib/songs";

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
  const stats = data?.stats || {
    totalSongs: 0,
    totalArtists: 0,
    totalGenres: 0,
  };

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
            Overview
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Everything happening in your VibeFlow library.
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

      {!configured && (
        <div className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">MongoDB is not configured</p>
            <p className="mt-1 text-amber-200/80">
              Add your{" "}
              <code className="rounded bg-amber-400/10 px-1">MONGODB_URI</code>{" "}
              to{" "}
              <code className="rounded bg-amber-400/10 px-1">.env.local</code>{" "}
              to store songs. See Settings for more details.
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

      <DashboardOverview songs={songs} />
    </>
  );
}
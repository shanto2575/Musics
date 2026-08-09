import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import MusicCard from "@/components/MusicCard";
import EmptyState from "@/components/EmptyState";

export default function FeaturedTracks({ songs }) {
  const featured = songs.slice(0, 6);

  return (
    <section id="featured" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Top picks"
        title="Featured Tracks"
        description="Hand-picked tracks from the VibeFlow library to get you started."
        action={
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-400 transition hover:text-purple-300"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        }
      />

      {featured.length === 0 ? (
        <EmptyState
          title="No songs yet"
          description="Upload your first song to start building your library."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((song) => (
            <MusicCard key={song.id} song={song} playlist={songs} />
          ))}
        </div>
      )}
    </section>
  );
}

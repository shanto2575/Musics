import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedTracks from "@/components/FeaturedTracks";
import PopularArtists from "@/components/PopularArtists";
import TrendingPlaylists from "@/components/TrendingPlaylists";
import LibrarySection from "@/components/LibrarySection";
import Footer from "@/components/Footer";
import { getAllSongs } from "@/lib/songs";
import { countUniqueGenres, uniqueArtists } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let songs = [];
  try {
    songs = await getAllSongs();
  } catch (error) {
    console.error("Failed to load songs on home page:", error);
  }

  const heroStats = {
    songs: songs.length,
    artists: uniqueArtists(songs).length,
    genres: countUniqueGenres(songs),
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28">
        <Hero stats={heroStats} />
        <FeaturedTracks songs={songs} />
        <PopularArtists songs={songs} />
        <TrendingPlaylists songs={songs} />
        <LibrarySection embedded />
      </main>
      <Footer />
    </>
  );
}

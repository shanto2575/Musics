"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LibrarySection from "@/components/LibrarySection";

export default function MusicLibrary({ initialQuery = "" }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pb-28">
        <LibrarySection initialQuery={initialQuery} />
      </main>
      <Footer />
    </>
  );
}

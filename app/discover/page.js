import MusicLibrary from "@/components/MusicLibrary";

export const dynamic = "force-dynamic";

export default async function DiscoverPage({ searchParams }) {
  const params = await searchParams;
  const initialQuery = params?.artist || params?.q || "";

  return (
    <main className="flex-1 pb-28">
      <MusicLibrary initialQuery={initialQuery} />
    </main>
  );
}

import { NextResponse } from "next/server";
import Song from "@/models/Song";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeSong, serializeSongs } from "@/lib/utils";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const songs = await Song.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ songs: serializeSongs(songs) });
  } catch (error) {
    console.error("GET /api/songs failed:", error);
    return NextResponse.json(
      { error: "Failed to load songs. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    const body = await request.json();

    const title = String(body.title || "").trim();
    const artist = String(body.artist || "").trim();
    const genre = String(body.genre || "").trim();
    const album = String(body.album || "").trim();
    const audioUrl = String(body.audioUrl || "").trim();

    if (!title || !artist || !genre || !audioUrl) {
      return NextResponse.json(
        { error: "Title, artist, genre, and audio URL are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      audioUrl,
      coverUrl: String(body.coverUrl || "").trim(),
      duration: Number(body.duration) || 0,
      audioPublicId: String(body.audioPublicId || "").trim(),
      coverPublicId: String(body.coverPublicId || "").trim(),
    });

    return NextResponse.json({ song: serializeSong(song) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/songs failed:", error);
    return NextResponse.json(
      { error: "Failed to save song. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import Song from "@/models/Song";
import { connectToDatabase } from "@/lib/mongodb";
import { SEED_SONGS } from "@/lib/seed-data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    await connectToDatabase();

    const existing = await Song.countDocuments();
    if (existing > 0) {
      return NextResponse.json(
        { error: "Songs already exist. Seed aborted." },
        { status: 409 }
      );
    }

    const created = await Song.insertMany(SEED_SONGS);
    return NextResponse.json({ seeded: created.length });
  } catch (error) {
    console.error("POST /api/seed failed:", error);
    return NextResponse.json(
      { error: "Seeding failed. Is MongoDB configured?" },
      { status: 500 }
    );
  }
}

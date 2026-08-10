import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Song from "@/models/Song";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeSong } from "@/lib/utils";
import { deleteCloudinaryAssets } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function errorResponse(message, status) {
  return NextResponse.json(
    { success: false, message, error: message },
    { status }
  );
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!isValidId(id)) {
      return errorResponse("Invalid song id.", 400);
    }

    await connectToDatabase();
    const song = await Song.findById(id).lean();
    if (!song) {
      return errorResponse("Song not found.", 404);
    }

    return NextResponse.json({ success: true, song: serializeSong(song) });
  } catch (error) {
    console.error("GET /api/songs/[id] failed:", error);
    return errorResponse("Failed to load song. Please try again.", 500);
  }
}

export async function PATCH(request, { params }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    const { id } = await params;
    if (!isValidId(id)) {
      return errorResponse("Invalid song id.", 400);
    }

    const body = await request.json();

    const updates = {};
    for (const field of ["title", "artist", "album", "genre"]) {
      if (body[field] !== undefined) {
        const value = String(body[field]).trim();
        if (field === "title" && !value) {
          return errorResponse("Song title is required.", 400);
        }
        if (field === "artist" && !value) {
          return errorResponse("Artist name is required.", 400);
        }
        updates[field] = value;
      }
    }

    for (const field of [
      "audioUrl",
      "coverUrl",
      "audioPublicId",
      "coverPublicId",
      "duration",
    ]) {
      if (body[field] !== undefined) {
        updates[field] =
          field === "duration" ? Number(body[field]) || 0 : String(body[field]).trim();
      }
    }

    await connectToDatabase();
    const song = await Song.findById(id);
    if (!song) {
      return errorResponse("Song not found.", 404);
    }

    const previous = {
      audioPublicId: song.audioPublicId,
      coverPublicId: song.coverPublicId,
    };

    Object.assign(song, updates);
    await song.save();

    if (updates.audioUrl || updates.coverUrl) {
      await deleteCloudinaryAssets([
        updates.audioUrl && previous.audioPublicId
          ? { publicId: previous.audioPublicId, resourceType: "video" }
          : null,
        updates.coverUrl && previous.coverPublicId
          ? { publicId: previous.coverPublicId, resourceType: "image" }
          : null,
      ].filter(Boolean));
    }

    return NextResponse.json({ success: true, song: serializeSong(song) });
  } catch (error) {
    console.error("PATCH /api/songs/[id] failed:", error);
    return errorResponse("Failed to update song. Please try again.", 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const guard = await requireAdmin(request);
    if (guard.error) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    const { id } = await params;
    if (!isValidId(id)) {
      return errorResponse("Invalid song id.", 400);
    }

    await connectToDatabase();
    const song = await Song.findById(id);
    if (!song) {
      return errorResponse("Song not found.", 404);
    }

    await Song.deleteOne({ _id: id });

    await deleteCloudinaryAssets([
      song.audioPublicId ? { publicId: song.audioPublicId, resourceType: "video" } : null,
      song.coverPublicId ? { publicId: song.coverPublicId, resourceType: "image" } : null,
    ].filter(Boolean));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/songs/[id] failed:", error);
    return errorResponse("Failed to delete song. Please try again.", 500);
  }
}

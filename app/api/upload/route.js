import { NextResponse } from "next/server";
import { cloudinaryReady, uploadToCloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB

const AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
  "audio/oga",
]);

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

function guessAudioType(name) {
  const ext = (name || "").toLowerCase().split(".").pop();
  if (["mp3", "mpeg"].includes(ext)) return "audio/mpeg";
  if (["wav"].includes(ext)) return "audio/wav";
  if (["m4a", "mp4", "aac"].includes(ext)) return "audio/mp4";
  if (["ogg", "oga"].includes(ext)) return "audio/ogg";
  return null;
}

function guessImageType(name) {
  const ext = (name || "").toLowerCase().split(".").pop();
  if (["jpg", "jpeg"].includes(ext)) return "image/jpeg";
  if (["png"].includes(ext)) return "image/png";
  if (["webp"].includes(ext)) return "image/webp";
  return null;
}

function errorResponse(message, status) {
  return NextResponse.json(
    { success: false, message, error: message },
    { status }
  );
}

export async function POST(request) {
  if (!cloudinaryReady) {
    return errorResponse(
      "Uploads are unavailable right now. Please try again later.",
      503
    );
  }

  try {
    const guard = await requireAdmin(request);
    if (guard.error) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return errorResponse("Please select an audio file and cover image.", 400);
    }
    const audio = formData.get("audio");
    const cover = formData.get("cover");

    if (!audio || !cover) {
      return errorResponse("Please select an audio file and cover image.", 400);
    }

    const audioType = AUDIO_TYPES.has(audio.type)
      ? audio.type
      : guessAudioType(audio.name);
    const coverType = IMAGE_TYPES.has(cover.type)
      ? cover.type
      : guessImageType(cover.name);

    if (!audioType) {
      return errorResponse(
        "Invalid audio format. Please upload an MP3, WAV, M4A, or OGG file.",
        400
      );
    }

    if (!coverType) {
      return errorResponse(
        "Invalid image format. Please upload a JPG, PNG, or WebP file.",
        400
      );
    }

    if (audio.size > MAX_AUDIO_SIZE) {
      return errorResponse("Audio file is too large. Maximum size is 25MB.", 400);
    }

    if (cover.size > MAX_IMAGE_SIZE) {
      return errorResponse("Cover image is too large. Maximum size is 8MB.", 400);
    }

    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    const coverBuffer = Buffer.from(await cover.arrayBuffer());

    const timestamp = Date.now();

    const audioResult = await uploadToCloudinary(audioBuffer, {
      resourceType: "video",
      folder: "vibeflow/audio",
      public_id: `song-${timestamp}`,
    });

    const coverResult = await uploadToCloudinary(coverBuffer, {
      resourceType: "image",
      folder: "vibeflow/covers",
      public_id: `cover-${timestamp}`,
    });

    return NextResponse.json({
      success: true,
      audioUrl: audioResult.secure_url,
      coverUrl: coverResult.secure_url,
      audioPublicId: audioResult.public_id,
      coverPublicId: coverResult.public_id,
      duration: Number(audioResult.duration) || 0,
    });
  } catch (error) {
    console.error("POST /api/upload failed:", error);
    return errorResponse("Upload failed. Please try again.", 500);
  }
}

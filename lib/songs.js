import Song from "@/models/Song";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeSong, serializeSongs } from "@/lib/utils";

export async function getAllSongs() {
  await connectToDatabase();
  const songs = await Song.find().sort({ createdAt: -1 }).lean();
  return serializeSongs(songs);
}

export async function getSongById(id) {
  await connectToDatabase();
  const song = await Song.findById(id).lean();
  return song ? serializeSong(song) : null;
}

export async function getDashboardStats() {
  await connectToDatabase();
  const songs = await Song.find().sort({ createdAt: -1 }).lean();
  const serialized = serializeSongs(songs);

  const artists = new Set(
    serialized.map((song) => song.artist.toLowerCase()).filter(Boolean)
  ).size;
  const genres = new Set(
    serialized.map((song) => song.genre.toLowerCase()).filter(Boolean)
  ).size;

  return {
    songs: serialized,
    stats: {
      totalSongs: serialized.length,
      totalArtists: artists,
      totalGenres: genres,
    },
  };
}

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

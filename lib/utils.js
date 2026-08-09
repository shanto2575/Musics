export function formatDuration(seconds) {
  if (!seconds || Number.isNaN(Number(seconds)) || Number(seconds) <= 0) {
    return "0:00";
  }

  const total = Math.floor(Number(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatDate(date) {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function serializeSong(song) {
  return {
    id: song._id.toString(),
    title: song.title,
    artist: song.artist,
    album: song.album || "",
    genre: song.genre || "",
    audioUrl: song.audioUrl,
    coverUrl: song.coverUrl || "",
    duration: song.duration || 0,
    audioPublicId: song.audioPublicId || "",
    coverPublicId: song.coverPublicId || "",
    createdAt: song.createdAt ? song.createdAt.toISOString() : "",
    updatedAt: song.updatedAt ? song.updatedAt.toISOString() : "",
  };
}

export function serializeSongs(songs) {
  return songs.map(serializeSong);
}

export function uniqueArtists(songs) {
  const seen = new Set();
  return songs.filter((song) => {
    const key = song.artist.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function countUniqueGenres(songs) {
  return new Set(songs.map((song) => song.genre?.toLowerCase()).filter(Boolean))
    .size;
}

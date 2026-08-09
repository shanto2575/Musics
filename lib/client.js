export async function fetchSongs() {
  const res = await fetch("/api/songs", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load songs.");
  }
  const data = await res.json();
  return data.songs || [];
}

export async function uploadFiles(audio, cover) {
  const formData = new FormData();
  formData.append("audio", audio);
  formData.append("cover", cover);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Upload failed. Please try again.");
  }
  return data;
}

export async function createSong(payload) {
  const res = await fetch("/api/songs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to save song.");
  }
  return data.song;
}

export async function updateSong(id, payload) {
  const res = await fetch(`/api/songs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update song.");
  }
  return data.song;
}

export async function deleteSong(id) {
  const res = await fetch(`/api/songs/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete song.");
  }
  return data;
}

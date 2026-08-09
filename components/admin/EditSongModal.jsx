"use client";

import { useState } from "react";
import { X, Loader2, UploadCloud, Music, Image as ImageIcon } from "lucide-react";
import { uploadFiles, updateSong } from "@/lib/client";
import { GENRES } from "@/lib/seed-data";

export default function EditSongModal({ song, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: song.title,
    artist: song.artist,
    album: song.album || "",
    genre: song.genre || "",
  });
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [audioPreview, setAudioPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleAudio(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudio(file);
    setAudioPreview(file.name);
    setError("");
  }

  function handleCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Please enter a song title.");
      return;
    }
    if (!form.artist.trim()) {
      setError("Please enter an artist name.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = { ...form, title: form.title.trim(), artist: form.artist.trim() };

      if (audio || cover) {
        if (!audio || !cover) {
          setError("Please select both a new audio file and cover image, or leave both unchanged.");
          setSaving(false);
          return;
        }
        setStatus("Uploading audio...");
        const uploaded = await uploadFiles(audio, cover);
        setStatus("Uploading cover...");
        payload.audioUrl = uploaded.audioUrl;
        payload.coverUrl = uploaded.coverUrl;
        payload.audioPublicId = uploaded.audioPublicId;
        payload.coverPublicId = uploaded.coverPublicId;
        payload.duration = uploaded.duration;
      }

      setStatus("Saving changes...");
      await updateSong(song.id, payload);
      setStatus("Changes saved!");
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to update song. Please try again.");
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${song.title}`}
      onClick={onClose}
    >
      <div
        className="animate-pop max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-white">
            Edit Song
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-title" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Song Title *
              </label>
              <input
                id="edit-title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Midnight Dreams"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label htmlFor="edit-artist" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Artist *
              </label>
              <input
                id="edit-artist"
                value={form.artist}
                onChange={(e) => updateField("artist", e.target.value)}
                placeholder="Alex Morgan"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-album" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Album
              </label>
              <input
                id="edit-album"
                value={form.album}
                onChange={(e) => updateField("album", e.target.value)}
                placeholder="Night Stories"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="edit-genre" className="mb-1.5 block text-xs font-medium text-zinc-400">
                Genre *
              </label>
              <select
                id="edit-genre"
                value={form.genre}
                onChange={(e) => updateField("genre", e.target.value)}
                className={`${inputClass} appearance-none`}
                required
              >
                <option value="" disabled>
                  Select a genre
                </option>
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-surface">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="group block cursor-pointer rounded-2xl border border-dashed border-white/15 p-4 transition hover:border-purple-400/40">
              <span className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-400">
                <Music size={16} className="text-purple-300" />
                Replace Audio (optional)
              </span>
              <span className="block truncate text-sm text-white">
                {audioPreview || "MP3, WAV, M4A, OGG · up to 25MB"}
              </span>
              <input
                type="file"
                accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/ogg"
                onChange={handleAudio}
                className="sr-only"
              />
            </label>

            <label className="group block cursor-pointer rounded-2xl border border-dashed border-white/15 p-4 transition hover:border-purple-400/40">
              <span className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-400">
                <ImageIcon size={16} className="text-pink-300" />
                Replace Cover (optional)
              </span>
              <span className="block truncate text-sm text-white">
                {coverPreview ? "New cover selected" : "JPG, PNG, WebP · up to 8MB"}
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCover}
                className="sr-only"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-1">
            {status && !error && (
              <span className="flex items-center gap-2 text-xs text-zinc-400">
                {saving && <Loader2 size={14} className="animate-spin text-purple-300" />}
                {status}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-gradient flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

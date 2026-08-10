"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  UploadCloud,
  Music,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { uploadFiles, createSong } from "@/lib/client";
import { GENRES } from "@/lib/seed-data";

const EMPTY_FORM = { title: "", artist: "", album: "", genre: "" };

export default function UploadForm() {
  const router = useRouter();
  const [form, setForm] = useState(EMPTY_FORM);
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [audioPreview, setAudioPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  function dismissNotice() {
    if (uploading) return;
    setStatus("");
    setSuccess(false);
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    dismissNotice();
  }

  function handleAudio(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudio(file);
    setAudioPreview(file.name);
    setError("");
    dismissNotice();
  }

  function handleCover(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
    setError("");
    dismissNotice();
  }

  function resetForm() {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setForm({ ...EMPTY_FORM });
    setAudio(null);
    setCover(null);
    setAudioPreview("");
    setCoverPreview("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (uploading) return;

    if (!form.title.trim()) {
      setError("Please enter a song title.");
      return;
    }
    if (!form.artist.trim()) {
      setError("Please enter an artist name.");
      return;
    }
    if (!form.genre) {
      setError("Please select a genre.");
      return;
    }
    if (!audio) {
      setError("Please select an audio file.");
      return;
    }
    if (!cover) {
      setError("Please select a cover image.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      setStatus("Uploading audio...");
      const uploaded = await uploadFiles(audio, cover);

      setStatus("Saving song...");
      await createSong({
        title: form.title.trim(),
        artist: form.artist.trim(),
        album: form.album.trim(),
        genre: form.genre,
        audioUrl: uploaded.audioUrl,
        coverUrl: uploaded.coverUrl,
        audioPublicId: uploaded.audioPublicId,
        coverPublicId: uploaded.coverPublicId,
        duration: uploaded.duration,
      });

      setStatus("Upload complete!");
      setSuccess(true);
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
      setStatus("");
    } finally {
      setUploading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20";

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-white/5 bg-elevated p-6 shadow-lg sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="upload-title" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Song Title *
            </label>
            <input
              id="upload-title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Midnight Dreams"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="upload-artist" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Artist *
            </label>
            <input
              id="upload-artist"
              value={form.artist}
              onChange={(e) => updateField("artist", e.target.value)}
              placeholder="Alex Morgan"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="upload-album" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Album
            </label>
            <input
              id="upload-album"
              value={form.album}
              onChange={(e) => updateField("album", e.target.value)}
              placeholder="Night Stories"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="upload-genre" className="mb-1.5 block text-xs font-medium text-zinc-400">
              Genre *
            </label>
            <select
              id="upload-genre"
              value={form.genre}
              onChange={(e) => updateField("genre", e.target.value)}
              className={`${inputClass} appearance-none`}
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="group flex min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/15 p-6 text-center transition hover:border-purple-400/40 hover:bg-white/[0.02]">
            <Music size={26} className="mb-2 shrink-0 text-purple-300" />
            <span className="block w-full max-w-full min-w-0 truncate text-sm font-medium text-white">
              {audioPreview || "Choose Audio File"}
            </span>
            <span className="mt-1 text-xs text-zinc-500">
              MP3, WAV, M4A, OGG · up to 25MB
            </span>
            {audioPreview && (
              <span className="mt-3 flex min-w-0 max-w-full items-center gap-2 overflow-hidden rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-medium text-purple-300">
                <Music size={12} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate">{audioPreview}</span>
              </span>
            )}
            <input
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/ogg"
              onChange={handleAudio}
              className="sr-only"
            />
          </label>

          <label className="group flex min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/15 p-6 text-center transition hover:border-pink-400/40 hover:bg-white/[0.02]">
            <ImageIcon size={26} className="mb-2 shrink-0 text-pink-300" />
            <span className="block w-full max-w-full min-w-0 truncate text-sm font-medium text-white">
              {coverPreview ? "Cover selected" : "Choose Cover Image"}
            </span>
            <span className="mt-1 text-xs text-zinc-500">
              JPG, PNG, WebP · up to 8MB
            </span>
            {coverPreview && (
              <span className="mt-3 flex min-w-0 max-w-full items-center gap-2 overflow-hidden">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-zinc-400">
                  {cover?.name || "Cover selected"}
                </span>
              </span>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCover}
              className="sr-only"
            />
          </label>
        </div>

        {error && (
          <p className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Song uploaded successfully!</p>
              <p className="mt-0.5 text-emerald-200/80">
                Your song was added to the library.
              </p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="btn-gradient flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {status || "Uploading..."}
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              Upload Song
            </>
          )}
        </button>
      </form>

      <div className="rounded-3xl border border-white/5 bg-elevated p-6 shadow-lg sm:p-8">
        <h2 className="font-heading text-lg font-bold text-white">Upload Status</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Steps performed when you upload a song.
        </p>
        <ol className="mt-6 space-y-4">
          {(() => {
            const steps = [
              "Uploading audio...",
              "Uploading cover...",
              "Saving song...",
              "Upload complete!",
            ];
            const currentIndex = success
              ? steps.length
              : status
              ? steps.indexOf(status)
              : -1;
            return steps.map((step, i) => {
              const isDone = i < currentIndex;
              const isActive = uploading && i === currentIndex;
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isDone
                        ? "bg-emerald-500/15 text-emerald-400"
                        : isActive
                        ? "btn-gradient text-white"
                        : "border border-white/10 text-zinc-500"
                    }`}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : i + 1}
                  </span>
                  <span
                    className={`text-sm ${
                      isDone
                        ? "text-emerald-300"
                        : isActive
                        ? "font-medium text-white"
                        : "text-zinc-500"
                    }`}
                  >
                    {step}
                  </span>
                  {isActive && (
                    <Loader2 size={14} className="animate-spin text-purple-300" />
                  )}
                </li>
              );
            });
          })()}
        </ol>
      </div>
    </div>
  );
}

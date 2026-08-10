"use client";

import { useRef, useState } from "react";
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
import { formatBytes, formatDuration } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

const EMPTY_FORM = { title: "", artist: "", album: "", genre: "" };

const UPLOAD_STEPS = ["Uploading audio…", "Uploading cover…", "Saving song…"];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-500 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20";

function DropZone({
  refName,
  accept,
  label,
  hint,
  icon: Icon,
  fileName,
  preview,
  onFile,
  dragActive,
  onDragOver,
  onDragLeave,
  onDragEnd,
  inputRef,
}) {
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver();
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDragEnd();
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={`group flex min-w-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition ${
        dragActive
          ? "border-purple-400/60 bg-purple-500/10"
          : "border-white/15 hover:border-purple-400/40 hover:bg-white/[0.02]"
      }`}
    >
      {preview ? (
        <span className="relative mb-3 h-24 w-24 overflow-hidden rounded-2xl border border-white/10 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
        </span>
      ) : (
        <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300 transition group-hover:bg-purple-500/20">
          <Icon size={26} />
        </span>
      )}
      <span className="block w-full max-w-full min-w-0 truncate text-sm font-semibold text-white">
        {fileName || label}
      </span>
      <span className="mt-1 text-xs text-zinc-500">{hint}</span>
      {dragActive && (
        <span className="mt-3 rounded-full bg-purple-500/20 px-3 py-1 text-[11px] font-semibold text-purple-200">
          Drop to add
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => onFile(e.target.files?.[0])}
        className="sr-only"
      />
    </label>
  );
}

/* STEP-2-INSERT */

export default function UploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [audio, setAudio] = useState(null);
  const [cover, setCover] = useState(null);
  const [audioPreview, setAudioPreview] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [coverPreview, setCoverPreview] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(null);
  const audioInputRef = useRef(null);
  const coverInputRef = useRef(null);

  function dismissNotice() {
    if (uploading) return;
    setStatus("");
    setSuccess(false);
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    dismissNotice();
  }

  function handleAudio(file) {
    if (!file) return;
    setAudio(file);
    setAudioPreview(file.name);
    setAudioDuration(0);
    setError("");
    dismissNotice();

    const url = URL.createObjectURL(file);
    const el = new Audio();
    el.preload = "metadata";
    el.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(el.duration)) setAudioDuration(el.duration);
      URL.revokeObjectURL(url);
    });
    el.addEventListener("error", () => URL.revokeObjectURL(url));
    el.src = url;
  }

  function handleCover(file) {
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
    setAudioDuration(0);
    setCoverPreview("");
    if (audioInputRef.current) audioInputRef.current.value = "";
    if (coverInputRef.current) coverInputRef.current.value = "";
  }

  function validate() {
    if (!form.title.trim()) return "Please enter a song title.";
    if (!form.artist.trim()) return "Please enter an artist name.";
    if (!form.genre) return "Please select a genre.";
    if (!audio) return "Please select an audio file.";
    if (!cover) return "Please select a cover image.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (uploading) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    try {
      setStatus("Uploading audio…");
      const uploaded = await uploadFiles(audio, cover);

      setStatus("Saving song…");
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

      setStatus("");
      setSuccess(true);
      toast("Song uploaded successfully", { tone: "success" });
      resetForm();
      router.refresh();
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
      setStatus("");
      toast(err.message || "Upload failed. Please try again.", {
        tone: "error",
      });
    } finally {
      setUploading(false);
    }
  }

  const stepIndex = success
    ? UPLOAD_STEPS.length
    : status
      ? UPLOAD_STEPS.indexOf(status)
      : -1;
  const progress = success
    ? 100
    : stepIndex < 0
      ? 0
      : Math.round(((stepIndex + 0.6) / UPLOAD_STEPS.length) * 100);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-3xl border border-white/5 bg-elevated p-6 shadow-lg sm:p-8"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="upload-title"
              className="mb-1.5 block text-xs font-medium text-zinc-400"
            >
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
            <label
              htmlFor="upload-artist"
              className="mb-1.5 block text-xs font-medium text-zinc-400"
            >
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
            <label
              htmlFor="upload-album"
              className="mb-1.5 block text-xs font-medium text-zinc-400"
            >
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
            <label
              htmlFor="upload-genre"
              className="mb-1.5 block text-xs font-medium text-zinc-400"
            >
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
          <DropZone
            refName="audio"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/m4a,audio/mp4,audio/ogg"
            label="Choose Audio File"
            hint="MP3, WAV, M4A, OGG · up to 25MB"
            icon={Music}
            fileName={audioPreview}
            preview=""
            onFile={handleAudio}
            dragActive={dragOver === "audio"}
            onDragOver={() => setDragOver("audio")}
            onDragLeave={() => setDragOver((v) => (v === "audio" ? null : v))}
            onDragEnd={() => setDragOver(null)}
            inputRef={audioInputRef}
          />
          <DropZone
            refName="cover"
            accept="image/jpeg,image/png,image/webp"
            label="Choose Cover Image"
            hint="JPG, PNG, WebP · up to 8MB"
            icon={ImageIcon}
            fileName={cover ? "Cover selected" : ""}
            preview={coverPreview}
            onFile={handleCover}
            dragActive={dragOver === "cover"}
            onDragOver={() => setDragOver("cover")}
            onDragLeave={() => setDragOver((v) => (v === "cover" ? null : v))}
            onDragEnd={() => setDragOver(null)}
            inputRef={coverInputRef}
          />
        </div>

        {audio && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-zinc-400">
            <Music size={15} className="shrink-0 text-purple-300" />
            <span className="max-w-40 truncate font-medium text-white sm:max-w-64">
              {audio.name}
            </span>
            <span className="tabular-nums">
              {formatBytes(audio.size)}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {audioDuration > 0
                ? formatDuration(audioDuration)
                : "reading duration…"}
            </span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
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

      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-white/5 bg-elevated p-6 shadow-lg sm:p-8">
          <h2 className="font-heading text-lg font-bold text-white">
            Upload Progress
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Steps performed when you upload a song.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-300">
                {success
                  ? "Complete!"
                  : stepIndex >= 0
                    ? UPLOAD_STEPS[stepIndex]
                    : "Waiting to start"}
              </span>
              <span className="tabular-nums text-zinc-500">{progress}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-2 w-full overflow-hidden rounded-full bg-white/10"
            >
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  success
                    ? "bg-emerald-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ol className="mt-6 space-y-4">
            {UPLOAD_STEPS.map((step, i) => {
              const isDone = i < stepIndex || success;
              const isActive = uploading && i === stepIndex;
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
                    <Loader2
                      size={14}
                      className="animate-spin text-purple-300"
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {cover && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {cover.name}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {formatBytes(cover.size)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
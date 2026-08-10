"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteSong } from "@/lib/client";
import Modal from "@/components/ui/Modal";

export default function DeleteSongModal({ song, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await deleteSong(song.id);
      onDeleted();
    } catch (err) {
      setError(err.message || "Failed to delete song. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Confirm delete"
      maxWidth="max-w-sm"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
          <AlertTriangle size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            Delete &ldquo;{song.title}&rdquo;?
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            This permanently removes the song from your library and deletes
            its audio and cover from Cloudinary. This action cannot be undone.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </Modal>
  );
}
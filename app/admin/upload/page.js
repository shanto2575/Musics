import { UploadCloud, Music } from "lucide-react";
import UploadForm from "@/components/admin/UploadForm";
import { isCloudinaryConfigured, isDatabaseConfigured } from "@/lib/songs";

export const dynamic = "force-dynamic";

export default async function AdminUploadPage() {
  const dbReady = isDatabaseConfigured();
  const cloudinaryReady = isCloudinaryConfigured();

  const ready = dbReady && cloudinaryReady;

  return (
    <>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Upload Song
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Add a new track to the VibeFlow library.
        </p>
      </div>

      {!ready && (
        <div className="mb-8 flex flex-col gap-3 rounded-3xl border border-amber-400/20 bg-amber-500/10 p-5 text-sm text-amber-200">
          <p className="font-semibold">Uploads require configuration</p>
          <ul className="list-inside list-disc space-y-1 text-amber-200/80">
            {!dbReady && <li>Set <code className="rounded bg-amber-400/10 px-1">MONGODB_URI</code> to store songs.</li>}
            {!cloudinaryReady && (
              <li>
                Set <code className="rounded bg-amber-400/10 px-1">CLOUDINARY_CLOUD_NAME</code>,{" "}
                <code className="rounded bg-amber-400/10 px-1">CLOUDINARY_API_KEY</code>, and{" "}
                <code className="rounded bg-amber-400/10 px-1">CLOUDINARY_API_SECRET</code> to
                upload audio and covers.
              </li>
            )}
          </ul>
          <p className="text-amber-200/60">
            See Settings for details.
          </p>
        </div>
      )}

      {ready ? (
        <UploadForm />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-elevated/50 px-6 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
            {!cloudinaryReady ? <UploadCloud size={26} /> : <Music size={26} />}
          </div>
          <h2 className="text-lg font-semibold text-white">
            Upload form is locked
          </h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-400">
            The upload form becomes available once Cloudinary and MongoDB are
            configured in <code className="rounded bg-white/5 px-1">.env.local</code>.
          </p>
        </div>
      )}
    </>
  );
}

import SettingsPanel from "@/components/admin/SettingsPanel";
import { isCloudinaryConfigured, isDatabaseConfigured } from "@/lib/songs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  return (
    <>
      <div className="mb-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[11px] font-semibold tracking-widest text-purple-300 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden="true" />
          System
        </p>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Service configuration and developer tools.
        </p>
      </div>

      <SettingsPanel
        dbReady={isDatabaseConfigured()}
        cloudinaryReady={isCloudinaryConfigured()}
      />
    </>
  );
}

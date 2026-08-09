import SettingsPanel from "@/components/admin/SettingsPanel";
import { isCloudinaryConfigured, isDatabaseConfigured } from "@/lib/songs";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
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

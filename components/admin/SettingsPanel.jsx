"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  CloudUpload,
  CheckCircle2,
  XCircle,
  Loader2,
  Wand2,
} from "lucide-react";

export default function SettingsPanel({ dbReady, cloudinaryReady }) {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  async function handleSeed() {
    setSeeding(true);
    setSeedMessage("");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSeedMessage(`Seeded ${data.seeded} sample songs. Refreshing...`);
        router.refresh();
      } else {
        setSeedMessage(data.error || "Seeding failed.");
      }
    } catch {
      setSeedMessage("Seeding failed. Check your MongoDB connection.");
    } finally {
      setSeeding(false);
    }
  }

  const services = [
    {
      name: "MongoDB",
      description: "Stores song metadata.",
      ready: dbReady,
      env: "MONGODB_URI",
      icon: Database,
    },
    {
      name: "Cloudinary",
      description: "Stores audio and cover files.",
      ready: cloudinaryReady,
      env: "CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET",
      icon: CloudUpload,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {services.map(({ name, description, ready, env, icon: Icon }) => (
          <div
            key={name}
            className="rounded-3xl border border-white/5 bg-elevated p-5 shadow-lg transition duration-300 hover:border-purple-400/20"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-zinc-500">{description}</p>
                </div>
              </div>
              {ready ? (
                <span className="flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                  <CheckCircle2 size={14} />
                  Connected
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400">
                  <XCircle size={14} />
                  Not set
                </span>
              )}
            </div>
            <p className="mt-4 rounded-xl bg-white/5 px-3 py-2 font-mono text-[11px] break-all text-zinc-400">
              {env}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/5 bg-elevated p-5">
        <h2 className="text-sm font-semibold text-white">Sample Data</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Populate the library with sample songs so you can test playback and
          the UI. Only runs when the library is empty.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding || !dbReady}
            className="btn-gradient flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {seeding ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Wand2 size={16} />
            )}
            {seeding ? "Seeding..." : "Seed sample songs"}
          </button>
        </div>
        {seedMessage && (
          <p className="mt-3 text-sm text-zinc-300">{seedMessage}</p>
        )}
      </div>

      <div className="rounded-3xl border border-white/5 bg-elevated p-5">
        <h2 className="text-sm font-semibold text-white">API Endpoints</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-zinc-400">
          <li>
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-purple-300">GET / POST</code>{" "}
            <code className="font-mono text-xs">/api/songs</code>
          </li>
          <li>
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-purple-300">GET / PATCH / DELETE</code>{" "}
            <code className="font-mono text-xs">/api/songs/[id]</code>
          </li>
          <li>
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-purple-300">POST</code>{" "}
            <code className="font-mono text-xs">/api/upload</code> — uploads audio + cover to Cloudinary
          </li>
        </ul>
      </div>
    </div>
  );
}

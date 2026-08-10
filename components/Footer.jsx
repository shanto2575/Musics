import Link from "next/link";
import { AudioLines, Globe, Mail, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight"
            >
              <span className="btn-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-purple-500/20">
                <AudioLines size={20} className="text-white" />
              </span>
              <span>
                SONI<span className="text-gradient">VA</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-zinc-500">
              Discover new sounds, create your vibe, and enjoy your favorite
              music anywhere.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Explore</h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/discover" className="transition hover:text-white">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/artists" className="transition hover:text-white">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="transition hover:text-white">
                  Playlists
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">Follow</h3>
            <div className="flex items-center gap-3">
              {[
                { icon: Globe, label: "Website" },
                { icon: Mail, label: "Email" },
                { icon: Share2, label: "Share" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`VibeFlow on ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition hover:border-purple-400/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/70"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-zinc-600 sm:flex-row">
          <p>© {new Date().getFullYear()} VibeFlow. All rights reserved.</p>
          <p>
            Built with Next.js, MongoDB &amp; Cloudinary.
          </p>
        </div>
      </div>
    </footer>
  );
}

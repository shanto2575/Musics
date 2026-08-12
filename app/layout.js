import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { MusicPlayerProvider } from "@/context/MusicPlayerContext";
import { ToastProvider } from "@/components/ui/Toast";
import MusicPlayer from "@/components/MusicPlayer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "SONIVA — Music that moves with you",
    template: "%s | SONIVA",
  },
  description:
    "Discover new sounds, create your vibe, and enjoy your favorite music anywhere.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-zinc-100">
        <MusicPlayerProvider>
          <ToastProvider>
            {children}
            <MusicPlayer />
          </ToastProvider>
        </MusicPlayerProvider>
      </body>
    </html>
  );
}

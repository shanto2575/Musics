# VibeFlow — Full Music Streaming Platform PRD

## 1. Project Overview

Build a modern, premium, responsive music streaming platform called **VibeFlow**.

VibeFlow allows users to discover music, browse artists and playlists, and play songs through a modern music player.

An admin can upload songs and album covers through an admin dashboard. Audio files and images will be stored in Cloudinary, while song metadata will be stored in MongoDB.

The project should look professional enough for a developer portfolio/CV.

---

## 2. Technology Stack

Use the following technologies:

- Next.js with App Router
- JavaScript
- React
- Tailwind CSS
- MongoDB
- Cloudinary
- HTML5 Audio API
- Lucide React Icons

Do NOT use TypeScript.

Do NOT use a backend framework such as Express.

Use Next.js API Routes / Route Handlers for backend functionality.

---

## 3. Main Features

1. Landing Page
2. Music Discovery
3. Featured Songs
4. Popular Artists
5. Trending Playlists
6. Music Library
7. Functional Music Player
8. Admin Dashboard
9. Song Upload
10. Song CRUD
11. Cloudinary Audio Upload
12. Cloudinary Cover Image Upload
13. MongoDB Song Storage
14. Responsive Design
15. Progress Tracking using `PROGRESS.md`

---

## 4. Design Requirements

Create a premium modern music streaming UI.

### Theme

Use a dark theme.

Primary colors: Black, Dark charcoal, White, Gray, Purple, Pink.

Use subtle purple/pink gradients.

### UI Style

Modern, Minimal, Premium, Rounded cards, Glassmorphism, Soft shadows, Gradient buttons, Smooth hover effects, Clean typography, Good spacing, Strong visual hierarchy.

Avoid making the UI overly complicated.

---

## 5. Landing Page

### Navbar

- VibeFlow logo
- Home, Discover, Artists, Playlists
- Search icon
- Login button
- Get Started button

Sticky navbar, transparent/dark background, responsive, mobile hamburger menu.

### Hero Section

Heading: "Music that moves with you."

Description: "Discover new sounds, create your vibe, and enjoy your favorite music anywhere."

Buttons: "Start Listening" (primary), "Explore Music" (secondary).

Visual: Large album artwork, floating song information card, play button, music waveform/equalizer animation, subtle background glow. Album artwork rotates subtly while playing.

### Featured Tracks

Section title: **Featured Tracks**. Display 4–6 music cards (cover, title, artist, duration, play, like). Songs come from MongoDB. No permanent hardcoding.

### Popular Artists

Display 6 artists with circular profile image, name, label. Derive from uploaded songs if separate data is unavailable.

### Trending Playlists

Playlist cards: Chill Vibes, Late Night Drive, Focus Flow. Each card: cover, name, song count, play button.

### Music Library

Dedicated music browsing section. All songs from MongoDB. Each row: cover, title, artist, album, genre, duration, play, like. Genre filtering (All/Pop/Rock/Hip Hop/Electronic/Chill/Focus). Search by title, artist, album, genre.

---

## 11. Music Player

Fixed bottom player, always visible when a song is selected.

- Left: album thumbnail, title, artist
- Center: previous, play/pause, next, progress bar, current time, total duration
- Right: like, volume icon, volume slider

### Functionality (HTML5 Audio API)

- Play, Pause, Next, Previous
- Progress + click/drag seeking
- Volume control
- Auto-next on song end
- Clicking any song card sets the song, updates the player, starts playback
- React state/context; no global state libraries

---

## 13. Admin Dashboard

Protected-looking admin dashboard UI with: Dashboard overview, Songs, Upload Song, Artists, Playlists, Settings. Focus on song management for v1.

### Overview

Stats: Total Songs, Total Artists, Total Genres, Recent Uploads.

### Upload Song

Fields: Song Title, Artist, Album, Genre, Audio File, Cover Image.

### Cloudinary Upload

- Audio: MP3 (+ optional WAV, M4A, OGG)
- Cover: JPG, JPEG, PNG, WebP
- No audio stored in Next.js project or MongoDB; MongoDB stores only metadata + Cloudinary URLs.

### Env

`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `MONGODB_URI` in `.env.local`. Never expose the API secret client-side. Never commit `.env.local`.

### MongoDB Schema

`{ title, artist, album, genre, audioUrl, coverUrl, duration, audioPublicId, coverPublicId, createdAt, updatedAt }`

### Song CRUD

Create, Read, Update (title/artist/album/genre + replace audio/cover), Delete (from MongoDB + Cloudinary).

---

## 20. API Routes

- `/api/songs` — GET, POST
- `/api/songs/[id]` — GET, PATCH, DELETE
- `/api/upload` — POST (audio + cover to Cloudinary)

---

## 21. Validation

Required: title, artist, genre, audio file, cover image. Validate file type and size. Clear error messages. Show upload progress stages: "Uploading audio..." / "Uploading cover..." / "Saving song..." / "Upload complete!". Disable submit while uploading, show spinner, prevent duplicates. Clear form + success message + refresh list after upload.

---

## 23. Admin Song Table

Columns: Cover, Song, Artist, Album, Genre, Duration, Created, Actions (Edit/Delete). Cards on mobile.

---

## 25. Responsive Design

Desktop: multi-column, large hero, full player. Tablet: responsive grids, smaller artwork. Mobile: hamburger, single-column hero, horizontal scrolling cards, compact player, touch-friendly controls. Bottom padding so the player never covers content.

---

## 26. Animations

Card hover scale, button hover, fade-in sections, album rotation while playing, equalizer animation, smooth progress bar, modal animations, sidebar transitions. Not overused.

---

## 27. Error Handling

Handle MongoDB connection failure, Cloudinary failure, invalid file, missing fields, song not found, delete failure, network errors. Friendly messages; log server-side.

---

## 28. Loading States

Skeletons for songs, dashboard, uploading, deleting, updating, searching.

---

## 29. Empty States

"No songs found." / "Upload your first song to start building your library." / `No music found for "love".`

---

## 30. Suggested Folder Structure

See `# Folder Structure` in this PRD's file tree (App Router, components/, lib/, models/, context/).

---

## 31. Music Player Architecture

`MusicPlayerContext` manages `currentSong`, `isPlaying`, `currentTime`, `duration`, `volume`, `playlist`, `currentIndex`; functions `playSong`, `pauseSong`, `togglePlay`, `nextSong`, `previousSong`, `seek`, `changeVolume`.

---

## 32. Client and Server Components

Server: pages, data fetching, dashboard data. Client: music player, audio controls, search, upload form, buttons with state, mobile menu. Use `"use client"` only where needed.

---

## 33. Performance

Next.js Image where appropriate, lazy loading, avoid unnecessary re-renders, organized player state, optimized Cloudinary URLs.

---

## 34. Accessibility

Button labels, alt text, keyboard controls, accessible forms, contrast, focus states, aria-labels for playback controls.

---

## 35. Security

Never expose Cloudinary API secret or MongoDB credentials. Validate files and request data. Sanitize input. Keep `.env.local` out of Git. No hardcoded secrets. Server-side Cloudinary operations only.

---

## 36. Progress Tracking

`PROGRESS.md` at root. Read before starting work; update after every meaningful task. Track completed/current/pending tasks, recent changes, bugs, technical decisions. Never store secrets.

---

## 37. PRD Tracking

`PRD.md` at root with the full product requirement. Workflow: read PRD → read PROGRESS → inspect code → identify next task → implement → test → update PROGRESS. Do not rebuild completed features unnecessarily.

---

## 38. Development Rules

1. Use Next.js App Router.
2. Use JavaScript only.
3. Do NOT use TypeScript.
4. Use Tailwind CSS.
5. Use MongoDB for song metadata.
6. Use Cloudinary for audio and image storage.
7. Use Next.js Route Handlers for APIs.
8. Keep secrets server-side.
9. Create reusable React components.
10. Avoid unnecessary dependencies.
11. Read PRD.md before starting work.
12. Read PROGRESS.md before starting work.
13. Update PROGRESS.md after every meaningful task.
14. Test every implemented feature.
15. Fix existing bugs before adding unnecessary new features.
16. Do not overwrite working features without a reason.
17. Keep the UI responsive.
18. Keep the code clean and maintainable.
19. Never put secrets in source code.
20. Never put secrets inside PROGRESS.md.

---

## 39. Development Phases

Phase 1 — Project Setup; Phase 2 — UI; Phase 3 — Music Player; Phase 4 — Database; Phase 5 — Cloudinary; Phase 6 — Admin Dashboard; Phase 7 — Search and Filtering; Phase 8 — Testing; Phase 9 — Final Polish.

---

## 40. Final Acceptance Criteria

Frontend: premium landing page, responsive, navbar/hero/cards/artists/playlists work.

Music Player: play, pause, next, previous, progress, seek, volume, auto-next, selected song updates player.

Backend: MongoDB connected, Song model, GET/POST/PATCH/DELETE work.

Cloudinary: audio upload, cover upload, URLs saved, files deleted when required.

Admin: dashboard, upload, list, edit, delete all work.

Quality: no TypeScript, no exposed secrets, no unnecessary deps, responsive, accessible, error handling, loading states, PROGRESS.md maintained, PRD.md maintained.

---

## 41. Final Product Vision

VibeFlow should feel like a real-world music streaming platform. Flow: Admin → Upload Song → Cloudinary → MongoDB Metadata → Music Library → User selects song → Music Player → Play/Pause/Next/Previous.

---

## Folder Structure

```
vibeflow/
├── app/
│   ├── page.js
│   ├── layout.js
│   ├── globals.css
│   ├── discover/page.js
│   ├── artists/page.js
│   ├── playlists/page.js
│   ├── admin/
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── songs/page.js
│   │   ├── upload/page.js
│   │   ├── artists/page.js
│   │   ├── playlists/page.js
│   │   └── settings/page.js
│   └── api/
│       ├── songs/route.js
│       ├── songs/[id]/route.js
│       ├── upload/route.js
│       └── seed/route.js
├── components/
│   ├── Navbar.jsx, Hero.jsx, FeaturedTracks.jsx, MusicCard.jsx,
│   ├── MusicPlayer.jsx, PopularArtists.jsx, PlaylistCard.jsx,
│   ├── TrendingPlaylists.jsx, MusicLibrary.jsx, SearchBar.jsx,
│   ├── CoverImage.jsx, Equalizer.jsx, Slider.jsx, LikeButton.jsx,
│   ├── Loading.jsx, EmptyState.jsx, Footer.jsx, SectionHeading.jsx,
│   └── admin/
│       ├── AdminSidebar.jsx, StatCard.jsx, SongTable.jsx,
│       ├── EditSongModal.jsx, DeleteSongModal.jsx,
│       ├── UploadForm.jsx, SettingsPanel.jsx
├── context/MusicPlayerContext.jsx
├── hooks/useLikes.js
├── lib/
│   ├── mongodb.js, cloudinary.js, songs.js, utils.js, client.js, seed-data.js
├── models/Song.js
├── PRD.md
├── PROGRESS.md
├── .env.local
└── package.json
```

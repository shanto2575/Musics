# VibeFlow Development Progress

## Status

In Progress — Phase 6/9 (Admin Dashboard). Database & Cloudinary integration **verified end-to-end** with real credentials. Upload / CRUD / Cloudinary deletion all tested and passing. Four bugs found and fixed (Cloudinary upload hang, upload 400 handling, player Next/Previous on single-song queue, no working user Logout). Login works; Logout now implemented for both users and admins via the existing Better Auth setup, stops any playing music on logout, and admin/public navigation (incl. admin Home ↔ Admin Dashboard) is verified in-browser + server-side.

## Completed

- [x] Phase 1 — Project setup (Next.js 16 App Router, JavaScript, Tailwind v4, lucide-react, mongoose, cloudinary)
- [x] PRD.md created
- [x] PROGRESS.md created
- [x] Dark theme design system (purple/pink gradients, glassmorphism, animations) in globals.css
- [x] Root layout with fonts + MusicPlayerProvider + MusicPlayer
- [x] Navbar (sticky, responsive, hamburger)
- [x] Hero (animated disc artwork, equalizer, floating info card, play button)
- [x] Featured Tracks (from DB)
- [x] Popular Artists (derived from songs)
- [x] Trending Playlists (Chill Vibes / Late Night Drive / Focus Flow)
- [x] Footer
- [x] Music Library (search + genre filter, debounced)
- [x] MusicPlayerContext (play/pause/next/prev/seek/volume/auto-next)
- [x] MusicPlayer UI (fixed bottom, responsive, progress + volume sliders)
- [x] MongoDB connection (lib/mongodb.js, cached)
- [x] Song model (models/Song.js)
- [x] Server data helpers (lib/songs.js)
- [x] Cloudinary config + upload/delete helpers (lib/cloudinary.js)
- [x] API routes: /api/songs (GET/POST), /api/songs/[id] (GET/PATCH/DELETE), /api/upload (POST), /api/seed (POST)
- [x] Landing page assembled from sections
- [x] /discover, /artists, /playlists public pages
- [x] Admin layout + sidebar (responsive drawer)
- [x] Admin dashboard overview (stats + recent uploads)
- [x] Admin songs table (desktop table + mobile cards)
- [x] Admin upload form (staged status, validation, file preview)
- [x] Admin edit song modal (fields + optional replace audio/cover)
- [x] Admin delete song modal (with Cloudinary cleanup)
- [x] Admin artists / playlists / settings pages (+ seed sample data tool)
- [x] User signup page (/signup) with validation, auto-sign-in, and role-safe registration (role always "user")
- [x] Empty states, loading skeletons, error handling across pages

## In Progress

- [ ] Final polish pass (animations, a11y, performance)

## Pending

- [ ] None — only the polish pass above remains before final release QA.

## Recent Changes

### 2026-08-10 (Auth configuration verification + build fix)

- **Root cause of the build failure** (`MONGODB_URI is required for authentication.`): `lib/auth.js` reads `process.env.MONGODB_URI` at module load and throws when it is missing. The build previously ran before `.env.local` existed, so the env var was absent during `next build`. The fix is configuration, not code: `.env.local` now contains `MONGODB_URI` (plus the Better Auth vars), so the build loads it. Confirmed `lib/auth.js` reads `process.env.MONGODB_URI` — the URI is **never hardcoded** anywhere in source; it lives only in git-ignored `.env.local` (and must be provided by the platform, e.g. Vercel dashboard, in production).
- **Build does not depend on a running MongoDB server**: `new MongoClient(...)`/`mongodbAdapter(...)` connect lazily (no I/O at module load), so `next build` only needs the env var, not a live database. Verified by running the final build with **no local `mongod` running** — it compiled and generated all routes, with `/api/auth/[...all]` in the route list.
- **Auth flow verified end-to-end in dev** (fresh `npm run dev` restart so `.env.local` is definitely loaded):
  - `GET /login` → 200; `GET /signup` → 200 (both render).
  - `POST /api/auth/sign-up/email` → 200, new account stored with `role: "user"` (MongoDB write).
  - `POST /api/auth/sign-in/email` (normal user) → 200; `GET /api/auth/get-session` returns the session with `role: "user"` (MongoDB read).
  - Admin protection: `POST /api/songs` without a session → **401**; with a normal-user session → **403**; `GET /admin` without a session → **307 → /login**.
  - Admin login: promoted a throwaway account to `role: "admin"`, sign-in → session `role: "admin"`; `POST /api/songs` as admin passes the guard (400 from field validation, not 401/403); `GET /admin` with admin session → 200.
  - `POST /api/auth/sign-out` (requires the `Origin` header, which browsers always send on POST — curl/PowerShell omit it, hence earlier 403s) → 200, session revoked server-side; `get-session` → null afterward.
  - **MongoDB auth data read/write confirmed** at the DB level: signup creates a `user` + credential `account` row, sign-in creates a `session` row, sign-out deletes it.
- **No secrets exposed**: actual `MONGODB_URI`, Better Auth secret, Cloudinary keys, or seed passwords never appear in logs or `PROGRESS.md`; only their host/state is described. `.env.local` remains git-ignored and untracked.
- Test account and all test session rows were cleaned up afterwards (auth DB returned to its pre-test state; existing seeded accounts untouched).
- `npm run build` passes (final verification). `npm run lint` unchanged and clean.

### 2026-08-10 (User Signup / Registration)

- **Added `/signup`** (`app/signup/page.jsx`, client component) using the existing Better Auth system — no second auth system. Fields: Name, Email, Password, Confirm Password, and a **Create Account** button, plus an "Already have an account? **Login**" link to `/login`. Styled to match the login card (glassmorphism, gradient button, glow background).
- **Signup behavior**: `authClient.signUp.email()` creates the account and **auto-signs-in** (Better Auth returns a session cookie by default — `autoSignIn` is not disabled and `requireEmailVerification` is off). On success a green "Account created! Redirecting you to Discover…" state is shown, then the user is redirected to `/discover`. Already-signed-in visitors to `/signup` are redirected (admin → `/admin`, user → `/discover`).
- **Role safety**: the app never sends a role. `role` is an additional field with `defaultValue: "user"` and `input: false` (`lib/auth.js`), so the server strips any client-submitted role — public signup can never create an admin. This is enforced server-side by Better Auth, not just the form.
- **Validation** (client + server): name required; email format checked client-side (`INVALID_EMAIL` mapped server-side too); password required and must meet Better Auth's minimum (8 chars → `PASSWORD_TOO_SHORT` is mapped); Confirm Password must match (client-side "Passwords do not match."); duplicate emails rejected with "An account with this email already exists." (Better Auth `USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL`); any other failure surfaces as "Registration failed…".
- **Login page** now shows "Don't have an account? **Sign up**" → `/signup`; the existing login flow is unchanged.
- **Navigation**: guest navbar (desktop + mobile menu) shows **Login** + **Get Started**, and **Get Started now goes to `/signup`** (was `/discover`). Authenticated users still see only their account pill + Logout; admins see Admin Dashboard + Logout.
- **Env docs**: `.env.example` now documents the Better Auth vars (`BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`) and the auth seed vars (`ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `USER_EMAIL`, `USER_PASSWORD`) as empty placeholders. `.env.local` already holds the upgraded admin email/password values; real credentials remain in `.env.local` only (never printed or committed).
- **In-browser verification (headless Chrome, temp-dir puppeteer-core, no project deps)** — **33/33 checks pass**:
  - Guest `/signup` renders all 4 fields + Create Account + "Already have an account? Login" (href `/login`).
  - Guest navbar "Get Started" → `/signup` (desktop + mobile menu).
  - Password mismatch rejected with "Passwords do not match." and stays on `/signup`.
  - Successful signup shows success state → auto-login → `/discover`; navbar shows Logout and no Login/Signup.
  - New user cannot access `/admin` or `/admin/songs` (redirected to `/discover`).
  - Logout clears the session cookie; re-login with the newly created account works (`/discover`).
  - Duplicate email rejected with "An account with this email already exists." and stays on `/signup`.
  - Mobile (375px): `/signup` renders with no horizontal overflow and all fields visible; guest hamburger menu shows Get Started → `/signup`.
  - **DB check**: the newly created account exists in `vibeflow_auth` with `role: "user"`.
  - Existing **admin login regression**: admin sign-in → `/admin` dashboard works; admin logout works.
- Test users/accounts/sessions cleaned up afterwards (auth DB left tidy: 2 seed users, 0 sessions, 0 orphans).
- `npm run lint` + `npm run build` clean; production server restarted on the new build (`/signup` now a prerendered static route).

### 2026-08-10 (Auth seed credentials moved to environment variables)

- **Seed credentials now come only from `.env.local`** (`scripts/seed-admin.mjs`): the admin seed uses `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` (role `admin`) and the test user seed uses `USER_EMAIL` / `USER_PASSWORD` (role `user`). No credentials are hardcoded in source; passwords are never logged or written to `PROGRESS.md`.
- **Fixed a latent bug in the seed script**: with the Better Auth Mongo adapter, user documents store their id as `_id` (an `ObjectId`) — there is **no** string `id` field, and `auth.api.signUpEmail` returns a `user.id` that does **not** match the stored `_id`. `account`/`session` `userId` fields are also `ObjectId`s. The old script filtered by the phantom id, so role updates silently no-oped and cleanup deleted nothing. The script now keys off `email` / `_id` (via `ObjectId`), which fixed stale-role and orphan cleanup.
- **The seed now verifies passwords end-to-end**: for each configured account it attempts a real sign-in with the configured password; if the existing account cannot log in (i.e. its password is stale), the account is recreated with the current password and the correct role. Existing accounts whose passwords still work are left untouched (role corrected if needed).
- **No conflicting seed accounts left behind**: after seeding, any other `role: "admin"` accounts (old admin emails) are demoted to `user`, and the `USER_EMAIL` account is force-kept at `role: "user"` so the test user can never be admin.
- **Database state verified against live MongoDB** (`vibeflow_auth`): exactly two users — the configured admin (`role: admin`) and the configured user (`role: user`); 0 sessions, 2 credential accounts, 0 orphaned rows. Both accounts were verified to sign in with their configured passwords via the Better Auth API.
- **Public signup always creates `role = "user"`**: `role` is an additional field with `defaultValue: "user"` and `input: false` (`lib/auth.js`), so the API ignores any submitted role. Verified live: `POST /api/auth/sign-up/email` with `role: "admin"` in the body still created the user with `role: "user"` (throwaway account cleaned up afterwards).
- **In-browser verification (headless Chrome, temp-dir puppeteer-core, no project deps)** — **24/24 checks pass** against the restarted server:
  - Admin (configured admin creds): login → `/admin`, dashboard loads, sidebar Home → `/` (session intact, Admin Dashboard link + Logout visible), navbar Admin Dashboard → `/admin`, Songs page lists songs, Upload Song page renders, logout → `/login`, session cookies cleared.
  - User (configured user creds): login → `/discover`, can access `/`, `/discover`, `/artists`, `/playlists` while logged in, cannot access `/admin` or `/admin/*` (redirected to `/discover`), logout → `/login`, session cookies cleared, music player UI gone, and the real HTML5 audio element had `pause()` invoked during logout.
- `npm run lint` and `npm run build` clean. Production server restarted on the fresh build; `.env.local` values loaded.

### 2026-08-10 (Navigation, auth state UI, music stop on logout)

- **Admin navigation**: added a **Home → `/`** item to the top of the admin sidebar (`components/admin/AdminSidebar.jsx`), so admins can jump from the Admin Dashboard to the public VibeFlow landing page. Fixed the active-state logic to special-case `/` and `/admin` (previously `pathname.startsWith("/")` would have highlighted Home on every admin page). Removed the now-redundant "View Site" footer link. The admin stays authenticated when moving `/admin` → `/`.
- **Public homepage account area** (`components/Navbar.jsx`):
  - **Guest**: Login + Get Started.
  - **Normal user**: user name/email pill (account info) + Logout.
  - **Admin**: Admin Dashboard → `/admin` + Logout.
  - Login is never shown once a session exists; added a `checkingSession` state so the auth area renders empty (no "Login" flash) while `getSession()` resolves.
  - User nav links: Home / Discover / Artists / Playlists + Logout (desktop + mobile).
- **Music stop on logout**: added `stopAndResetPlayer()` to `context/MusicPlayerContext.jsx`. It pauses the **real** HTML5 `Audio` instance, resets `audio.currentTime = 0`, removes `src` and calls `load()` so the stream is actually released (`networkState` → NETWORK_EMPTY), then clears `currentSong`/`playlist`/`currentIndex`/`isPlaying`/`currentTime`/`duration` (the fixed bottom player unmounts). Both the Navbar and the AdminSidebar logout handlers call it **before** `authClient.signOut()`.
- **Logout** still uses the existing Better Auth `signOut()` (server-side session delete + cookie expiry), redirects to `/login`, and protected routes stay protected.
- **Verified in a real browser** (headless Chrome, temp-dir puppeteer-core, no project deps added):
  - New nav/auth/player suite — **63/63 checks pass**: guest sees Login + Get Started (Get Started → `/discover`); admin sidebar has Home/Dashboard/Songs/Upload Song/Logout; Home → `/` (no full page reload, session intact, navbar shows Admin Dashboard + Logout, Login hidden); hero song plays on `/`; Admin Dashboard → `/admin`; Songs → `/admin/songs`; Upload Song → `/admin/upload`; user navbar shows Home/Discover/Artists/Playlists + Logout, no Login; user Home/Discover/Artists/Playlists navigate without reloads; player time advances while playing.
  - **Music really stops on logout** (both user and admin): the actual HTML5 audio element is verified `paused === true`, `currentTime === 0`, `networkState === 0` (stream released), `pause()` was invoked on the real element, and the player UI unmounts — then redirect to `/login`.
  - Logout regression suite (previous 25 checks) — **25/25 pass** (cookies cleared, get-session null, refresh stays logged out, new tab not restored, back button not restored, `/admin`+subroutes redirect to `/login`, `POST /api/songs` 401).
  - Player controls smoke test — **7/7 pass** (Play/Pause/Resume, Next, Previous, Mute/Unmute all still work; nothing broken by `stopAndResetPlayer`).
- Cleaned up stale test sessions afterwards (auth DB left tidy).
- `npm run lint` + `npm run build` clean.

### 2026-08-10 (Logout implementation)

- **Implemented proper Logout for users**: the navbar previously showed a static "Signed in" pill with no way to sign out. Added a visible **Logout** button in the Navbar for authenticated non-admin users on both desktop (right side, replacing "Signed in") and the mobile menu (`components/Navbar.jsx`). Clicking it calls the official `authClient.signOut()` (Better Auth), clears local session state, then `router.push("/login")` + `router.refresh()`.
- **Admin logout hardened** (`components/admin/AdminSidebar.jsx`): the existing sidebar Logout already used `authClient.signOut()`, but it ignored the response. It now checks the returned `error` and only redirects to `/login` when the server actually confirmed sign-out (no fake/frontend-only logout; on failure it stays put so the user can retry).
- **No second auth system, no manual cookie deletion**: both flows use Better Auth's official `POST /api/auth/sign-out` endpoint. That endpoint (confirmed in `better-auth/dist/api/routes/sign-out.mjs`) reads the signed session cookie, **deletes the session row from `vibeflow_auth.session`** (`deleteSession`), and expires the session + cookie-cache cookies (`deleteSessionCookie`). Server-side session is genuinely invalidated.
- **Verified in a real browser** (headless Chrome via temp-dir puppeteer-core, no project deps added) — **25/25 checks pass**:
  - User: Login → `/discover` → Logout button visible → Logout → `/login` → `session_token`/`session_data` cookies cleared → `/admin` redirects to `/login` → `POST /api/songs` returns 401 → `get-session` returns null.
  - Admin: Login → `/admin` → Logout in sidebar → `/login` → `/admin`, `/admin/songs`, `/admin/upload` all redirect to `/login` → `POST /api/songs` 401.
  - Refresh after logout: stays on `/login`, session not restored.
  - New tab after logout: user shows Login (no Logout) on `/discover`; admin `/admin` redirects to `/login`.
  - Browser Back button after logout: no session restored.
- **Server-side invalidation verified at the DB level**: a real browser session went from 0 rows → 1 row (after login) → 0 rows (after logout) in `vibeflow_auth.session`, proving the sign-out request (`POST /api/auth/sign-out`, `Content-Type: application/json`, body `{}`) removes the session document.
- Cleaned up all stale test session rows afterwards (auth DB left tidy).
- `npm run lint` + `npm run build` clean.

### 2026-08-10 (player Next/Previous fix)

- **Fixed bug**: the player's Next/Previous buttons appeared dead when a song was started from a song card / library row / hero. Root cause: `playSong(song)` only received the individual song, so when it wasn't already in the context `playlist` (always the case on first click — `playlist` starts empty), it built a **1-song queue** via `playAt([song], 0)`. `nextSong`/`previousSong` then computed `(index + 1) % 1` and `(index - 1 + 1) % 1` → always the same song. The wrap-around math itself was correct; the queue never had more than one song.
- **Fix** (`context/MusicPlayerContext.jsx`): `playSong(song, songs)` now accepts an optional list and seeds the queue with it (`playAt(songs, index)`) when the song is found in it, so Next/Previous navigate the visible list. Falls back to the old behavior (context playlist, then single-song) when no list is passed.
- **Callers updated** to pass their available list: `LibrarySection` → `playSong(song, filtered)` (queue follows the current search/filter view); `Hero` → `playSong(featured, songs)`; `MusicCard` gains a `playlist` prop, `FeaturedTracks` passes `songs`. `PlaylistCard` already queued correctly via `playAt(songs, 0)`.
- **Verified in a real browser** (headless Chrome, temp-dir puppeteer-core, no project deps) — **25/25 checks pass**: Next advances to the next song, Previous returns to the previous one, clicking any row sets the correct index, Next/Previous from middle works, **Next from last wraps to first**, **Previous from first wraps to last**, the new song's audio URL loads and actually plays (Pause button shown + progress advances) after every Next/Previous, hero and playlist-card flows queue correctly, and Play/Pause still work.
- Regression: search, filtering, empty states, mobile layout, playback, mute/unmute all still pass (note: the library now holds 11 songs — the earlier 10 seeds plus a user-uploaded test song — so old "10 rows" assertions in temp tests were updated to be dynamic).
- `npm run lint` + `npm run build` clean.

### 2026-08-10 (in-browser QA)

- Added the **Music Library section to the landing page** (`app/page.js`). PRD §5 lists Music Library as a landing-page section, but it only existed on `/discover`. Extracted the searchable library into a reusable `components/LibrarySection.jsx` (`embedded` prop for section vs. page heading); `components/MusicLibrary.jsx` now wraps it for `/discover`.
- **Verified search + genre filtering in a real browser** (headless Chrome via puppeteer-core, temp-dir only, no project deps added) — 22/22 checks:
  - `/discover` shows 10 rows; search "luna" → 2 Luna Ray rows; no-match search → `No music found for "zzzzznope"`; clearing restores all.
  - Genre filters Rock→1 (Electric Hearts), Electronic→2, All→10; `?q=ocean` URL param filters to 2.
  - Home page shows all 5 PRD sections (Hero/Featured/Artists/Playlists/Library) and the embedded library search works.
  - Mobile (375px): 10 rows render, no horizontal overflow, hamburger visible; desktop: hamburger hidden.
- **Verified music player end-to-end in-browser** — 8/8 checks: clicking a song shows the player with the right title, audio actually plays (progress advanced), pause/resume, next (title changes), mute/unmute.
- `npm run lint` + `npm run build` clean after the refactor.

### 2026-08-10

- **Fixed critical bug**: Cloudinary uploads hung indefinitely (`HTTP 000`). Root cause: cloudinary 2.10.0's `v2.uploader` wraps methods via `v1_adapters` (`lib/v2/uploader.js`), so `upload_stream` expects `(options, callback)` and invokes the callback as `(error, result)` — not `(callback, options)` as the app called it. The user callback was treated as options and never fired, so the wrapping promise never resolved. Fixed `lib/cloudinary.js` to use the raw v1 uploader (default export) with the documented signatures `upload_stream(callback, options)` and `destroy(public_id, callback, options)`.
- **Fixed bug**: `POST /api/upload` returned 500 instead of 400 when the body was missing/not multipart form data (`request.formData()` throws). Added a guarded parse that returns the friendly 400.
- **Verified end-to-end (26/26 checks passing)** against live MongoDB + Cloudinary:
  - `GET /api/songs` returns 10 seeded songs across all 6 genres; `GET /api/songs/[id]` returns a single song; invalid id → 400, unknown id → 404.
  - `POST /api/upload` validates file types (invalid audio/cover → 400) and returns `audioUrl`/`coverUrl`/public IDs/duration.
  - `POST /api/songs` creates (201); missing required fields → 400.
  - `PATCH /api/songs/[id]` metadata updates work; empty title → 400.
  - `PATCH` file replacement uploads new files and **deletes the replaced audio+cover from Cloudinary** (verified `not found`).
  - `DELETE` removes the song from MongoDB (404 after) and **deletes audio+cover from Cloudinary** (verified `not found`).
- Verified `npm run lint` and `npm run build` are clean; all public + admin routes return 200; `POST /api/seed` correctly returns 409 when songs already exist.
- Cleaned up all temporary test songs and Cloudinary test assets (folders are empty again).

### 2026-08-09

- Created Next.js 16 project with JavaScript + Tailwind CSS v4
- Installed mongoose, cloudinary, lucide-react
- Built complete public UI (navbar, hero, featured, artists, playlists, library)
- Built music player architecture (context + fixed bottom player)
- Built MongoDB layer (model, connection, server helpers)
- Built Cloudinary layer (config, upload, delete helpers)
- Built all API route handlers
- Built admin dashboard (overview, songs, upload, artists, playlists, settings)
- Added seed endpoint + sample data for testing without manual uploads

## Bugs

- Fixed 2026-08-10: Cloudinary uploads hung (v2 adapter signature mismatch) — resolved by using the raw v1 uploader in `lib/cloudinary.js`.
- Fixed 2026-08-10: `POST /api/upload` returned 500 for non-multipart bodies — now returns a clear 400.
- Fixed 2026-08-10: player Next/Previous appeared broken when starting from a song card/row/hero — `playSong` only ever built a 1-song queue; it now accepts the surrounding list and seeds the playlist so Next/Previous cycle through the songs (with correct wrap-around at both ends).
- Fixed 2026-08-10: no working Logout for authenticated users — the navbar showed "Signed in" with no action. Added a Logout button (desktop + mobile) using the existing Better Auth `authClient.signOut()`, and hardened the admin sidebar logout to verify the server response before redirecting.
- Fixed 2026-08-10: auth seed script operated on a phantom user id — Better Auth's Mongo adapter stores the user id as `_id` (ObjectId, no string `id` field) and `signUpEmail` returns a mismatched `user.id`; `account`/`session` `userId` are ObjectIds. The script now keys off `email`/`_id`, signs in with the configured password to detect stale credentials, and recreates the account only when the configured password no longer works.
- No known bugs remaining.

## Technical Decisions

- Next.js App Router (Next 16.3) with JavaScript — no TypeScript
- Tailwind CSS v4 (CSS-first config in globals.css)
- Cloudinary for audio (resource_type video) + cover (resource_type image) storage
- Cloudinary SDK used via the raw v1 uploader (default export), not `v2`: v2's `v1_adapters` reorder `upload_stream`/`destroy` args and the app's callback-first calls hung. v1 signatures: `upload_stream(callback, options)` / `destroy(public_id, callback, options)`.
- MongoDB (Mongoose 9) stores only metadata + Cloudinary URLs + public IDs
- MusicPlayerContext manages player state; single shared Audio element; auto-next via `ended` event
- Likes stored in localStorage (client-side only)
- Artists and playlists derived from song data (no separate collections)
- Sample seed data uses SoundHelix MP3 URLs + generated gradient covers (no Cloudinary files needed for seeds)
- CoverImage falls back to a purple/pink gradient with the title initial when no coverUrl exists
- `.env.local` is git-ignored; secrets never enter source code or PROGRESS.md
- Server-side Cloudinary operations only (secrets never sent to the client)
- Auth via **Better Auth 1.6.26** (single system): `lib/auth.js` (server, Mongo adapter + `role` additional field), `lib/auth-client.js` (`createAuthClient`, resolves base URL from `window.location.origin`), `app/api/auth/[...all]/route.js`. Admin routes/APIs guarded by `requireAdmin` / the `/admin` layout. Logout uses the official `authClient.signOut()` — never manual cookie deletion or frontend-only state. `role` has `input: false` + `defaultValue: "user"`, so public signup can never create an admin.
- Auth seed accounts (`npm run seed:admin`) are created from env only: `ADMIN_NAME`/`ADMIN_EMAIL`/`ADMIN_PASSWORD` (role `admin`) and `USER_EMAIL`/`USER_PASSWORD` (role `user`), read solely from `process.env` (loaded from `.env.local`).
- Navbar/account area is session-driven via `authClient.getSession()` (with a `checkingSession` gate to avoid flashing Login to authenticated users); admin ↔ public navigation uses Next `<Link>` client-side navigation (no page reloads).
- MusicPlayerContext exposes `stopAndResetPlayer()` — pauses the real HTML5 audio, zeroes `currentTime`, removes `src` + `load()` (releases the stream, `networkState` 0), and clears all player state. Both logout handlers call it before sign-out so no audio keeps playing after logout.

## Notes

- Next.js 16 breaking changes applied: async `params`/`searchParams`, remote image patterns for `res.cloudinary.com`, ESLint CLI instead of `next lint`.
- Run with `npm run dev`. `.env.local` is configured (Cloudinary + MongoDB). Sample data already seeded (10 songs); `POST /api/seed` returns 409 until the DB is emptied.
- Full upload → create → edit (metadata + file replacement) → delete flow verified against live Cloudinary + MongoDB (see Recent Changes).

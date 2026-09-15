# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Next.js dev server (Turbopack) at localhost:3000
npm run build        # production build (needs a reachable Supabase — pages prerender from the DB)
npm run db:migrate   # apply supabase/migrations/*.sql via DATABASE_URL (tracks applied files in _migrations)
npm run db:seed      # one-off: upsert the original six books + covers into Supabase
npx tsx --env-file=.env.local scripts/backfill-words.mjs <slug> <pdf>   # fill page words/positions for an already-uploaded book
npx tsx --env-file=.env.local scripts/narrate-book.mts <slug> <voice>   # (re)generate Google TTS narration for a book
npx tsc --noEmit     # type check (there is no eslint config; `next lint` is unconfigured)
```

Env vars are documented in `.env.example`. Nothing runs without `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SECRET_KEY` and the Clerk keys.

## Architecture

Marketing + reading site for children's-book publisher Books by Tama. Next.js 15 App Router, React 19, Tailwind v4, Clerk (auth), Supabase (Postgres + Storage), Upstash Redis (rate limits). Deployed on Vercel.

**Data lives in Supabase, never in code.** Books, series, page images, users, child profiles, shelves and starter-pack downloads are tables defined in `supabase/migrations/`. Add a new migration file (sequential prefix) rather than editing an applied one.

**All Supabase access is server-side with the secret key** (`lib/supabase/admin.ts`). The browser never holds a Supabase key; RLS is on with no anon policies. Storage buckets: `covers` (public), `pages` and `downloads` (private, served via short-lived signed URLs). Because of this, any component that touches `lib/db/*` must be a server component or a server action — the `server-only` import enforces it.

**Auth model** (`lib/auth.ts`): Clerk holds the parent/teacher account; `ensureUser()` lazily upserts a row in `users` (works without the webhook). Admin = Clerk `publicMetadata.role === 'admin'`, checked by `isAdmin()`/`requireAdmin()`. Child "profiles" are rows under a user, never Clerk accounts; the active profile is a cookie (`lib/profile-cookie.ts`). Middleware only establishes the session — pages guard themselves with `requireUser`/`requireAdmin`.

**Reader pipeline**: admin uploads a PDF at `/admin/books/[id]`; `components/admin/pdf-uploader.tsx` converts pages to WebP *in the browser* with pdf.js and PUTs them to signed upload URLs (server actions in `app/admin/actions.ts` mint URLs and record `book_pages`). `/read/[slug]` computes how many pages the viewer may see (`allowedPages()` — `preview_pages` for everyone; full book gated behind `member_reading_enabled`, unused until subscriptions exist) and passes signed page URLs to the client `BookReader`.

**Read-aloud**: at upload the browser also extracts each page's words + boxes (`lib/pdf-words.ts`) into `book_pages.words`. Admin's narration panel calls Google Cloud TTS per page (`lib/tts.ts`, Neural2 en-AU voices — only these return per-word timings) and stores MP3s in the private `audio` bucket with `timings`. The reader plays them through Web Audio (iOS allows follow-on pages that way) and lights `words` boxes on the artwork.

**Route groups**: `app/(marketing)` = public site + `/account/*` (shares header/footer/mobile tab bar); `app/(auth)` = Clerk sign-in/up with its own split layout; `app/read` = full-screen reader, no chrome; `app/admin` = sidebar layout, admin-only.

**Styling**: design tokens are Tailwind theme colours in `app/globals.css` (`royal`, `ocean`, `sun`, `tangerine`, `sand`, …) plus `btn-*`, `field`, `card-float`, `wrapper` utilities. Headings are Fredoka, body Quicksand. `components/ui/` is shadcn-generated; prefer the custom utilities for site UI.

Deferred work is tracked in `BACKLOG.md`; the owner-facing overview of services, storage and flows is `ARCHITECTURE.md`.

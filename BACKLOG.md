# Backlog

Items deferred from the 2026-09 rebuild. Not scheduled.

## Content / marketing

- **Starter pack contents** — decide what the free sign-up pack actually contains. Mockup placeholder: A3 Coral Cove poster (PDF), 6 colouring pages (one per book), treasure-map reading tracker. Needs real PDFs uploaded via admin.
- **Old treasure-hunt activities page** removed 2026-09-15 (`/activities` redirects to `/colouring`). The set-a/set-b page images remain in `public/assets/images` if ever needed.
- **Colouring books placement** — they currently sit under "Read"/Books alongside the picture books. Find a better home (own top-level section? "Print & colour"?).

## Navigation

- **Teachers & Schools in top nav** — currently footer-only. Promote to the main nav once there's a real page behind it (bulk orders, classroom packs, teacher resources). Not for this build.

## Reading experience

- **Read-aloud narration** — audio per book with word highlighting. The strongest kid-facing feature and the intended subscription hook; needs recorded audio per title.
- **Page-curl animation** — shipped 2026-09-15 (tap, swipe, arrows, drag-the-corner). Demo: https://claude.ai/code/artifact/765739dc-6cfc-47bb-8a58-af24c4f2706c
- **Account / welcome area redesign** — owner isn't happy with the look and feel; revisit on the mockup canvas.

## Later phases (already agreed, not yet scheduled)

- Full-book reading for logged-in members.
- Monthly subscription via Stripe (schema + Clerk webhook sync are in place; no payment UI).
- Activities / learning section tied to books.
- Upgrade Clerk dev instance to production; move to new GitHub + Vercel accounts.

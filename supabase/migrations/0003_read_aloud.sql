alter table book_pages
  add column if not exists text text,
  add column if not exists words jsonb,          -- [{t, l, w, top, h}] positions as % of the page
  add column if not exists audio_path text,      -- audio bucket
  add column if not exists timings jsonb;        -- [seconds] one per word, aligned with `words`

alter table books
  add column if not exists narration_voice text,
  add column if not exists read_aloud_enabled boolean not null default false;

insert into storage.buckets (id, name, public) values ('audio', 'audio', false) on conflict (id) do nothing;

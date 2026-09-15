-- Words the narrator mispronounces, and how to say them. `say_as` is either plain
-- "sounds like" spelling, or IPA wrapped in slashes (e.g. /ˈtʃʌkəld/).
create table if not exists pronunciations (
  word text primary key,
  say_as text not null,
  created_at timestamptz not null default now()
);
alter table pronunciations enable row level security;
grant all on pronunciations to service_role;

insert into pronunciations (word, say_as) values ('chuckled', '/ˈtʃʌkəld/') on conflict (word) do nothing;

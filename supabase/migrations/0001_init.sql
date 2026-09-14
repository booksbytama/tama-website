create extension if not exists "pgcrypto";

create table if not exists series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  book_type text not null default 'picture' check (book_type in ('picture', 'colouring')),
  series_id uuid references series(id) on delete set null,
  series_order int,
  ages_text text,
  cover_path text,
  page_count int not null default 0,
  preview_pages int not null default 0,
  is_listed boolean not null default false,
  sample_enabled boolean not null default true,
  member_reading_enabled boolean not null default false,
  buy_links jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists book_pages (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  page_number int not null,
  storage_path text not null,
  width int,
  height int,
  created_at timestamptz not null default now(),
  unique (book_id, page_number)
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null unique,
  email text,
  display_name text,
  role text not null default 'parent' check (role in ('parent', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  age int check (age between 0 and 18),
  colour text not null default 'yellow',
  is_grown_up boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists profiles_user_idx on profiles(user_id);

create table if not exists shelf_items (
  profile_id uuid not null references profiles(id) on delete cascade,
  book_id uuid not null references books(id) on delete cascade,
  last_page int not null default 1,
  updated_at timestamptz not null default now(),
  primary key (profile_id, book_id)
);

create table if not exists subscriptions (
  user_id uuid primary key references users(id) on delete cascade,
  status text not null default 'none' check (status in ('none', 'trialing', 'active', 'past_due', 'canceled')),
  provider text,
  provider_ref text,
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  storage_path text not null,
  sort_order int not null default 0,
  is_listed boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists books_updated_at on books;
create trigger books_updated_at before update on books for each row execute function set_updated_at();
drop trigger if exists users_updated_at on users;
create trigger users_updated_at before update on users for each row execute function set_updated_at();

-- All app access goes through the server with the secret (service-role) key.
-- RLS stays on with no anon/authenticated policies so the anon key can read nothing.
alter table series enable row level security;
alter table books enable row level security;
alter table book_pages enable row level security;
alter table users enable row level security;
alter table profiles enable row level security;
alter table shelf_items enable row level security;
alter table subscriptions enable row level security;
alter table downloads enable row level security;

-- Storage buckets
insert into storage.buckets (id, name, public) values ('covers', 'covers', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('pages', 'pages', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('downloads', 'downloads', false) on conflict (id) do nothing;

drop policy if exists "covers are public" on storage.objects;
create policy "covers are public" on storage.objects for select using (bucket_id = 'covers');

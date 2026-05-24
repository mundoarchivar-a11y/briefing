-- Paste this in Supabase → SQL Editor → New query → Run
create extension if not exists "pgcrypto";

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  source_url text unique not null,
  source_name text,
  cat text not null,
  cat_color text,
  headline text not null,
  summary text,
  why_it_matters text,
  importance int default 50,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists articles_published_idx on articles (published_at desc);
create index if not exists articles_cat_idx on articles (cat);

alter table articles enable row level security;

drop policy if exists "public read" on articles;
create policy "public read" on articles for select using (true);

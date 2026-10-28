create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.contacts (
  id            uuid primary key default gen_random_uuid(),
  platform      text not null,
  label_en      text not null,
  label_th      text,
  url           text not null,
  icon          text,
  sort_order    int  not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title_en        text not null,
  title_th        text,
  summary_en      text,                      -- short card text
  summary_th      text,
  description_en  text,                      -- long text / markdown
  description_th  text,
  cover_url       text,
  images          text[] not null default '{}',
  tech_stack      text[] not null default '{}',
  repo_url        text,
  demo_url        text,
  started_on      date,
  ended_on        date,
  is_featured     boolean not null default false,
  sort_order      int  not null default 0,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index projects_listing_idx
  on public.projects (sort_order, started_on desc)
  where is_published;

-- ---------------------------------------------------------------------------
-- achievements: certificates and trophies in one table, split by kind
-- ---------------------------------------------------------------------------
create type public.achievement_kind as enum ('certificate', 'trophy');

create table public.achievements (
  id              uuid primary key default gen_random_uuid(),
  kind            public.achievement_kind not null,
  title_en        text not null,
  title_th        text,
  description_en  text,
  description_th  text,
  issuer          text,                      -- organisation / event name
  awarded_on      date,
  expires_on      date,                      -- certificates only
  credential_id   text,                      -- certificates only
  credential_url  text,                      -- verification link
  image_url       text,
  sort_order      int  not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index achievements_listing_idx
  on public.achievements (kind, awarded_on desc)
  where is_published;

-- ---------------------------------------------------------------------------
-- posts: blog
-- ---------------------------------------------------------------------------
create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title_en      text not null,
  title_th      text,
  excerpt_en    text,
  excerpt_th    text,
  content_en    text,                        -- markdown
  content_th    text,
  cover_url     text,
  tags          text[] not null default '{}',
  published_at  timestamptz,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index posts_listing_idx
  on public.posts (published_at desc)
  where is_published;

create index posts_tags_idx on public.posts using gin (tags);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create trigger contacts_set_updated_at
  before update on public.contacts
  for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create trigger achievements_set_updated_at
  before update on public.achievements
  for each row execute function public.set_updated_at();

create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: public can read published rows only
-- ---------------------------------------------------------------------------
alter table public.contacts     enable row level security;
alter table public.projects     enable row level security;
alter table public.achievements enable row level security;
alter table public.posts        enable row level security;

create policy "public read published" on public.contacts
  for select to anon, authenticated using (is_published);

create policy "public read published" on public.projects
  for select to anon, authenticated using (is_published);

create policy "public read published" on public.achievements
  for select to anon, authenticated using (is_published);

create policy "public read published" on public.posts
  for select to anon, authenticated
  using (is_published and (published_at is null or published_at <= now()));

-- ---------------------------------------------------------------------------
-- Storage: public bucket for images (covers, certificates, ...)
-- Upload through the dashboard; anyone can read.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Grants: "Automatically expose new tables" is off, so the Data API roles
-- need explicit read access. RLS above still limits rows to published ones.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.contacts     to anon, authenticated;
grant select on public.projects     to anon, authenticated;
grant select on public.achievements to anon, authenticated;
grant select on public.posts        to anon, authenticated;

-- ---------------------------------------------------------------------------
-- profile: single-row site owner info (phone is intentionally not stored)
-- ---------------------------------------------------------------------------
create table public.profile (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique default 'main',
  full_name_en  text not null,
  full_name_th  text,
  headline_en   text,
  headline_th   text,
  location_en   text,
  location_th   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- skill_groups: one row per group, items kept as a text[]
-- ---------------------------------------------------------------------------
create table public.skill_groups (
  id            uuid primary key default gen_random_uuid(),
  label_en      text not null,
  label_th      text,
  items         text[] not null default '{}',
  sort_order    int  not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- experiences: ended_on null = current job
-- ---------------------------------------------------------------------------
create table public.experiences (
  id            uuid primary key default gen_random_uuid(),
  company_en    text not null,
  company_th    text,
  location_en   text,
  location_th   text,
  position_en   text not null,
  position_th   text,
  team_en       text,
  team_th       text,
  started_on    date not null,
  ended_on      date,
  tech_stack    text[] not null default '{}',
  bullets_en    text[] not null default '{}',
  bullets_th    text[] not null default '{}',
  sort_order    int  not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index experiences_listing_idx
  on public.experiences (started_on desc)
  where is_published;

-- ---------------------------------------------------------------------------
-- education
-- ---------------------------------------------------------------------------
create table public.education (
  id              uuid primary key default gen_random_uuid(),
  institution_en  text not null,
  institution_th  text,
  location_en     text,
  location_th     text,
  degree_en       text not null,
  degree_th       text,
  started_on      date,
  ended_on        date,
  gpax            text,
  bullets_en      text[] not null default '{}',
  bullets_th      text[] not null default '{}',
  sort_order      int  not null default 0,
  is_published    boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create trigger profile_set_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

create trigger skill_groups_set_updated_at
  before update on public.skill_groups
  for each row execute function public.set_updated_at();

create trigger experiences_set_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

create trigger education_set_updated_at
  before update on public.education
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security + grants (same pattern as 0001)
-- ---------------------------------------------------------------------------
alter table public.profile      enable row level security;
alter table public.skill_groups enable row level security;
alter table public.experiences  enable row level security;
alter table public.education    enable row level security;

create policy "public read" on public.profile
  for select to anon, authenticated using (true);

create policy "public read published" on public.skill_groups
  for select to anon, authenticated using (is_published);

create policy "public read published" on public.experiences
  for select to anon, authenticated using (is_published);

create policy "public read published" on public.education
  for select to anon, authenticated using (is_published);

grant select on public.profile      to anon, authenticated;
grant select on public.skill_groups to anon, authenticated;
grant select on public.experiences  to anon, authenticated;
grant select on public.education    to anon, authenticated;

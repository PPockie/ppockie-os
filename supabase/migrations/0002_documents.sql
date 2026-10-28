create table public.documents (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null check (kind in ('resume', 'cv')),
  locale        text not null check (locale in ('en', 'th')),
  title         text,
  file_path     text not null,
  download_name text,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (kind, locale)
);

create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

alter table public.documents enable row level security;

create policy "public read published" on public.documents
  for select to anon, authenticated using (is_published);

grant select on public.documents to anon, authenticated;

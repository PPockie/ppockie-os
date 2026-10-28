-- ---------------------------------------------------------------------------
-- skills: one row per skill, inside a skill_groups row.
-- icon is the slug of a logo in @iconify-react/logos (e.g. 'typescript-icon');
-- null falls back to the skill's initials in the UI.
-- ---------------------------------------------------------------------------
create table public.skills (
  id            uuid primary key default gen_random_uuid(),
  group_id      uuid not null references public.skill_groups (id) on delete cascade,
  name          text not null,
  icon          text,
  sort_order    int  not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (group_id, name)
);

create index skills_group_idx on public.skills (group_id, sort_order);

create trigger skills_set_updated_at
  before update on public.skills
  for each row execute function public.set_updated_at();

alter table public.skills enable row level security;

create policy "public read published" on public.skills
  for select to anon, authenticated using (is_published);

grant select on public.skills to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Move the existing skill_groups.items into skills, keeping their order.
-- ---------------------------------------------------------------------------
insert into public.skills (group_id, name, sort_order)
select g.id, i.name, i.ord
from public.skill_groups g
cross join lateral unnest(g.items) with ordinality as i(name, ord);

-- Fill in icons by matching the name with everything but letters/digits removed.
update public.skills s
set icon = m.icon
from (values
  ('typescript',      'typescript-icon'),
  ('javascript',      'javascript'),
  ('html',            'html-5'),
  ('css',             'css-3'),
  ('react',           'react'),
  ('reactnative',     'react'),
  ('nextjs',          'nextjs-icon'),
  ('tailwindcss',     'tailwindcss-icon'),
  ('nodejs',          'nodejs-icon'),
  ('fastify',         'fastify-icon'),
  ('prisma',          'prisma'),
  ('drizzleorm',      'drizzle-icon'),
  ('postgresql',      'postgresql'),
  ('redis',           'redis'),
  ('docker',          'docker-icon'),
  ('git',             'git-icon'),
  ('github',          'github-icon'),
  ('githubactions',   'github-actions'),
  ('vercel',          'vercel-icon'),
  ('cloudflarepages', 'cloudflare-icon'),
  ('ubuntuvps',       'ubuntu'),
  ('figma',           'figma'),
  ('wordpress',       'wordpress-icon'),
  ('powerbi',         'microsoft-power-bi')
) as m(key, icon)
where lower(regexp_replace(s.name, '[^a-zA-Z0-9]', '', 'g')) = m.key;

-- The items are copied; the array column is no longer the source of truth.
alter table public.skill_groups drop column items;

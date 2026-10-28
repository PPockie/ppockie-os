-- ---------------------------------------------------------------------------
-- achievements.tools: the tools used for the work, kept apart from the
-- description so the achievement card can show them as chips.
-- ---------------------------------------------------------------------------
alter table public.achievements
  add column tools text[] not null default '{}';

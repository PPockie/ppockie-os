-- ---------------------------------------------------------------------------
-- achievements.position_*: the role I held in the work (e.g. "Developer",
-- "UI Designer"), shown in the achievement detail modal. Null hides the row.
-- ---------------------------------------------------------------------------
alter table public.achievements
  add column position_en text,
  add column position_th text;

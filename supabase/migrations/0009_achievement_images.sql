-- ---------------------------------------------------------------------------
-- achievements.images: extra pictures for the gallery in the achievement
-- detail modal. image_url stays the cover and is shown first.
-- ---------------------------------------------------------------------------
alter table public.achievements
  add column images text[] not null default '{}';

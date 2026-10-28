-- ---------------------------------------------------------------------------
-- skills.level: how strong I am with a skill, 0-100. The About window shows
-- the average per skill group as a ring; null means "not rated" and is left
-- out of the average.
-- profile.bio_*: short bio shown under the name in the About window; falls
-- back to headline when empty.
-- ---------------------------------------------------------------------------
alter table public.skills
  add column level smallint check (level between 0 and 100);

alter table public.profile
  add column bio_en text,
  add column bio_th text;

-- ---------------------------------------------------------------------------
-- Regroup skills by position instead of by kind of tool.
--   Front-end | Back-end | DevOps | Design, CMS & BI
-- The old "Languages" group is dissolved: HTML, CSS, JavaScript and TypeScript
-- go to Front-end, and JavaScript and TypeScript are also copied to Back-end,
-- since each position gets its own rating (see skills.level, migration 0005).
-- Safe to run once; it does nothing when there is no "Languages" group.
-- ---------------------------------------------------------------------------
do $$
declare
  langs   uuid := (select id from public.skill_groups where label_en = 'Languages');
  front   uuid := (select id from public.skill_groups where label_en = 'Frontend');
  back    uuid := (select id from public.skill_groups where label_en = 'Backend & Database');
begin
  if langs is null or front is null or back is null then
    return;
  end if;

  -- Make room at the top of Front-end and Back-end for the language skills.
  update public.skills set sort_order = sort_order + 4 where group_id = front;
  update public.skills set sort_order = sort_order + 2 where group_id = back;

  insert into public.skills (group_id, name, icon, level, sort_order)
  select front, name, icon, level, sort_order from public.skills where group_id = langs;

  insert into public.skills (group_id, name, icon, level, sort_order)
  select back, name, icon, level, case name when 'TypeScript' then 1 else 2 end
  from public.skills
  where group_id = langs and name in ('TypeScript', 'JavaScript');

  delete from public.skill_groups where id = langs;

  update public.skill_groups set label_en = 'Front-end', label_th = 'Front-end', sort_order = 1 where id = front;
  update public.skill_groups set label_en = 'Back-end',  label_th = 'Back-end',  sort_order = 2 where id = back;
  update public.skill_groups set label_en = 'DevOps',    label_th = 'DevOps',    sort_order = 3 where label_en = 'DevOps & Tools';
  update public.skill_groups set sort_order = 4 where label_en = 'Design, CMS & BI';
end $$;

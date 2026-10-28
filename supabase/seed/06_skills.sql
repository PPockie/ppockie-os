-- skill_groups + skills: needs migrations 0003 and 0004.
-- For a FRESH database only. If 0004 already moved your existing skills, do not run this.
-- Run once; there is no unique key on groups, so a second run would duplicate them.
with g as (
  insert into public.skill_groups (label_en, label_th, sort_order)
  values
    ('Front-end',        'Front-end',            1),
    ('Back-end',         'Back-end',             2),
    ('DevOps',           'DevOps',               3),
    ('Design, CMS & BI', 'ออกแบบ CMS และ BI',    4)
  returning id, label_en
)
insert into public.skills (group_id, name, icon, sort_order)
select g.id, s.name, s.icon, s.ord
from g
join (values
  ('Front-end',        'HTML',             'html-5',             1),
  ('Front-end',        'CSS',              'css-3',              2),
  ('Front-end',        'JavaScript',       'javascript',         3),
  ('Front-end',        'TypeScript',       'typescript-icon',    4),
  ('Front-end',        'React',            'react',              5),
  ('Front-end',        'Next.js',          'nextjs-icon',        6),
  ('Front-end',        'Tailwind CSS',     'tailwindcss-icon',   7),
  ('Front-end',        'React Native',     'react',              8),
  ('Front-end',        'NativeWind',       null,                 9),
  ('Back-end',         'TypeScript',       'typescript-icon',    1),
  ('Back-end',         'JavaScript',       'javascript',         2),
  ('Back-end',         'Node.js',          'nodejs-icon',        3),
  ('Back-end',         'Express.js',       null,                 4),
  ('Back-end',         'Fastify',          'fastify-icon',       5),
  ('Back-end',         'REST API',         null,                 6),
  ('Back-end',         'Prisma',           'prisma',             7),
  ('Back-end',         'Drizzle ORM',      'drizzle-icon',       8),
  ('Back-end',         'PostgreSQL',       'postgresql',         9),
  ('Back-end',         'Redis',            'redis',             10),
  ('DevOps',           'Docker',           'docker-icon',        1),
  ('DevOps',           'Github',           'github-icon',        2),
  ('DevOps',           'GitHub Actions',   'github-actions',     3),
  ('DevOps',           'Vercel',           'vercel-icon',        4),
  ('DevOps',           'Cloudflare Pages', 'cloudflare-icon',    5),
  ('DevOps',           'Ubuntu VPS',       'ubuntu',             6),
  ('Design, CMS & BI', 'Figma',            'figma',              1),
  ('Design, CMS & BI', 'WordPress',        'wordpress-icon',     2),
  ('Design, CMS & BI', 'Directus',         null,                 3),
  ('Design, CMS & BI', 'Power BI',         'microsoft-power-bi', 4),
  ('Design, CMS & BI', 'DAX',              null,                 5)
) as s(group_label, name, icon, ord) on s.group_label = g.label_en;

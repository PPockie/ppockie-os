insert into public.documents (kind, locale, title, file_path, download_name, is_published)
values
  ('cv', 'en', 'CV (English)', 'documents/cv-en.pdf', 'Thanawat-Rojchanatimapong-CV-EN.pdf', false),
  ('cv', 'th', 'CV (ไทย)',     'documents/cv-th.pdf', 'Thanawat-Rojchanatimapong-CV-TH.pdf', false)
on conflict (kind, locale) do update set
  title         = excluded.title,
  file_path     = excluded.file_path,
  download_name = excluded.download_name;

import { supabase } from "./client";
import type {
  AchievementKind,
  AchievementRow,
  ContactRow,
  DocumentRow,
  EducationRow,
  ExperienceRow,
  PostRow,
  ProfileRow,
  ProjectRow,
  SkillGroupWithSkillsRow,
} from "./types";

export type Locale = "en" | "th";

// Pick the `<field>_<locale>` column, falling back to English when Thai is empty.
function pick<T extends object>(row: T, field: string, locale: Locale) {
  const r = row as Record<string, unknown>;
  return (r[`${field}_${locale}`] ?? r[`${field}_en`] ?? null) as string | null;
}

/**
 * Rows are typed by hand in the dashboard, so make the link usable as written:
 * "me@x.com" becomes mailto:, and a bare "www.x.com/y" gets https://.
 */
export function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return url;
  if (url.includes("@") && !url.includes("/")) return `mailto:${url}`;
  return `https://${url.replace(/^\/\//, "")}`;
}

function unwrap<T>(data: T[] | null, error: { message: string } | null): T[] {
  if (error) throw new Error(error.message);
  return data ?? [];
}

export type Contact = Awaited<ReturnType<typeof getContacts>>[number];

export async function getContacts(locale: Locale) {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("sort_order");
  return unwrap<ContactRow>(data, error).map((c) => ({
    id: c.id,
    platform: c.platform,
    label: pick(c, "label", locale) as string,
    url: normalizeUrl(c.url),
    icon: c.icon,
  }));
}

// Thai bullets can be empty while English is filled in; fall back per row.
function pickList(row: object, field: string, locale: Locale): string[] {
  const r = row as Record<string, string[] | undefined>;
  const list = r[`${field}_${locale}`];
  return list?.length ? list : (r[`${field}_en`] ?? []);
}

export type Profile = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

export async function getProfile(locale: Locale) {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("slug", "main")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const p = data as ProfileRow;
  return {
    fullName: pick(p, "full_name", locale) as string,
    headline: pick(p, "headline", locale),
    bio: pick(p, "bio", locale),
    location: pick(p, "location", locale),
  };
}

export type SkillGroup = Awaited<ReturnType<typeof getSkillGroups>>[number];

export async function getSkillGroups(locale: Locale) {
  const { data, error } = await supabase
    .from("skill_groups")
    .select("*, skills(*)")
    .order("sort_order")
    .order("sort_order", { referencedTable: "skills" });
  return unwrap<SkillGroupWithSkillsRow>(data, error).map((g) => ({
    id: g.id,
    label: pick(g, "label", locale) as string,
    skills: g.skills.map((s) => ({ id: s.id, name: s.name, icon: s.icon, level: s.level ?? null })),
  }));
}

export type Experience = Awaited<ReturnType<typeof getExperiences>>[number];

export async function getExperiences(locale: Locale) {
  const { data, error } = await supabase
    .from("experiences")
    .select("*")
    .order("started_on", { ascending: false });
  return unwrap<ExperienceRow>(data, error).map((e) => ({
    id: e.id,
    company: pick(e, "company", locale) as string,
    location: pick(e, "location", locale),
    position: pick(e, "position", locale) as string,
    team: pick(e, "team", locale),
    startedOn: e.started_on,
    endedOn: e.ended_on,
    techStack: e.tech_stack,
    bullets: pickList(e, "bullets", locale),
  }));
}

export type Education = Awaited<ReturnType<typeof getEducation>>[number];

export async function getEducation(locale: Locale) {
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("started_on", { ascending: false });
  return unwrap<EducationRow>(data, error).map((e) => ({
    id: e.id,
    institution: pick(e, "institution", locale) as string,
    location: pick(e, "location", locale),
    degree: pick(e, "degree", locale) as string,
    startedOn: e.started_on,
    endedOn: e.ended_on,
    gpax: e.gpax,
    bullets: pickList(e, "bullets", locale),
  }));
}

// Bare storage paths go through `/files` (see next.config.ts); full URLs and rooted paths are left alone.
const mediaUrl = (src: string) => (/^(https?:)?\/\/|^\//.test(src) ? src : `/files/${src}`);

export type Project = Awaited<ReturnType<typeof getProjects>>[number];

export async function getProjects(locale: Locale) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order")
    .order("started_on", { ascending: false });
  return unwrap<ProjectRow>(data, error).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: pick(p, "title", locale) as string,
    summary: pick(p, "summary", locale),
    description: pick(p, "description", locale),
    coverUrl: p.cover_url && mediaUrl(p.cover_url),
    images: [...new Set((p.images ?? []).filter(Boolean).map(mediaUrl))],
    techStack: p.tech_stack,
    repoUrl: p.repo_url,
    demoUrl: p.demo_url,
    startedOn: p.started_on,
    endedOn: p.ended_on,
    isFeatured: p.is_featured,
  }));
}

export type Achievement = Awaited<ReturnType<typeof getAchievements>>[number];

export async function getAchievements(locale: Locale, kind?: AchievementKind) {
  let query = supabase
    .from("achievements")
    .select("*")
    .order("awarded_on", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  return unwrap<AchievementRow>(data, error).map((a) => ({
    id: a.id,
    kind: a.kind,
    title: pick(a, "title", locale) as string,
    description: pick(a, "description", locale),
    issuer: a.issuer,
    position: pick(a, "position", locale),
    awardedOn: a.awarded_on,
    expiresOn: a.expires_on,
    credentialId: a.credential_id,
    credentialUrl: a.credential_url,
    imageUrl: a.image_url && mediaUrl(a.image_url),
    images: [...new Set((a.images ?? []).filter(Boolean).map(mediaUrl))],
    tools: a.tools ?? [],
  }));
}

export async function getPosts(locale: Locale) {
  const { data, error } = await supabase
    .from("posts")
    .select("id, slug, title_en, title_th, excerpt_en, excerpt_th, cover_url, tags, published_at")
    .order("published_at", { ascending: false });
  return unwrap(data as Partial<PostRow>[] | null, error).map((p) => ({
    id: p.id as string,
    slug: p.slug as string,
    title: pick(p, "title", locale) as string,
    excerpt: pick(p, "excerpt", locale),
    coverUrl: p.cover_url ?? null,
    tags: p.tags ?? [],
    publishedAt: p.published_at ?? null,
  }));
}

export async function getPost(slug: string, locale: Locale) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const p = data as PostRow;
  return {
    id: p.id,
    slug: p.slug,
    title: pick(p, "title", locale) as string,
    excerpt: pick(p, "excerpt", locale),
    content: pick(p, "content", locale),
    coverUrl: p.cover_url,
    tags: p.tags,
    publishedAt: p.published_at,
  };
}

/**
 * Finds a published resume/cv for the locale (falling back to English) and
 * returns a link to view it and one that forces a download.
 */
export type DocumentLink = NonNullable<Awaited<ReturnType<typeof getDocument>>>;

export async function getDocument(kind: DocumentRow["kind"], locale: Locale) {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("kind", kind)
    .in("locale", locale === "en" ? ["en"] : [locale, "en"]);
  const rows = unwrap<DocumentRow>(data, error);
  const row = rows.find((r) => r.locale === locale) ?? rows[0];
  if (!row) return null;

  // Proxied through `/files` (see next.config.ts) so the Supabase host stays hidden.
  const viewUrl = `/files/${row.file_path}`;
  return {
    kind,
    title: row.title,
    viewUrl,
    downloadUrl: `${viewUrl}?download=${encodeURIComponent(row.download_name ?? "")}`,
  };
}

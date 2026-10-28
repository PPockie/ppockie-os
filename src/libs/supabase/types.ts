// Hand-written to match supabase/migrations (0001_init ... 0004_skills).
// Replace with generated types later: npx supabase gen types typescript --project-id <id>

export type AchievementKind = "certificate" | "trophy";

export interface ContactRow {
  id: string;
  platform: string;
  label_en: string;
  label_th: string | null;
  url: string;
  icon: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  slug: string;
  title_en: string;
  title_th: string | null;
  summary_en: string | null;
  summary_th: string | null;
  description_en: string | null;
  description_th: string | null;
  cover_url: string | null;
  images: string[];
  tech_stack: string[];
  repo_url: string | null;
  demo_url: string | null;
  started_on: string | null;
  ended_on: string | null;
  is_featured: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AchievementRow {
  id: string;
  kind: AchievementKind;
  title_en: string;
  title_th: string | null;
  description_en: string | null;
  description_th: string | null;
  issuer: string | null;
  position_en: string | null;
  position_th: string | null;
  awarded_on: string | null;
  expires_on: string | null;
  credential_id: string | null;
  credential_url: string | null;
  image_url: string | null;
  images: string[];
  tools: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostRow {
  id: string;
  slug: string;
  title_en: string;
  title_th: string | null;
  excerpt_en: string | null;
  excerpt_th: string | null;
  content_en: string | null;
  content_th: string | null;
  cover_url: string | null;
  tags: string[];
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// supabase/migrations/0003_cv_sections.sql

export interface ProfileRow {
  id: string;
  slug: string;
  full_name_en: string;
  full_name_th: string | null;
  headline_en: string | null;
  headline_th: string | null;
  bio_en: string | null;
  bio_th: string | null;
  location_en: string | null;
  location_th: string | null;
  created_at: string;
  updated_at: string;
}

export interface SkillGroupRow {
  id: string;
  label_en: string;
  label_th: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// supabase/migrations/0004_skills.sql
export interface SkillRow {
  id: string;
  group_id: string;
  name: string;
  /** Slug of a logo in @iconify-react/logos; null falls back to initials. */
  icon: string | null;
  /** 0-100; null when not rated. */
  level: number | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillGroupWithSkillsRow extends SkillGroupRow {
  skills: SkillRow[];
}

export interface ExperienceRow {
  id: string;
  company_en: string;
  company_th: string | null;
  location_en: string | null;
  location_th: string | null;
  position_en: string;
  position_th: string | null;
  team_en: string | null;
  team_th: string | null;
  started_on: string;
  ended_on: string | null;
  tech_stack: string[];
  bullets_en: string[];
  bullets_th: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface EducationRow {
  id: string;
  institution_en: string;
  institution_th: string | null;
  location_en: string | null;
  location_th: string | null;
  degree_en: string;
  degree_th: string | null;
  started_on: string | null;
  ended_on: string | null;
  gpax: string | null;
  bullets_en: string[];
  bullets_th: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentRow {
  id: string;
  kind: "resume" | "cv";
  locale: "en" | "th";
  title: string | null;
  file_path: string;
  download_name: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

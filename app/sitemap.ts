import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SlugRow = { slug: string; updated_at: string | null };

const toUrls = (base: string, prefix: string, rows: SlugRow[]) =>
  rows.map((row) => ({
    url: `${base}${prefix}${row.slug}`,
    lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
  }));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.invalid").replace(/\/$/, "");
  const supabase = await createClient();

  const [{ data: programs }, { data: events }, { data: courses }, { data: content }, { data: volunteer }] = await Promise.all([
    supabase.from("programs").select("slug,updated_at").in("status", ["published", "running", "registration_closed", "completed"]),
    supabase.from("events").select("slug,updated_at").eq("is_public", true),
    supabase.from("courses").select("slug,updated_at").eq("is_published", true),
    supabase.from("content").select("slug,updated_at").eq("status", "published"),
    supabase.from("volunteer_opportunities").select("slug,updated_at").eq("status", "published"),
  ]);

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/programs` },
    { url: `${base}/events` },
    { url: `${base}/courses` },
    { url: `${base}/content` },
    { url: `${base}/network` },
    { url: `${base}/volunteer` },
    { url: `${base}/provinces` },
    { url: `${base}/certificate/verify` },
    { url: `${base}/search` },
    { url: `${base}/research` },
    ...toUrls(base, "/programs/", (programs ?? []) as SlugRow[]),
    ...toUrls(base, "/events/", (events ?? []) as SlugRow[]),
    ...toUrls(base, "/courses/", (courses ?? []) as SlugRow[]),
    ...toUrls(base, "/content/", (content ?? []) as SlugRow[]),
    ...toUrls(base, "/volunteer/", (volunteer ?? []) as SlugRow[]),
  ];
}

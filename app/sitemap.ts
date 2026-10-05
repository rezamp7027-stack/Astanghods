import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const base=process.env.NEXT_PUBLIC_SITE_URL||"https://example.invalid";const supabase=await createClient();
 const [{data:programs},{data:events},{data:courses},{data:content},{data:orgs},{data:volunteer}]=await Promise.all([
  supabase.from("programs").select("slug,updated_at").eq("status","published"),
  supabase.from("events").select("slug,updated_at").eq("is_public",true),
  supabase.from("courses").select("slug,updated_at").eq("is_published",true),
  supabase.from("content").select("slug,updated_at").eq("status","published"),
  supabase.from("organization_directory").select("slug,updated_at").eq("is_active",true),
  supabase.from("volunteer_opportunities").select("slug,updated_at").eq("status","published")
 ]);
 const map=(prefix:string,rows:any[])=>(rows??[]).map(row=>({url:base+prefix+row.slug,lastModified:row.updated_at?new Date(row.updated_at):new Date()}));
 return[{url:base,lastModified:new Date()},{url:base+"/programs"},{url:base+"/events"},{url:base+"/courses"},{url:base+"/content"},{url:base+"/network"},{url:base+"/volunteer"},{url:base+"/certificate/verify"},{url:base+"/search"},...map("/programs/",programs??[]),...map("/events/",events??[]),...map("/courses/",courses??[]),...map("/content/",content??[]),...map("/volunteer/",volunteer??[])];
}
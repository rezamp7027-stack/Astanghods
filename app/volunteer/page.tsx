import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function VolunteerPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("volunteer_opportunities")
    .select("id,title,slug,summary,skills,city,starts_at,ends_at,capacity,status")
    .eq("status", "published")
    .order("starts_at", { ascending: true })
    .limit(100);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">خدمت</span>
            <h1>فرص خدمت و داوطلبی</h1>
            <p>فرصت‌های مشارکت اجتماعی و خدمت در شبکه جوانان رضوی.</p>
          </div>
          {error ? <div className="notice error" role="alert">خطا در دریافت فرصت‌های خدمت.</div> : null}
          <div className="admin-card-grid">
            {(rows ?? []).map((opportunity) => (
              <article className="admin-card" key={opportunity.id}>
                <span className="eyebrow">خدمت داوطلبانه</span>
                <h2>{opportunity.title}</h2>
                {opportunity.summary && <p>{opportunity.summary}</p>}
                <p>{opportunity.city ?? "استانی"}{opportunity.starts_at ? ` · ${new Date(opportunity.starts_at).toLocaleDateString("fa-IR")}` : ""}</p>
                <div className="tag-row">{(opportunity.skills ?? []).slice(0, 6).map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div>
                <Link className="btn btn-primary" href={`/volunteer/${opportunity.slug}`}>جزئیات فرصت</Link>
              </article>
            ))}
          </div>
          {!rows?.length && <div className="empty">فعلاً فرصت خدمتی منتشر نشده است.</div>}
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

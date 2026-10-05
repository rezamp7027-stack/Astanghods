import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { applyVolunteer } from "@/app/dashboard/actions";

export const dynamic = "force-dynamic";

export default async function VolunteerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: opportunity } = await supabase
    .from("volunteer_opportunities")
    .select("id,title,slug,summary,description,skills,city,starts_at,ends_at,capacity,status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!opportunity) {
    return (
      <>
        <SiteHeader />
        <main className="page"><div className="container narrow"><h1>فرصت پیدا نشد</h1><Link className="btn btn-secondary" href="/volunteer">بازگشت</Link></div></main>
      </>
    );
  }

  const { data: claims } = await supabase.auth.getClaims();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container narrow">
          <div className="page-head">
            <span className="eyebrow">خدمت</span>
            <h1>{opportunity.title}</h1>
            <p>{opportunity.summary ?? ""}</p>
          </div>
          <article className="detail-card">
            <p>{opportunity.description ?? "توضیحات فرصت در حال تکمیل است."}</p>
            <p>{opportunity.city ?? "استانی"}{opportunity.starts_at ? ` · ${new Date(opportunity.starts_at).toLocaleString("fa-IR")}` : ""}</p>
            <div className="tag-row">{(opportunity.skills ?? []).map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div>
            <div className="notice" style={{ marginTop: 18 }}>
              {opportunity.capacity ? `ظرفیت اعلام‌شده: ${opportunity.capacity} نفر` : "ظرفیت عمومی اعلام نشده است."}
            </div>
            {claims?.claims?.sub ? (
              <form action={applyVolunteer} className="button-row" style={{ marginTop: 18 }}>
                <input type="hidden" name="opportunity_id" value={opportunity.id} />
                <button className="btn btn-primary" type="submit">درخواست مشارکت</button>
              </form>
            ) : (
              <Link className="btn btn-primary" href={`/login?next=/volunteer/${opportunity.slug}`} style={{ marginTop: 18 }}>ورود برای درخواست</Link>
            )}
          </article>
          <Link className="btn btn-secondary" href="/volunteer" style={{ marginTop: 18 }}>بازگشت به فرصت‌ها</Link>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

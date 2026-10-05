import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProvincePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: province } = await supabase.from("provinces").select("id,name,slug").eq("slug", slug).maybeSingle();
  if (!province) notFound();

  const [{ data: programData }, { data: orgData }] = await Promise.all([
    supabase.from("programs").select("id,title,slug,summary,start_at,is_historical").in("status", ["published", "running", "registration_closed", "completed"]).eq("province_id", province.id).order("start_at", { ascending: false }).limit(50),
    supabase.from("organization_directory").select("id,name,slug,organization_type,city,description").eq("is_active", true).eq("province_id", province.id).order("name").limit(50),
  ]);

  const programs = programData ?? [];
  const orgs = orgData ?? [];

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">استان من</span>
            <h1>{province.name}</h1>
            <p>برنامه‌ها و مجموعه‌های عمومی ثبت‌شده برای این استان.</p>
          </div>

          <section>
            <div className="section-head"><div><h2>برنامه‌ها</h2><p>جاری و آرشیوی، با وضعیت شفاف.</p></div></div>
            <div className="admin-card-grid">
              {programs.map((program) => (
                <article className="admin-card" key={program.id}>
                  <span className="status">{program.is_historical ? "آرشیوی" : "فعال"}</span>
                  <h3>{program.title}</h3>
                  <p>{program.summary ?? ""}</p>
                  <Link className="btn btn-secondary" href={`/programs/${program.slug}`}>مشاهده</Link>
                </article>
              ))}
            </div>
            {!programs.length && <div className="empty">فعلاً برنامه‌ای برای این استان منتشر نشده است.</div>}
          </section>

          <section className="section">
            <div className="section-head"><div><h2>مجموعه‌های شبکه</h2><p>فقط مجموعه‌هایی که ورود عمومی به اطلاعاتشان مجاز است.</p></div></div>
            <div className="admin-card-grid">
              {orgs.map((org) => (
                <article className="admin-card" key={org.id}>
                  <span className="eyebrow">{org.organization_type}</span>
                  <h3>{org.name}</h3>
                  <p>{org.city ?? ""}</p>
                  <p>{org.description ?? ""}</p>
                </article>
              ))}
            </div>
            {!orgs.length && <div className="empty">فعلاً مجموعه عمومی برای این استان ثبت نشده است.</div>}
          </section>

          <Link className="btn btn-secondary" href="/provinces">همه استان‌ها</Link>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

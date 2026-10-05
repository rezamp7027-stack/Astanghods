import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NetworkPage() {
  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("organization_directory")
    .select("id,name,slug,organization_type,city,website,description,province_id")
    .eq("is_active", true)
    .order("name");

  const organizations = rows ?? [];

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">شبکه جوانان رضوی</span>
            <h1>شبکه مجموعه‌ها</h1>
            <p>مراکز و مجموعه‌های عمومی فعال در شبکه را بر اساس اطلاعات قابل انتشار پیدا کنید.</p>
          </div>
          {error ? <div className="notice error" role="alert">خطا در دریافت شبکه.</div> : null}
          <div className="admin-card-grid">
            {organizations.map((organization) => (
              <article className="admin-card" key={organization.id}>
                <span className="eyebrow">{organization.organization_type}</span>
                <h2>{organization.name}</h2>
                <p>{organization.city ?? "شبکه استانی"}</p>
                {organization.description && <p>{organization.description}</p>}
                {organization.website && (
                  <a className="btn btn-secondary" href={organization.website} target="_blank" rel="noreferrer">وب‌سایت مجموعه</a>
                )}
              </article>
            ))}
          </div>
          {!organizations.length && <div className="empty">فعلاً مجموعه عمومی‌ای در شبکه ثبت نشده است.</div>}
          <div className="button-row" style={{ marginTop: 18 }}>
            <Link className="btn btn-secondary" href="/provinces">شبکه استانی</Link>
            <Link className="btn btn-secondary" href="/programs">دیدن برنامه‌ها</Link>
          </div>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

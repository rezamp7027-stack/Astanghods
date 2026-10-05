import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProvincesPage() {
  const supabase = await createClient();
  const { data: provinces, error } = await supabase
    .from("provinces")
    .select("id,name,slug")
    .order("name");

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">شبکه استانی</span>
            <h1>استان‌های شبکه جوانان رضوی</h1>
            <p>برنامه‌ها و مجموعه‌های فعال یا ثبت‌شده را بر اساس استان پیدا کنید.</p>
          </div>
          {error ? <div className="notice error" role="alert">خطا در دریافت فهرست استان‌ها.</div> : null}
          <div className="admin-card-grid">
            {(provinces ?? []).map((province) => (
              <article className="admin-card" key={province.id}>
                <h2>{province.name}</h2>
                <Link className="btn btn-secondary" href={`/provinces/${province.slug}`}>مشاهده استان</Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

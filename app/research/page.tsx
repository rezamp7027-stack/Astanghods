import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ResearchSourcesPage() {
  const supabase = await createClient();
  const { data: sources, error } = await supabase
    .from("research_sources")
    .select("id,title,url,source_type,publication_date,confidence,notes,metadata")
    .eq("is_public", true)
    .order("confidence", { ascending: true })
    .order("title");

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">پژوهش و شفافیت</span>
            <h1>منابع پژوهش</h1>
            <p>منابع عمومی استفاده‌شده برای ساخت آرشیو مؤسسه، همراه با سطح اعتماد و نوع منبع.</p>
          </div>
          {error ? <div className="notice error" role="alert">دریافت منابع پژوهش ممکن نشد.</div> : null}
          <div className="admin-card-grid">
            {(sources ?? []).map((source) => (
              <article className="admin-card" key={source.id}>
                <span className="status">{source.confidence === "high" ? "اعتماد بالا" : source.confidence === "medium" ? "اعتماد متوسط" : source.confidence}</span>
                <h2>{source.title}</h2>
                <p>{source.source_type}</p>
                {source.notes && <p>{source.notes}</p>}
                {source.publication_date && <p>تاریخ منبع: {new Date(source.publication_date).toLocaleDateString("fa-IR")}</p>}
                <a className="btn btn-secondary" href={source.url} target="_blank" rel="noreferrer">باز کردن منبع</a>
              </article>
            ))}
          </div>
          {!sources?.length && <div className="empty">هنوز منبع پژوهشی عمومی ثبت نشده است.</div>}
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

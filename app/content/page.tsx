import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ContentRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content_type: string;
  published_at: string | null;
  source_published_at: string | null;
  is_historical: boolean;
  source_confidence: string | null;
};

function ContentCard({ item, historical }: { item: ContentRow; historical: boolean }) {
  const date = item.source_published_at ?? item.published_at;
  return (
    <article className="program-card">
      <div>
        <div className="program-card-top">
          <span className="status">{historical ? "آرشیوی" : "منتشرشده"}</span>
          <span className="tag">{item.content_type}</span>
        </div>
        <h2>{item.title}</h2>
        <p>{item.summary ?? "برای این محتوا خلاصه‌ای ثبت نشده است."}</p>
        <div className="meta">
          {date && <span>{new Date(date).toLocaleDateString("fa-IR")}</span>}
          {item.source_confidence && <span>اعتماد منبع: {item.source_confidence}</span>}
        </div>
      </div>
      <div className="bottom">
        <span className="tag">{historical ? "سابقه مؤسسه" : "محتوای رسمی"}</span>
        <Link className="btn btn-secondary" href={`/content/${item.slug}`}>{historical ? "مشاهده آرشیو" : "خواندن محتوا"}</Link>
      </div>
    </article>
  );
}

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: content, error } = await supabase
    .from("content")
    .select("id,title,slug,summary,content_type,published_at,source_published_at,is_historical,source_confidence")
    .eq("status", "published")
    .order("is_historical", { ascending: true })
    .order("source_published_at", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false });

  const rows = (content ?? []) as ContentRow[];
  const current = rows.filter((item) => !item.is_historical);
  const historical = rows.filter((item) => item.is_historical);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">رسانه و آرشیو</span>
            <h1>محتوا</h1>
            <p>مقاله‌ها، گزارش‌ها و داده‌های پژوهش‌شده مؤسسه با منبع و وضعیت تاریخی مشخص.</p>
          </div>
          {error ? <div className="notice error" role="alert">خطا در دریافت محتوا.</div> : null}

          <section>
            <div className="section-head"><div><h2>محتوای جاری</h2><p>مطالبی که برای انتشار فعلی توسط مدیران محتوا ثبت شده‌اند.</p></div></div>
            {current.length ? (
              <div className="program-grid">{current.map((item) => <ContentCard key={item.id} item={item} historical={false} />)}</div>
            ) : (
              <div className="empty">هنوز محتوای جاری منتشرشده‌ای ثبت نشده است. آرشیو پژوهشی در بخش بعدی در دسترس است.</div>
            )}
          </section>

          <section className="section">
            <div className="section-head"><div><h2>آرشیو پژوهشی مؤسسه</h2><p>داده‌های تاریخی جدا از محتوای جاری نگهداری می‌شوند.</p></div></div>
            {historical.length ? (
              <div className="program-grid">{historical.map((item) => <ContentCard key={item.id} item={item} historical />)}</div>
            ) : (
              <div className="empty">آرشیو پژوهشی هنوز خالی است.</div>
            )}
          </section>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

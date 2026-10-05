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
};

export default async function ContentPage() {
  const supabase = await createClient();
  const { data: content, error } = await supabase
    .from("content")
    .select("id,title,slug,summary,content_type,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <h1>محتوا</h1>
            <p>مقاله‌ها، راهنماها و محتوای آموزشی منتخب جوانان رضوی.</p>
          </div>
          {error ? <div className="notice error">خطا در دریافت محتوا.</div> : null}
          {!content?.length ? (
            <div className="empty">هنوز محتوای منتشرشده‌ای ثبت نشده است.</div>
          ) : (
            <div className="program-grid">
              {(content as ContentRow[]).map((item) => (
                <article className="program-card" key={item.id}>
                  <div className="program-card-top">
                    <span className="status">منتشرشده</span>
                    <span className="tag">{item.content_type}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.summary ?? "برای این محتوا خلاصه‌ای ثبت نشده است."}</p>
                  <div className="meta">
                    {item.published_at && <span>{new Date(item.published_at).toLocaleDateString("fa-IR")}</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

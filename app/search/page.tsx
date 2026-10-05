import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchProgram = { id: string; title: string; slug: string; summary: string | null; is_historical: boolean };
type SearchCourse = { id: string; title: string; slug: string; summary: string | null; is_historical: boolean };
type SearchContent = { id: string; title: string; slug: string; summary: string | null; content_type: string; is_historical: boolean };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().slice(0, 120);
  const supabase = await createClient();

  let programs: SearchProgram[] = [];
  let courses: SearchCourse[] = [];
  let content: SearchContent[] = [];

  if (q) {
    const pattern = `%${q.replace(/[%_]/g, "\\$&")}%`;
    const [{ data: programData }, { data: courseData }, { data: contentData }] = await Promise.all([
      supabase.from("programs").select("id,title,slug,summary,is_historical").in("status", ["published", "running", "registration_closed", "completed"]).or(`title.ilike.${pattern},summary.ilike.${pattern}`).limit(15),
      supabase.from("courses").select("id,title,slug,summary,is_historical").eq("is_published", true).or(`title.ilike.${pattern},summary.ilike.${pattern}`).limit(15),
      supabase.from("content").select("id,title,slug,summary,content_type,is_historical").eq("status", "published").or(`title.ilike.${pattern},summary.ilike.${pattern}`).limit(15),
    ]);
    programs = (programData ?? []) as SearchProgram[];
    courses = (courseData ?? []) as SearchCourse[];
    content = (contentData ?? []) as SearchContent[];
  }

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">کشف</span>
            <h1>جست‌وجوی سامانه</h1>
            <p>برنامه، دوره و محتوای رسمی و آرشیوی را در یک جا پیدا کن.</p>
          </div>

          <form className="search-form" method="GET">
            <label htmlFor="q">عبارت جست‌وجو</label>
            <div className="search-row">
              <input id="q" name="q" defaultValue={q} required maxLength={120} autoComplete="off" />
              <button className="btn btn-primary" type="submit">جست‌وجو</button>
            </div>
          </form>

          {q ? (
            <div className="search-results">
              <section>
                <h2>برنامه‌ها ({programs.length})</h2>
                <div className="admin-card-grid">
                  {programs.map((item) => (
                    <article className="admin-card" key={item.id}>
                      <div className="tag-row"><span className="status">{item.is_historical ? "آرشیوی" : "فعال"}</span></div>
                      <h3>{item.title}</h3><p>{item.summary ?? ""}</p>
                      <Link className="btn btn-secondary" href={`/programs/${item.slug}`}>مشاهده</Link>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h2>دوره‌ها ({courses.length})</h2>
                <div className="admin-card-grid">
                  {courses.map((item) => (
                    <article className="admin-card" key={item.id}>
                      <span className="status">{item.is_historical ? "آرشیوی" : "فعال"}</span>
                      <h3>{item.title}</h3><p>{item.summary ?? ""}</p>
                      <Link className="btn btn-secondary" href={`/courses/${item.slug}`}>مشاهده</Link>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h2>محتوا ({content.length})</h2>
                <div className="admin-card-grid">
                  {content.map((item) => (
                    <article className="admin-card" key={item.id}>
                      <span className="eyebrow">{item.content_type}</span>
                      <span className="status">{item.is_historical ? "آرشیوی" : "جاری"}</span>
                      <h3>{item.title}</h3><p>{item.summary ?? ""}</p>
                      <Link className="btn btn-secondary" href={`/content/${item.slug}`}>مشاهده</Link>
                    </article>
                  ))}
                </div>
              </section>

              {!programs.length && !courses.length && !content.length && (
                <div className="empty">نتیجه‌ای برای «{q}» پیدا نشد.</div>
              )}
            </div>
          ) : (
            <div className="empty">عبارت جست‌وجو را وارد کن.</div>
          )}
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

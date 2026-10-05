import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id,title,slug,summary,description")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <h1>آموزش</h1>
            <p>دوره‌های آموزشی را دنبال کن و مسیر یادگیری خودت را بساز.</p>
          </div>
          {error ? <div className="notice error">خطا در دریافت دوره‌ها.</div> : null}
          {!courses?.length ? (
            <div className="empty">هنوز دوره‌ای منتشر نشده است.</div>
          ) : (
            <div className="program-grid">
              {courses.map((course) => (
                <article className="program-card" key={course.id}>
                  <div className="program-card-top"><span className="status">دوره</span><span className="tag">آموزش</span></div>
                  <h2>{course.title}</h2>
                  <p>{course.summary ?? course.description ?? "توضیحات دوره هنوز ثبت نشده است."}</p>
                  <div className="bottom"><Link className="btn btn-secondary" href={`/courses/${course.slug}`}>مشاهده دوره</Link></div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

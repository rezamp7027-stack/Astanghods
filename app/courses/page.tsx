import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

type Course = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  is_historical: boolean;
};

export const dynamic = "force-dynamic";

function CourseCard({ course, historical }: { course: Course; historical: boolean }) {
  return (
    <article className="program-card">
      <div>
        <div className="program-card-top">
          <span className="status">{historical ? "آرشیوی" : "فعال"}</span>
          <span className="tag">آموزش</span>
        </div>
        <h2>{course.title}</h2>
        <p>{course.summary ?? course.description ?? "توضیحات دوره هنوز ثبت نشده است."}</p>
      </div>
      <div className="bottom">
        <span className="tag">{historical ? "سابقه آموزشی" : "یادگیری آنلاین"}</span>
        <Link className="btn btn-secondary" href={`/courses/${course.slug}`}>
          {historical ? "مشاهده آرشیو" : "مشاهده دوره"}
        </Link>
      </div>
    </article>
  );
}

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("id,title,slug,summary,description,is_historical")
    .eq("is_published", true)
    .order("is_historical", { ascending: true })
    .order("created_at", { ascending: false });

  const rows = (courses ?? []) as Course[];
  const current = rows.filter((course) => !course.is_historical);
  const historical = rows.filter((course) => course.is_historical);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">یادگیری</span>
            <h1>آموزش</h1>
            <p>دوره‌های جاری را از سوابق آموزشی مؤسسه جدا نگه می‌داریم تا تاریخ با ثبت‌نام امروز قاطی نشود.</p>
          </div>
          {error ? <div className="notice error" role="alert">خطا در دریافت دوره‌ها.</div> : null}

          <section>
            <div className="section-head"><div><h2>دوره‌های جاری</h2><p>دوره‌هایی که برای یادگیری و ثبت‌نام فعلی منتشر شده‌اند.</p></div></div>
            {current.length ? (
              <div className="program-grid">{current.map((course) => <CourseCard key={course.id} course={course} historical={false} />)}</div>
            ) : (
              <div className="empty">در حال حاضر دوره فعال منتشرشده‌ای ثبت نشده است.</div>
            )}
          </section>

          <section className="section">
            <div className="section-head"><div><h2>آرشیو آموزشی مؤسسه</h2><p>دوره‌های پژوهش‌شده تاریخی برای مراجعه، مستندسازی و جست‌وجو.</p></div></div>
            {historical.length ? (
              <div className="program-grid">{historical.map((course) => <CourseCard key={course.id} course={course} historical />)}</div>
            ) : (
              <div className="empty">هنوز رکورد آموزشی تاریخی ثبت نشده است.</div>
            )}
          </section>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

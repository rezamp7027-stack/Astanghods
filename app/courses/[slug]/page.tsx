import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("id,title,slug,summary,description,is_historical,source_url,source_confidence")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (!course) notFound();

  const { data: modules } = await supabase
    .from("course_modules")
    .select("id,title,sort_order,lessons(id,title,slug,lesson_type,duration_minutes,sort_order)")
    .eq("course_id", course.id)
    .order("sort_order");

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container detail-grid">
          <article className="detail-card">
            <span className="status">{course.is_historical ? "رکورد آرشیوی" : "دوره آموزشی"}</span>
            <h1>{course.title}</h1>
            <p className="lead">{course.summary}</p>
            <p>{course.description}</p>

            <h2>سرفصل‌ها</h2>
            <div className="registration-list">
              {(modules ?? []).map((module) => (
                <section key={module.id} className="registration-row">
                  <div>
                    <strong>{module.title}</strong>
                    <div className="tag-row">
                      {(module.lessons ?? []).map((lesson) => (
                        <Link key={lesson.id} className="tag" href={`/courses/${course.slug}/lessons/${lesson.slug}`}>
                          {lesson.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
              {!modules?.length && <div className="empty">برای این رکورد هنوز سرفصل یا درس عمومی ثبت نشده است.</div>}
            </div>

            {course.is_historical && (
              <div className="notice" style={{ marginTop: 18 }}>
                این دوره بخشی از آرشیو پژوهشی مؤسسه است و ثبت‌نام فعلی برای آن فعال نیست.
              </div>
            )}
            {course.source_url && (
              <a className="btn btn-secondary" href={course.source_url} target="_blank" rel="noreferrer" style={{ marginTop: 18 }}>
                مشاهده منبع رسمی
              </a>
            )}
          </article>

          <aside className="detail-card sticky">
            {course.is_historical ? (
              <>
                <h2>آرشیو آموزشی</h2>
                <p>این صفحه برای ثبت سابقه و محتوای پژوهش‌شده نگهداری می‌شود.</p>
                {course.source_confidence && <div className="notice">اعتماد منبع: <strong>{course.source_confidence}</strong></div>}
                <Link className="btn btn-secondary" href="/courses">بازگشت به آموزش</Link>
              </>
            ) : (
              <>
                <h2>مسیر یادگیری</h2>
                <p>دوره را به حساب خود اضافه کن تا پیشرفت درس‌ها و وضعیت تکمیل را در «مسیر من» ببینی.</p>
                <CourseEnrollButton courseId={course.id} />
              </>
            )}
          </aside>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

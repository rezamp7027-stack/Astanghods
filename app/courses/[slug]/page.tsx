import { notFound } from "next/navigation";
import Link from "next/link";
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
    .select("id,title,slug,summary,description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

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
            <span className="status">دوره آموزشی</span>
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
              {!modules?.length && <div className="empty">سرفصل این دوره هنوز تکمیل نشده است.</div>}
            </div>
          </article>
          <aside className="detail-card sticky">
            <h2>مسیر یادگیری</h2>
            <p>دوره را به حساب خود اضافه کن تا پیشرفت درس‌ها و وضعیت تکمیل را در «مسیر من» ببینی.</p>
            <CourseEnrollButton courseId={course.id} />
          </aside>
        </div>
      </main>
    </>
  );
}

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LessonProgress } from "@/components/lesson-progress";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string; lessonSlug: string }> };

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect(`/login?next=${encodeURIComponent(`/courses/${slug}/lessons/${lessonSlug}`)}`);
  const userId = String(claimsData.claims.sub);

  const { data: course } = await supabase.from("courses").select("id,title,slug").eq("slug", slug).eq("is_published", true).single();
  if (!course) notFound();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id,title,slug,lesson_type,content,duration_minutes,module_id,course_modules!inner(course_id,title)")
    .eq("slug", lessonSlug)
    .eq("is_published", true)
    .eq("course_modules.course_id", course.id)
    .single();
  if (!lesson) notFound();

  const { data: enrollment } = await supabase.from("enrollments").select("id,status").eq("course_id", course.id).eq("user_id", userId).in("status", ["active","completed"]).maybeSingle();
  if (!enrollment) redirect(`/courses/${slug}`);

  const { data: progress } = await supabase.from("lesson_progress").select("progress_percent").eq("lesson_id", lesson.id).eq("user_id", userId).maybeSingle();
  const content = lesson.content as { html?: string; text?: string } | null;

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container detail-grid">
          <article className="detail-card">
            <span className="status">درس آموزشی</span>
            <h1>{lesson.title}</h1>
            <p className="lead">{lesson.lesson_type}{lesson.duration_minutes ? ` · ${lesson.duration_minutes} دقیقه` : ""}</p>
            <div className="callout">{content?.text ?? "محتوای این درس در قالب چندرسانه‌ای ارائه می‌شود."}</div>
            <LessonProgress lessonId={lesson.id} initial={Number(progress?.progress_percent ?? 0)} />
            <Link className="btn btn-secondary" href={`/courses/${slug}`}>بازگشت به دوره</Link>
          </article>
        </div>
      </main>
    </>
  );
}

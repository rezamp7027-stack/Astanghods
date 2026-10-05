import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function LearningDashboardPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/login?next=/dashboard/learning");

  const userId = String(claimsData.claims.sub);
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id,status,enrolled_at,courses(id,title,slug,summary)")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <h1>مسیر یادگیری</h1>
            <p>دوره‌هایی که شروع کرده‌ای و وضعیت ادامه آن‌ها.</p>
          </div>
          <div className="program-grid">
            {(enrollments ?? []).map((enrollment) => {
              const course = Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses;
              return (
                <article className="program-card" key={enrollment.id}>
                  <div className="program-card-top"><span className="status">{enrollment.status === "completed" ? "تکمیل‌شده" : "در حال یادگیری"}</span></div>
                  <h2>{course?.title ?? "دوره"}</h2>
                  <p>{course?.summary ?? "برای این دوره توضیحی ثبت نشده است."}</p>
                  {course?.slug && <div className="bottom"><Link className="btn btn-secondary" href={`/courses/${course.slug}`}>ادامه دوره</Link></div>}
                </article>
              );
            })}
          </div>
          {!enrollments?.length && <div className="empty">هنوز دوره‌ای شروع نکرده‌ای. از بخش آموزش یک مسیر انتخاب کن.</div>}
        </div>
      </main>
    </>
  );
}

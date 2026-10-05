import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login?next=/dashboard/recommendations");

  await supabase.rpc("refresh_my_recommendations");
  const userId = String(claims.claims.sub);
  const { data: recData, error } = await supabase
    .from("recommendations")
    .select("id,entity_type,entity_id,score,reason,status")
    .eq("user_id", userId)
    .eq("status", "active")
    .or("expires_at.is.null,expires_at.gte." + new Date().toISOString())
    .order("score", { ascending: false })
    .limit(20);

  const recs = recData ?? [];
  const programIds = [...new Set(recs.filter((row) => row.entity_type === "program").map((row) => row.entity_id))];
  const courseIds = [...new Set(recs.filter((row) => row.entity_type === "course").map((row) => row.entity_id))];
  const [{ data: programData }, { data: courseData }] = await Promise.all([
    programIds.length ? supabase.from("programs").select("id,title,slug,summary").in("id", programIds) : Promise.resolve({ data: [] }),
    courseIds.length ? supabase.from("courses").select("id,title,slug,summary").in("id", courseIds) : Promise.resolve({ data: [] }),
  ]);

  const programs = programData ?? [];
  const courses = courseData ?? [];

  return (
    <main className="page">
      <div className="container">
        <div className="page-head">
          <span className="eyebrow">پیشنهادهای شخصی</span>
          <h1>پیشنهادهای من</h1>
          <p>بر اساس فعالیت ثبت‌شده و اطلاعات مسیر تو.</p>
        </div>
        {error && <div className="notice error" role="alert">دریافت پیشنهادها با خطا روبه‌رو شد.</div>}
        <div className="admin-card-grid">
          {recs.map((row) => {
            const program = programs.find((item) => item.id === row.entity_id);
            const course = courses.find((item) => item.id === row.entity_id);
            return (
              <article className="admin-card" key={row.id}>
                <span className="eyebrow">{row.entity_type === "program" ? "برنامه" : "دوره"}</span>
                <h2>{program?.title ?? course?.title ?? "مورد پیشنهادی"}</h2>
                <p>{program?.summary ?? course?.summary ?? row.reason ?? ""}</p>
                <div className="button-row">
                  {program && <Link className="btn btn-secondary" href={`/programs/${program.slug}`}>مشاهده برنامه</Link>}
                  {course && <Link className="btn btn-secondary" href={`/courses/${course.slug}`}>مشاهده دوره</Link>}
                </div>
              </article>
            );
          })}
        </div>
        {!recs.length && <div className="empty">هنوز پیشنهاد شخصی مناسبی برای تو تولید نشده است.</div>}
        <Link className="btn btn-secondary" href="/dashboard">بازگشت به داشبورد</Link>
      </div>
    </main>
  );
}

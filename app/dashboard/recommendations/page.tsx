import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
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
    programIds.length
      ? supabase.from("programs").select("id,title,slug,summary,is_historical,status").in("id", programIds)
      : Promise.resolve({ data: [] }),
    courseIds.length
      ? supabase.from("courses").select("id,title,slug,summary,is_historical,is_published").in("id", courseIds)
      : Promise.resolve({ data: [] }),
  ]);

  const programs = (programData ?? []).filter((row) => row.is_historical === false && row.status !== "completed");
  const courses = (courseData ?? []).filter((row) => row.is_historical === false && row.is_published);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">پیشنهادهای شخصی</span>
            <h1>پیشنهادهای من</h1>
            <p>بر اساس فعالیت ثبت‌شده و داده‌های جاری مسیر تو.</p>
          </div>

          {error && <div className="notice error" role="alert">دریافت پیشنهادها با خطا روبه‌رو شد.</div>}

          <div className="admin-card-grid">
            {recs.map((row) => {
              const program = programs.find((item) => item.id === row.entity_id);
              const course = courses.find((item) => item.id === row.entity_id);
              if (!program && !course) return null;
              return (
                <article className="admin-card" key={row.id}>
                  <div className="tag-row"><span className="status">{program ? "برنامه" : "دوره"}</span></div>
                  <h2>{program?.title ?? course?.title ?? "مورد پیشنهادی"}</h2>
                  <p>{program?.summary ?? course?.summary ?? row.reason ?? ""}</p>
                  {program && <Link className="btn btn-secondary" href={`/programs/${program.slug}`}>مشاهده برنامه</Link>}
                  {course && <Link className="btn btn-secondary" href={`/courses/${course.slug}`}>مشاهده دوره</Link>}
                </article>
              );
            })}
          </div>

          {!recs.some((row) => programs.some((item) => item.id === row.entity_id) || courses.some((item) => item.id === row.entity_id)) && (
            <div className="empty">هنوز پیشنهاد جاری مناسبی برای تو تولید نشده است.</div>
          )}
          <Link className="btn btn-secondary" href="/dashboard" style={{ marginTop: 18 }}>بازگشت به داشبورد</Link>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function GrowthPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login?next=/dashboard/growth");

  const userId = String(claims.claims.sub);
  const [{ data: points }, { data: events }] = await Promise.all([
    supabase.from("gamification_points").select("total_points,level,updated_at").eq("user_id", userId).maybeSingle(),
    supabase.from("gamification_events").select("id,points,reason,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(30),
  ]);

  const rows = events ?? [];
  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">مسیر رشد</span>
            <h1>امتیاز و پیشرفت</h1>
            <p>فعالیت‌های خودت را که در مسیر رشد ثبت شده‌اند دنبال کن.</p>
          </div>
          <div className="admin-metrics">
            <div className="metric"><strong>{points?.total_points ?? 0}</strong><span>امتیاز</span></div>
            <div className="metric"><strong>{points?.level ?? 1}</strong><span>سطح</span></div>
          </div>
          <div className="admin-card-grid">
            {rows.map((row) => (
              <article className="admin-card" key={row.id}>
                <strong>{row.reason}</strong>
                <p>{row.points > 0 ? "+" : ""}{row.points} امتیاز · {new Date(row.created_at).toLocaleDateString("fa-IR")}</p>
              </article>
            ))}
          </div>
          {!rows.length && <div className="empty">هنوز رویداد امتیازی برای شما ثبت نشده است.</div>}
          <Link className="btn btn-secondary" href="/dashboard">بازگشت به داشبورد</Link>
        </div>
      </main>
    </>
  );
}

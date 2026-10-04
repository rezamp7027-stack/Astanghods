import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Registration = {
  id: string;
  status: string;
  registered_at: string;
  programs: { title: string; slug: string } | { title: string; slug: string }[] | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/login?next=/dashboard");

  const userId = String(claimsData.claims.sub);
  const [{ data: profile }, { data: registrations }] = await Promise.all([
    supabase.from("profiles").select("display_name,full_name,onboarding_completed").eq("id", userId).single(),
    supabase.from("registrations").select("id,status,registered_at,programs(title,slug)").eq("user_id", userId).order("registered_at", { ascending: false }),
  ]);

  const displayName = profile?.display_name || profile?.full_name || "جوان عزیز";
  const registrationRows = (registrations ?? []) as unknown as Registration[];
  const activeCount = registrationRows.filter((r) => ["pending","confirmed","waitlisted"].includes(r.status)).length;
  const completedCount = registrationRows.filter((r) => r.status === "completed").length;

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container dashboard-grid">
          <aside className="dashboard-side">
            <div className="brand"><span className="brand-mark" aria-hidden="true">ر</span><span>{displayName}</span></div>
            <div className="side-links">
              <Link href="/dashboard">نمای کلی</Link>
              <Link href="/dashboard/profile">پروفایل</Link>
              <Link href="/programs">برنامه‌ها</Link>
            </div>
          </aside>
          <section className="dashboard-main">
            <div className="dashboard-card">
              <span className="eyebrow">مسیر من</span>
              <h1 style={{fontSize:38}}>خوش آمدی، {displayName}</h1>
              <p className="lead" style={{fontSize:16}}>ثبت‌نام‌ها، دوره‌ها و فعالیت‌های آینده‌ات را از همین‌جا دنبال کن.</p>
            </div>
            <div className="metric-grid">
              <div className="metric"><strong>{activeCount}</strong><span>ثبت‌نام فعال</span></div>
              <div className="metric"><strong>{completedCount}</strong><span>برنامه تکمیل‌شده</span></div>
              <div className="metric"><strong>{profile?.onboarding_completed ? "✓" : "!"}</strong><span>{profile?.onboarding_completed ? "پروفایل تکمیل است" : "پروفایل نیاز به تکمیل دارد"}</span></div>
            </div>
            <div className="dashboard-card">
              <div className="section-head">
                <div><h2>برنامه‌های من</h2><p>آخرین وضعیت ثبت‌نام‌های شما</p></div>
                <Link className="btn btn-secondary" href="/programs">برنامه جدید</Link>
              </div>
              {!registrationRows.length ? (
                <div className="empty">هنوز در برنامه‌ای ثبت‌نام نکرده‌اید.</div>
              ) : (
                <div className="registration-list">
                  {registrationRows.map((registration) => {
                    const program = Array.isArray(registration.programs) ? registration.programs[0] : registration.programs;
                    return (
                      <div className="registration-row" key={registration.id}>
                        <div>
                          <strong>{program?.title ?? "برنامه"}</strong>
                          <div className="tag-row">
                            <span className="tag">{registration.status}</span>
                            <span className="tag">{new Date(registration.registered_at).toLocaleDateString("fa-IR")}</span>
                          </div>
                        </div>
                        {program?.slug && <Link className="btn btn-secondary" href={`/programs/${program.slug}`}>مشاهده</Link>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

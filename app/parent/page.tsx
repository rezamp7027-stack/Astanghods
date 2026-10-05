import Link from "next/link";
import { requireParent } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function ParentPage() {
  const { supabase, userId } = await requireParent();
  const { data: linkData } = await supabase
    .from("parent_links")
    .select("youth_user_id,relationship,consented_at")
    .eq("parent_user_id", userId)
    .eq("is_active", true)
    .not("consented_at", "is", null);

  const ids = [...new Set((linkData ?? []).map((link) => link.youth_user_id))];
  const [{ data: profileData }, { data: regData }, { data: enrollmentData }, { data: certData }, { data: attendanceData }] = ids.length
    ? await Promise.all([
        supabase.from("profiles").select("id,display_name,full_name").in("id", ids),
        supabase.from("registrations").select("user_id,status").in("user_id", ids),
        supabase.from("enrollments").select("user_id,status").in("user_id", ids),
        supabase.from("certificates").select("user_id,id,title").in("user_id", ids),
        supabase.from("attendance").select("user_id,status").in("user_id", ids),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const names = new Map((profileData ?? []).map((profile) => [profile.id, profile.display_name ?? profile.full_name ?? "فرزند"]));
  const registrations = regData ?? [];
  const enrollments = enrollmentData ?? [];
  const certificates = certData ?? [];
  const attendance = attendanceData ?? [];

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="admin-head">
            <div><span className="eyebrow">خانواده</span><h1>پنل والد</h1><p className="lead">خلاصه فعالیت فرزندان فقط با رضایت فعال.</p></div>
            <Link className="btn btn-secondary" href="/dashboard">داشبورد</Link>
          </div>

          <div className="admin-card-grid">
            {ids.map((id) => {
              const regs = registrations.filter((row) => row.user_id === id);
              const ens = enrollments.filter((row) => row.user_id === id);
              const certs = certificates.filter((row) => row.user_id === id);
              const at = attendance.filter((row) => row.user_id === id);
              return (
                <article className="admin-card" key={id}>
                  <h2>{names.get(id) ?? "فرزند"}</h2>
                  <div className="metric-grid compact">
                    <div className="metric"><strong>{regs.filter((row) => row.status === "confirmed").length}</strong><span>برنامه فعال</span></div>
                    <div className="metric"><strong>{ens.filter((row) => row.status === "active").length}</strong><span>دوره فعال</span></div>
                    <div className="metric"><strong>{at.filter((row) => row.status === "present" || row.status === "late").length}</strong><span>حضور</span></div>
                    <div className="metric"><strong>{certs.length}</strong><span>گواهی</span></div>
                  </div>
                </article>
              );
            })}
          </div>

          {!ids.length && <div className="empty">فرزند فعال و دارای رضایت برای این حساب پیدا نشد.</div>}
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

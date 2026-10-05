import Link from "next/link";
import { requireMentor } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export default async function MentorPage() {
  const { supabase, userId } = await requireMentor();
  const { data: assignments } = await supabase
    .from("mentor_assignments")
    .select("id,youth_user_id,program_id,started_at")
    .eq("mentor_user_id", userId)
    .is("ended_at", null);

  const ids = [...new Set((assignments ?? []).map((assignment) => assignment.youth_user_id))];
  const [{ data: profileData }, { data: registrationData }, { data: enrollmentData }, { data: progressData }, { data: attendanceData }] = ids.length
    ? await Promise.all([
        supabase.from("profiles").select("id,display_name,full_name").in("id", ids),
        supabase.from("registrations").select("user_id,status").in("user_id", ids),
        supabase.from("enrollments").select("user_id,status").in("user_id", ids),
        supabase.from("lesson_progress").select("user_id,progress_percent").in("user_id", ids),
        supabase.from("attendance").select("user_id,status").in("user_id", ids),
      ])
    : [{ data: [] }, { data: [] }, { data: [] }, { data: [] }, { data: [] }];

  const profiles = profileData ?? [];
  const registrations = registrationData ?? [];
  const enrollments = enrollmentData ?? [];
  const progress = progressData ?? [];
  const attendance = attendanceData ?? [];
  const names = new Map(profiles.map((profile) => [profile.id, profile.display_name ?? profile.full_name ?? "جوان"]));

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="admin-head">
            <div><span className="eyebrow">مربی</span><h1>پنل مربی</h1><p className="lead">فقط جوانان دارای assignment فعال در این پنل نمایش داده می‌شوند.</p></div>
            <Link className="btn btn-secondary" href="/dashboard">مسیر من</Link>
          </div>

          <div className="admin-card-grid">
            {ids.map((id) => {
              const rs = registrations.filter((row) => row.user_id === id);
              const es = enrollments.filter((row) => row.user_id === id);
              const ps = progress.filter((row) => row.user_id === id);
              const at = attendance.filter((row) => row.user_id === id);
              const avg = ps.length ? Math.round(ps.reduce((sum, row) => sum + Number(row.progress_percent), 0) / ps.length) : 0;
              return (
                <article className="admin-card" key={id}>
                  <h2>{names.get(id) ?? "جوان"}</h2>
                  <div className="metric-grid compact">
                    <div className="metric"><strong>{rs.filter((row) => row.status === "confirmed").length}</strong><span>برنامه فعال</span></div>
                    <div className="metric"><strong>{es.filter((row) => row.status === "active").length}</strong><span>دوره فعال</span></div>
                    <div className="metric"><strong>{avg}%</strong><span>میانگین پیشرفت</span></div>
                    <div className="metric"><strong>{at.filter((row) => row.status === "present" || row.status === "late").length}</strong><span>حضور</span></div>
                  </div>
                </article>
              );
            })}
          </div>

          {!ids.length && <div className="empty">هنوز جوانی به شما اختصاص داده نشده است.</div>}
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
const labels: Record<string, string> = { present: "حاضر", absent: "غایب", late: "با تأخیر", excused: "موجه" };

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login?next=/dashboard/attendance");

  const userId = String(claims.claims.sub);
  const { data: rowData, error } = await supabase
    .from("attendance")
    .select("id,status,session_id,created_at,event_sessions(title,starts_at)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = rowData ?? [];
  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">مسیر من</span>
            <h1>حضور و غیاب</h1>
            <p>سابقه حضور تو در جلسات.</p>
          </div>
          {error && <div className="notice error" role="alert">خطا در دریافت سابقه حضور.</div>}
          <div className="table-wrap">
            <table>
              <caption className="visually-hidden">سابقه حضور</caption>
              <thead><tr><th scope="col">جلسه</th><th scope="col">زمان</th><th scope="col">وضعیت</th></tr></thead>
              <tbody>
                {rows.map((row) => {
                  const session = Array.isArray(row.event_sessions) ? row.event_sessions[0] : row.event_sessions;
                  return (
                    <tr key={row.id}>
                      <th scope="row">{session?.title ?? "جلسه"}</th>
                      <td>{session?.starts_at ? new Date(session.starts_at).toLocaleString("fa-IR") : "-"}</td>
                      <td><span className="status">{labels[row.status] ?? row.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!rows.length && <div className="empty">هنوز سابقه‌ای برای شما ثبت نشده است.</div>}
          <Link className="btn btn-secondary" href="/dashboard">بازگشت</Link>
        </div>
      </main>
    </>
  );
}

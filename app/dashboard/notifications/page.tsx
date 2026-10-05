import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims) redirect("/login?next=/dashboard/notifications");
  const userId = String(claimsData.claims.sub);
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id,title,body,notification_type,read_at,created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head"><h1>اعلان‌ها</h1><p>پیام‌های مربوط به برنامه‌ها، آموزش و فعالیت‌های شما.</p></div>
          <div className="registration-list">
            {(notifications ?? []).map((item) => (
              <article className="registration-row" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                  <span className="tag">{new Date(item.created_at).toLocaleDateString("fa-IR")}</span>
                </div>
                <span className="status">{item.read_at ? "خوانده‌شده" : "جدید"}</span>
              </article>
            ))}
          </div>
          {!notifications?.length && <div className="empty">اعلان جدیدی ندارید.</div>}
        </div>
      </main>
    </>
  );
}

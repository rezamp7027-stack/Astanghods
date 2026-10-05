import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تأییدشده",
  waitlisted: "صف انتظار",
  cancelled: "لغوشده",
  completed: "تکمیل‌شده",
};

export default async function DashboardEventsPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login?next=/dashboard/events");

  const userId = String(claimsData.claims.sub);
  const { data: registrations, error } = await supabase
    .from("event_registrations")
    .select("id,status,registered_at,event_id,events(title,slug,starts_at,venue_name,city)")
    .eq("user_id", userId)
    .order("registered_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">مسیر من</span>
            <h1>رویدادهای من</h1>
            <p>ثبت‌نام‌ها و رویدادهایی که در آن‌ها مشارکت می‌کنی.</p>
          </div>

          {error ? <div className="notice error" role="alert">خطا در دریافت رویدادهای شما.</div> : null}

          <div className="registration-list">
            {(registrations ?? []).map((registration) => {
              const event = Array.isArray(registration.events) ? registration.events[0] : registration.events;
              return (
                <article className="registration-row" key={registration.id}>
                  <div>
                    <strong>{event?.title ?? "رویداد"}</strong>
                    <p className="muted">
                      {event?.starts_at ? new Date(event.starts_at).toLocaleString("fa-IR") : "زمان اعلام نشده"}
                      {event?.city ? ` · ${event.city}` : ""}
                      {event?.venue_name ? ` · ${event.venue_name}` : ""}
                    </p>
                    <div className="tag-row">
                      <span className="status">{statusLabels[registration.status] ?? registration.status}</span>
                      <span className="tag">ثبت‌نام {new Date(registration.registered_at).toLocaleDateString("fa-IR")}</span>
                    </div>
                  </div>
                  {event?.slug ? (
                    <Link className="btn btn-secondary" href={`/events/${event.slug}`}>
                      مشاهده
                    </Link>
                  ) : null}
                </article>
              );
            })}
          </div>

          {!registrations?.length && (
            <div className="empty">
              هنوز در رویدادی ثبت‌نام نکرده‌ای.
              <div className="button-row"><Link className="btn btn-primary" href="/events">کشف رویدادها</Link></div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

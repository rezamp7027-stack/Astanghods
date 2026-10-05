import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { EventRegistrationButton } from "@/components/event-registration-button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };
type EventSession = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location_name: string | null;
  capacity: number | null;
  sort_order: number;
};

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("id,title,slug,summary,description,starts_at,ends_at,venue_name,venue_address,city,capacity,is_public,program_id,event_sessions(id,title,starts_at,ends_at,location_name,capacity,sort_order)")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!event) notFound();

  const isPast = new Date(event.starts_at).getTime() < new Date().getTime();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub ? String(claims.claims.sub) : null;
  const { data: myReg } = !isPast && userId
    ? await supabase.from("event_registrations").select("status").eq("event_id", event.id).eq("user_id", userId).maybeSingle()
    : { data: null };

  const sessions = (Array.isArray(event.event_sessions) ? event.event_sessions : event.event_sessions ? [event.event_sessions] : []) as EventSession[];

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container detail-grid">
          <article className="detail-card">
            <span className="status">{isPast ? "رکورد آرشیوی" : "رویداد عمومی"}</span>
            <h1>{event.title}</h1>
            <p className="lead">{event.summary ?? ""}</p>
            <p>{event.description ?? "توضیحات این رویداد هنوز تکمیل نشده است."}</p>

            <div className="tag-row">
              <span className="tag">{new Date(event.starts_at).toLocaleString("fa-IR")}</span>
              {event.city && <span className="tag">{event.city}</span>}
              {event.venue_name && <span className="tag">{event.venue_name}</span>}
            </div>
            {event.venue_address && <div className="callout"><strong>نشانی</strong><br />{event.venue_address}</div>}

            {isPast && <div className="notice">این رویداد گذشته است و ثبت‌نام جدید برای آن فعال نیست.</div>}

            <h2>جلسات</h2>
            {sessions.length ? (
              <div className="registration-list">
                {[...sessions].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((session) => (
                  <div className="registration-row" key={session.id}>
                    <div>
                      <strong>{session.title}</strong>
                      <div className="muted">
                        {new Date(session.starts_at).toLocaleString("fa-IR")}
                        {session.location_name ? ` · ${session.location_name}` : ""}
                      </div>
                    </div>
                    <span className="tag">{session.capacity ?? event.capacity ?? "ظرفیت آزاد"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">برای این رویداد هنوز جلسه‌ای ثبت نشده است.</div>
            )}
          </article>

          <aside className="detail-card sticky">
            {isPast ? (
              <>
                <h2>آرشیو رویداد</h2>
                <p>اطلاعات این رویداد برای مستندسازی سوابق مؤسسه نگهداری شده است.</p>
                <Link className="btn btn-secondary" href="/events">بازگشت به رویدادها</Link>
              </>
            ) : (
              <>
                <h2>ثبت‌نام</h2>
                <p>{event.capacity ? `ظرفیت رویداد ${event.capacity} نفر است.` : "ثبت‌نام بدون ظرفیت اعلام‌شده."}</p>
                {userId ? (
                  <EventRegistrationButton eventId={event.id} initialStatus={myReg?.status ?? null} />
                ) : (
                  <Link className="btn btn-primary" href={`/login?next=/events/${event.slug}`}>ورود برای ثبت‌نام</Link>
                )}
                <Link className="btn btn-secondary" href="/events">بازگشت به رویدادها</Link>
              </>
            )}
          </aside>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

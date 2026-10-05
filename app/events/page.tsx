import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  starts_at: string;
  ends_at: string | null;
  venue_name: string | null;
  city: string | null;
  capacity: number | null;
};

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,slug,summary,starts_at,ends_at,venue_name,city,capacity")
    .eq("is_public", true)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <h1>رویدادها</h1>
            <p>برنامه‌های حضوری و رویدادهای پیش‌رو را یک‌جا دنبال کن.</p>
          </div>
          {error ? <div className="notice error">خطا در دریافت رویدادها.</div> : null}
          {!events?.length ? (
            <div className="empty">در حال حاضر رویداد عمومی آینده‌ای ثبت نشده است.</div>
          ) : (
            <div className="program-grid">
              {(events as EventRow[]).map((event) => (
                <article className="program-card" key={event.id}>
                  <div className="program-card-top">
                    <span className="status">رویداد عمومی</span>
                    {event.city && <span className="tag">{event.city}</span>}
                  </div>
                  <h2>{event.title}</h2>
                  <p>{event.summary ?? "توضیحات این رویداد هنوز ثبت نشده است."}</p>
                  <div className="meta">
                    <span>{new Date(event.starts_at).toLocaleDateString("fa-IR")}</span>
                    <span>{new Date(event.starts_at).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}</span>
                    {event.venue_name && <span>{event.venue_name}</span>}
                    {event.capacity && <span>ظرفیت {event.capacity} نفر</span>}
                  </div>
                  <div className="bottom">
                    <span className="tag">ثبت‌نام از صفحه برنامه</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

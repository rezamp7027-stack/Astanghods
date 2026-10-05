import Link from "next/link";
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

function EventCard({ event, historical }: { event: EventRow; historical: boolean }) {
  return (
    <article className="program-card">
      <div>
        <div className="program-card-top">
          <span className="status">{historical ? "آرشیوی" : "رویداد پیش‌رو"}</span>
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
      </div>
      <div className="bottom">
        <span className="tag">{historical ? "سابقه رویداد" : "ثبت‌نام آنلاین"}</span>
        <Link className="btn btn-secondary" href={`/events/${event.slug}`}>
          {historical ? "مشاهده آرشیو" : "جزئیات و ثبت‌نام"}
        </Link>
      </div>
    </article>
  );
}

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events, error } = await supabase
    .from("events")
    .select("id,title,slug,summary,starts_at,ends_at,venue_name,city,capacity")
    .eq("is_public", true)
    .order("starts_at", { ascending: false });

  const rows = (events ?? []) as EventRow[];
  const now = new Date().getTime();
  const upcoming = rows.filter((event) => new Date(event.starts_at).getTime() >= now).reverse();
  const historical = rows.filter((event) => new Date(event.starts_at).getTime() < now);

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">کشف</span>
            <h1>رویدادها</h1>
            <p>برنامه‌های حضوری و سوابق رویدادی مؤسسه را از یک مسیر دنبال کن.</p>
          </div>
          {error ? <div className="notice error" role="alert">خطا در دریافت رویدادها.</div> : null}

          <section>
            <div className="section-head"><div><h2>رویدادهای پیش‌رو</h2><p>فقط رویدادهای عمومی که هنوز زمانشان نرسیده است.</p></div></div>
            {upcoming.length ? (
              <div className="program-grid">{upcoming.map((event) => <EventCard key={event.id} event={event} historical={false} />)}</div>
            ) : (
              <div className="empty">در حال حاضر رویداد عمومی آینده‌ای ثبت نشده است.</div>
            )}
          </section>

          <section className="section">
            <div className="section-head"><div><h2>آرشیو رویدادها</h2><p>رویدادهای گذشته برای مستندسازی و مراجعه تاریخی.</p></div></div>
            {historical.length ? (
              <div className="program-grid">{historical.map((event) => <EventCard key={event.id} event={event} historical />)}</div>
            ) : (
              <div className="empty">آرشیو رویدادها هنوز خالی است.</div>
            )}
          </section>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

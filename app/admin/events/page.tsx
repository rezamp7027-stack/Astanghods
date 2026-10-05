import { requireStaff } from "@/lib/auth";
import Link from "next/link";
import { createEvent, createEventSession, promoteEventWaitlist } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const { supabase } = await requireStaff();
  const [{ data: eventData }, { data: sessionData }, { data: registrationData }, { data: programData }] = await Promise.all([
    supabase.from("events").select("id,title,slug,summary,starts_at,venue_name,city,is_public,program_id,capacity").order("starts_at",{ascending:false}).limit(200),
    supabase.from("event_sessions").select("id,event_id,title,starts_at,location_name").order("starts_at",{ascending:false}).limit(300),
    supabase.from("event_registrations").select("event_id,status"),
    supabase.from("programs").select("id,title").order("title"),
  ]);

  const events=eventData??[], sessions=sessionData??[], registrations=registrationData??[], programs=programData??[];
  const programNames=new Map(programs.map(p=>[p.id,p.title]));

  return <section>
    <div className="admin-head">
      <div><span className="eyebrow">رویداد</span><h1>رویدادها و جلسات</h1><p className="lead">تقویم عملیاتی، ظرفیت، ثبت‌نام و صف انتظار رویدادها.</p></div>
    </div>

    <div className="admin-card">
      <form className="admin-form" action={createEvent}>
        <fieldset><legend>رویداد جدید</legend><div className="form-grid">
          <div className="field"><label htmlFor="event-title">عنوان *</label><input id="event-title" name="title" required maxLength={180}/></div>
          <div className="field"><label htmlFor="event-slug">شناسه *</label><input id="event-slug" name="slug" required pattern="[a-z0-9-]+" maxLength={100}/></div>
          <div className="field"><label htmlFor="event-starts">شروع *</label><input id="event-starts" name="starts_at" type="datetime-local" required/></div>
          <div className="field"><label htmlFor="event-ends">پایان</label><input id="event-ends" name="ends_at" type="datetime-local"/></div>
          <div className="field"><label htmlFor="event-city">شهر</label><input id="event-city" name="city" maxLength={100}/></div>
          <div className="field"><label htmlFor="event-venue">محل</label><input id="event-venue" name="venue_name" maxLength={200}/></div>
          <div className="field"><label htmlFor="event-address">نشانی</label><input id="event-address" name="venue_address" maxLength={500}/></div>
          <div className="field"><label htmlFor="event-capacity">ظرفیت</label><input id="event-capacity" name="capacity" type="number" min={1} inputMode="numeric"/></div>
          <div className="field"><label htmlFor="event-program">برنامه مرتبط</label><select id="event-program" name="program_id" defaultValue=""><option value="">بدون برنامه</option>{programs.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
          <div className="field"><label htmlFor="event-public">نمایش عمومی</label><select id="event-public" name="is_public" defaultValue="true"><option value="true">عمومی</option><option value="false">خصوصی</option></select></div>
          <div className="field field-wide"><label htmlFor="event-summary">خلاصه</label><textarea id="event-summary" name="summary" rows={3} maxLength={600}/></div>
          <div className="field field-wide"><label htmlFor="event-description">توضیحات</label><textarea id="event-description" name="description" rows={6} maxLength={8000}/></div>
        </div></fieldset>
        <button className="btn btn-primary" type="submit">ایجاد رویداد</button>
      </form>
    </div>

    <div className="admin-card">
      <h2>جلسه جدید</h2>
      <form className="admin-form" action={createEventSession}>
        <fieldset><legend>افزودن جلسه به رویداد</legend><div className="form-grid">
          <div className="field field-wide"><label htmlFor="session-event">رویداد *</label><select id="session-event" name="event_id" required><option value="">انتخاب</option>{events.map(e=><option value={e.id} key={e.id}>{e.title}</option>)}</select></div>
          <div className="field"><label htmlFor="session-title">عنوان جلسه *</label><input id="session-title" name="title" required maxLength={180}/></div>
          <div className="field"><label htmlFor="session-starts">شروع *</label><input id="session-starts" name="starts_at" type="datetime-local" required/></div>
          <div className="field"><label htmlFor="session-ends">پایان</label><input id="session-ends" name="ends_at" type="datetime-local"/></div>
          <div className="field"><label htmlFor="session-location">محل</label><input id="session-location" name="location_name" maxLength={200}/></div>
          <div className="field"><label htmlFor="session-capacity">ظرفیت</label><input id="session-capacity" name="capacity" type="number" min={1} inputMode="numeric"/></div>
        </div></fieldset>
        <button className="btn btn-secondary" type="submit" disabled={!events.length}>افزودن جلسه</button>
      </form>
    </div>

    <div className="admin-card-grid">
      {events.map((event) => {
        const eventRegs=registrations.filter(r=>r.event_id===event.id);
        const confirmed=eventRegs.filter(r=>r.status==="confirmed").length;
        const waitlisted=eventRegs.filter(r=>r.status==="waitlisted").length;
        return <article className="admin-card" key={event.id}>
          <span className="status">{event.is_public?"عمومی":"خصوصی"}</span>
          <h2>{event.title}</h2>
          <p>{event.city??"بدون شهر"} · {new Date(event.starts_at).toLocaleString("fa-IR")}</p>
          {event.program_id && <p className="muted">برنامه: {programNames.get(event.program_id)??"برنامه"}</p>}
          <div className="metric-grid compact">
            <div className="metric"><strong>{confirmed}</strong><span>تأییدشده{event.capacity ? ` از ${event.capacity}` : ""}</span></div>
            <div className="metric"><strong>{waitlisted}</strong><span>صف انتظار</span></div>
            <div className="metric"><strong>{sessions.filter(s=>s.event_id===event.id).length}</strong><span>جلسه</span></div>
          </div>
          <div className="tag-row">{sessions.filter(s=>s.event_id===event.id).slice(0,4).map(s=><span className="tag" key={s.id}>{s.title}</span>)}</div><div className="button-row"><Link className="btn btn-secondary btn-small" href={"/admin/events/"+event.id}>ویرایش رویداد</Link></div>
          {waitlisted>0 && event.capacity!=null && confirmed<event.capacity && (
            <form action={promoteEventWaitlist} className="button-row">
              <input type="hidden" name="event_id" value={event.id}/>
              <button className="btn btn-secondary" type="submit">ارتقای نفر بعد از صف</button>
            </form>
          )}
        </article>;
      })}
    </div>
    {!events.length&&<div className="empty">هنوز رویدادی ثبت نشده است.</div>}
  </section>;
}

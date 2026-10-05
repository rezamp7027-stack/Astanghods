import { requireStaff } from "@/lib/auth";
import { createVolunteerOpportunity, updateVolunteerAssignment } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminVolunteerPage() {
  const { supabase } = await requireStaff();
  const [{ data: oppData }, { data: assignmentData }] = await Promise.all([
    supabase.from("volunteer_opportunities").select("id,title,slug,status,city,starts_at,capacity").order("created_at", { ascending: false }).limit(200),
    supabase.from("volunteer_assignments").select("id,opportunity_id,user_id,status,applied_at").order("applied_at", { ascending: false }).limit(300)
  ]);
  const opportunities = oppData ?? [];
  const assignments = assignmentData ?? [];

  return (
    <section>
      <div className="admin-head"><div><span className="eyebrow">خدمت</span><h1>مدیریت داوطلبی</h1><p className="lead">فرصت‌ها و وضعیت درخواست‌های مشارکت.</p></div></div>

      <div className="admin-card">
        <form className="admin-form" action={createVolunteerOpportunity}>
          <fieldset><legend>فرصت جدید</legend><div className="form-grid">
            <div className="field"><label htmlFor="vol-title">عنوان *</label><input id="vol-title" name="title" required /></div>
            <div className="field"><label htmlFor="vol-slug">شناسه *</label><input id="vol-slug" name="slug" required pattern="[a-z0-9-]+" /></div>
            <div className="field"><label htmlFor="vol-status">وضعیت</label><select id="vol-status" name="status"><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option><option value="closed">بسته</option></select></div>
            <div className="field"><label htmlFor="vol-city">شهر</label><input id="vol-city" name="city" /></div>
            <div className="field"><label htmlFor="vol-start">شروع</label><input id="vol-start" name="starts_at" type="datetime-local" /></div>
            <div className="field"><label htmlFor="vol-end">پایان</label><input id="vol-end" name="ends_at" type="datetime-local" /></div>
            <div className="field"><label htmlFor="vol-capacity">ظرفیت</label><input id="vol-capacity" name="capacity" type="number" min={1} inputMode="numeric" /></div>
            <div className="field field-wide"><label htmlFor="vol-skills">مهارت‌های مرتبط</label><input id="vol-skills" name="skills" /></div>
            <div className="field field-wide"><label htmlFor="vol-summary">خلاصه</label><textarea id="vol-summary" name="summary" rows={3} /></div>
            <div className="field field-wide"><label htmlFor="vol-description">توضیحات</label><textarea id="vol-description" name="description" rows={6} /></div>
          </div></fieldset>
          <button className="btn btn-primary" type="submit">ذخیره فرصت</button>
        </form>
      </div>

      <div className="admin-card-grid">
        {assignments.map((assignment) => (
          <article className="admin-card" key={assignment.id}>
            <h2>{assignment.user_id.slice(0, 8)}…</h2>
            <p>{opportunities.find((opportunity) => opportunity.id === assignment.opportunity_id)?.title ?? "فرصت"} · {assignment.status}</p>
            <form className="inline-form" action={updateVolunteerAssignment}>
              <input type="hidden" name="assignment_id" value={assignment.id} />
              <select name="status" defaultValue={assignment.status} aria-label="وضعیت درخواست">
                <option value="applied">درخواست</option><option value="selected">انتخاب‌شده</option><option value="confirmed">تأیید</option><option value="cancelled">لغو</option><option value="completed">تکمیل</option>
              </select>
              <button className="btn btn-secondary btn-small" type="submit">ذخیره</button>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}

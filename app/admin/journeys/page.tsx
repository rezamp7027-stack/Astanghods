import { requireStaff } from "@/lib/auth";
import { createJourney, createJourneyStep } from "@/app/admin/actions";

export const dynamic="force-dynamic";

export default async function AdminJourneysPage(){
  const {supabase}=await requireStaff();
  const [{data:journeyData},{data:stepData},{data:enrollmentData}]=await Promise.all([
    supabase.from("journeys").select("id,name,slug,description,trigger_type,is_active,created_at").order("created_at",{ascending:false}),
    supabase.from("journey_steps").select("id,journey_id,step_order,action_type,delay_minutes,config").order("step_order"),
    supabase.from("journey_enrollments").select("id,journey_id,status,current_step,next_run_at").order("enrolled_at",{ascending:false}).limit(500)
  ]);
  const journeys=journeyData??[],steps=stepData??[],enrollments=enrollmentData??[];
  return (
    <section>
      <div className="admin-head">
        <div><span className="eyebrow">CRM</span><h1>Journeyها</h1><p className="lead">مسیرهای پس از تعامل برای تداوم ارتباط و یادگیری.</p></div>
      </div>
      <div className="admin-card">
        <form className="admin-form" action={createJourney}>
          <fieldset><legend>Journey جدید</legend><div className="form-grid">
            <div className="field"><label htmlFor="journey-name">نام *</label><input id="journey-name" name="name" required maxLength={180}/></div>
            <div className="field"><label htmlFor="journey-slug">شناسه *</label><input id="journey-slug" name="slug" required pattern="[a-z0-9-]+"/></div>
            <div className="field"><label htmlFor="journey-trigger">تریگر</label><select id="journey-trigger" name="trigger_type"><option value="manual">دستی</option><option value="registration">ثبت‌نام</option><option value="completion">تکمیل</option><option value="inactivity">عدم فعالیت</option></select></div>
            <div className="field field-wide"><label htmlFor="journey-description">توضیحات</label><textarea id="journey-description" name="description" rows={4}/></div>
          </div></fieldset>
          <button className="btn btn-primary" type="submit">ایجاد Journey</button>
        </form>
      </div>
      <div className="admin-card">
        <form className="admin-form" action={createJourneyStep}>
          <fieldset><legend>مرحله جدید</legend><div className="form-grid">
            <div className="field"><label htmlFor="step-journey">شناسه Journey *</label><input id="step-journey" name="journey_id" required/></div>
            <div className="field"><label htmlFor="step-order">شماره مرحله *</label><input id="step-order" name="step_order" type="number" min={1} required/></div>
            <div className="field"><label htmlFor="step-action">نوع اقدام *</label><select id="step-action" name="action_type"><option value="notification">اعلان</option><option value="recommendation">پیشنهاد</option><option value="task">کار</option><option value="wait">انتظار</option></select></div>
            <div className="field"><label htmlFor="step-delay">تأخیر دقیقه</label><input id="step-delay" name="delay_minutes" type="number" min={0} defaultValue={0}/></div>
            <div className="field field-wide"><label htmlFor="step-config">تنظیمات JSON</label><textarea id="step-config" name="config" rows={6} placeholder='{"title":"پیام بعدی"}'/></div>
          </div></fieldset>
          <button className="btn btn-secondary" type="submit">افزودن مرحله</button>
        </form>
      </div>
      <div className="admin-card-grid">
        {journeys.map(j=>{
          const js=steps.filter(s=>s.journey_id===j.id);
          const active=enrollments.filter(e=>e.journey_id===j.id&&e.status==="active").length;
          const completed=enrollments.filter(e=>e.journey_id===j.id&&e.status==="completed").length;
          return <article className="admin-card" key={j.id}><span className="status">{j.is_active?"فعال":"متوقف"}</span><h2>{j.name}</h2><p>{j.description??""}</p><div className="metric-grid compact"><div className="metric"><strong>{js.length}</strong><span>مرحله</span></div><div className="metric"><strong>{active}</strong><span>فعال</span></div><div className="metric"><strong>{completed}</strong><span>تکمیل</span></div></div></article>;
        })}
      </div>
      {!journeys.length&&<div className="empty">هنوز Journeyای تعریف نشده است.</div>}
    </section>
  );
}
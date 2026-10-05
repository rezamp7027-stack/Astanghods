import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { updateEvent } from "@/app/admin/actions";

export const dynamic="force-dynamic";

export default async function EditEventPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 const {supabase}=await requireStaff();
 const [{data:event},{data:programData}]=await Promise.all([
  supabase.from("events").select("*").eq("id",id).maybeSingle(),
  supabase.from("programs").select("id,title").order("title")
 ]);
 if(!event)notFound();
 const programs=programData??[];
 const dateValue=(value:string|null)=>value?new Date(value).toISOString().slice(0,16):"";
 return <section>
  <div className="page-head"><span className="eyebrow">رویداد</span><h1>ویرایش رویداد</h1><p>{event.title}</p></div>
  <form className="admin-form" action={updateEvent}>
   <input type="hidden" name="event_id" value={event.id}/>
   <fieldset><legend>اطلاعات رویداد</legend><div className="form-grid">
    <div className="field"><label htmlFor="title">عنوان *</label><input id="title" name="title" required defaultValue={event.title} maxLength={180}/></div>
    <div className="field"><label htmlFor="slug">شناسه *</label><input id="slug" name="slug" required pattern="[a-z0-9-]+" defaultValue={event.slug}/></div>
    <div className="field"><label htmlFor="starts_at">شروع *</label><input id="starts_at" name="starts_at" type="datetime-local" required defaultValue={dateValue(event.starts_at)}/></div>
    <div className="field"><label htmlFor="ends_at">پایان</label><input id="ends_at" name="ends_at" type="datetime-local" defaultValue={dateValue(event.ends_at)}/></div>
    <div className="field"><label htmlFor="city">شهر</label><input id="city" name="city" defaultValue={event.city??""}/></div>
    <div className="field"><label htmlFor="venue_name">محل</label><input id="venue_name" name="venue_name" defaultValue={event.venue_name??""}/></div>
    <div className="field field-wide"><label htmlFor="venue_address">نشانی</label><input id="venue_address" name="venue_address" defaultValue={event.venue_address??""}/></div>
    <div className="field"><label htmlFor="capacity">ظرفیت</label><input id="capacity" name="capacity" type="number" min={1} defaultValue={event.capacity??""}/></div>
    <div className="field"><label htmlFor="program_id">برنامه مرتبط</label><select id="program_id" name="program_id" defaultValue={event.program_id??""}><option value="">بدون برنامه</option>{programs.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
    <div className="field"><label htmlFor="is_public">نمایش</label><select id="is_public" name="is_public" defaultValue={event.is_public?"true":"false"}><option value="true">عمومی</option><option value="false">خصوصی</option></select></div>
    <div className="field field-wide"><label htmlFor="summary">خلاصه</label><textarea id="summary" name="summary" rows={3} defaultValue={event.summary??""}/></div>
    <div className="field field-wide"><label htmlFor="description">توضیحات</label><textarea id="description" name="description" rows={8} defaultValue={event.description??""}/></div>
   </div></fieldset>
   <div className="button-row"><button className="btn btn-primary" type="submit">ذخیره تغییرات</button><Link className="btn btn-secondary" href="/admin/events">بازگشت</Link></div>
  </form>
 </section>;
}

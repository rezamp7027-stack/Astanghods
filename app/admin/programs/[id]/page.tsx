import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { updateProgram } from "@/app/admin/actions";

export const dynamic="force-dynamic";

export default async function EditProgramPage({params}:{params:Promise<{id:string}>}) {
 const {id}=await params;
 const {supabase}=await requireStaff();
 const [{data:program},{data:provinceData}]=await Promise.all([
   supabase.from("programs").select("*").eq("id",id).maybeSingle(),
   supabase.from("provinces").select("id,name").order("name")
 ]);
 if(!program)notFound();
 const provinces=provinceData??[];
 const dateValue=(value:string|null)=>value?new Date(value).toISOString().slice(0,16):"";
 return <section>
   <div className="page-head"><span className="eyebrow">مدیریت برنامه</span><h1>ویرایش {program.title}</h1><p>اطلاعات، ظرفیت، استان و وضعیت انتشار را به‌روزرسانی کنید.</p></div>
   <form className="admin-form" action={updateProgram}>
    <input type="hidden" name="program_id" value={program.id}/>
    <fieldset><legend>جزئیات برنامه</legend><div className="form-grid">
      <div className="field"><label htmlFor="title">عنوان *</label><input id="title" name="title" required defaultValue={program.title} maxLength={160}/></div>
      <div className="field"><label htmlFor="slug">شناسه آدرس *</label><input id="slug" name="slug" required pattern="[a-z0-9-]+" defaultValue={program.slug} maxLength={100}/></div>
      <div className="field"><label htmlFor="status">وضعیت *</label><select id="status" name="status" defaultValue={program.status}><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option><option value="registration_closed">ثبت‌نام بسته</option><option value="running">در حال اجرا</option><option value="completed">تکمیل‌شده</option><option value="archived">بایگانی</option></select></div>
      <div className="field"><label htmlFor="program_type">نوع</label><input id="program_type" name="program_type" defaultValue={program.program_type}/></div>
      <div className="field"><label htmlFor="province_id">استان</label><select id="province_id" name="province_id" defaultValue={program.province_id??""}><option value="">بدون استان</option>{provinces.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div className="field"><label htmlFor="city">شهر</label><input id="city" name="city" defaultValue={program.city??""}/></div>
      <div className="field"><label htmlFor="location_name">محل</label><input id="location_name" name="location_name" defaultValue={program.location_name??""}/></div>
      <div className="field"><label htmlFor="capacity">ظرفیت</label><input id="capacity" name="capacity" type="number" min={1} defaultValue={program.capacity??""}/></div>
      <div className="field"><label htmlFor="min_age">حداقل سن</label><input id="min_age" name="min_age" type="number" min={0} max={100} defaultValue={program.audience_min_age??""}/></div>
      <div className="field"><label htmlFor="max_age">حداکثر سن</label><input id="max_age" name="max_age" type="number" min={0} max={100} defaultValue={program.audience_max_age??""}/></div>
      <div className="field"><label htmlFor="start_at">شروع</label><input id="start_at" name="start_at" type="datetime-local" defaultValue={dateValue(program.start_at)}/></div>
      <div className="field"><label htmlFor="end_at">پایان</label><input id="end_at" name="end_at" type="datetime-local" defaultValue={dateValue(program.end_at)}/></div>
      <div className="field"><label htmlFor="registration_open_at">شروع ثبت‌نام</label><input id="registration_open_at" name="registration_open_at" type="datetime-local" defaultValue={dateValue(program.registration_open_at)}/></div>
      <div className="field"><label htmlFor="registration_close_at">پایان ثبت‌نام</label><input id="registration_close_at" name="registration_close_at" type="datetime-local" defaultValue={dateValue(program.registration_close_at)}/></div>
      <div className="field field-wide"><label htmlFor="summary">خلاصه</label><textarea id="summary" name="summary" rows={3} defaultValue={program.summary??""}/></div>
      <div className="field field-wide"><label htmlFor="description">توضیحات</label><textarea id="description" name="description" rows={8} defaultValue={program.description??""}/></div>
    </div></fieldset>
    <div className="button-row"><button className="btn btn-primary" type="submit">ذخیره تغییرات</button><Link className="btn btn-secondary" href="/admin/programs">بازگشت</Link></div>
   </form>
 </section>;
}

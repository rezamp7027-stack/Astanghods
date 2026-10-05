import Link from "next/link";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { createProgram } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function NewProgramPage() {
  const { supabase } = await requireStaff();
  const { data: provinceData } = await supabase.from("provinces").select("id,name").order("name");
  const provinces = provinceData ?? [];

  return (
    <section>
      <div className="page-head">
        <span className="eyebrow">مدیریت</span>
        <h1>ایجاد برنامه</h1>
        <p>اطلاعات اصلی برنامه را وارد کنید.</p>
      </div>
      <form className="admin-form" action={createProgram}>
        <fieldset>
          <legend>اطلاعات اصلی</legend>
          <div className="form-grid">
            <div className="field"><label htmlFor="title">عنوان *</label><input id="title" name="title" required maxLength={160} /></div>
            <div className="field"><label htmlFor="slug">شناسه آدرس *</label><input id="slug" name="slug" required pattern="[a-z0-9-]+" maxLength={100} /><small>فقط حروف انگلیسی کوچک، عدد و خط تیره.</small></div>
            <div className="field"><label htmlFor="program_type">نوع برنامه *</label><input id="program_type" name="program_type" defaultValue="training" required maxLength={80} /></div>
            <div className="field"><label htmlFor="status">وضعیت *</label><select id="status" name="status" defaultValue="draft"><option value="draft">پیش‌نویس</option><option value="published">منتشرشده</option><option value="registration_closed">ثبت‌نام بسته</option><option value="running">در حال اجرا</option></select></div>
            <div className="field"><label htmlFor="province_id">استان</label><select id="province_id" name="province_id" defaultValue=""><option value="">بدون استان</option>{provinces.map((p)=><option value={p.id} key={p.id}>{p.name}</option>)}</select></div>
            <div className="field"><label htmlFor="city">شهر</label><input id="city" name="city" maxLength={100} /></div>
            <div className="field"><label htmlFor="location_name">محل</label><input id="location_name" name="location_name" maxLength={200} /></div>
            <div className="field"><label htmlFor="capacity">ظرفیت</label><input id="capacity" name="capacity" type="number" min={1} max={100000} inputMode="numeric" /></div>
            <div className="field"><label htmlFor="min_age">حداقل سن</label><input id="min_age" name="min_age" type="number" min={0} max={100} inputMode="numeric" /></div>
            <div className="field"><label htmlFor="max_age">حداکثر سن</label><input id="max_age" name="max_age" type="number" min={0} max={100} inputMode="numeric" /></div>
            <div className="field"><label htmlFor="start_at">شروع</label><input id="start_at" name="start_at" type="datetime-local" /></div>
            <div className="field"><label htmlFor="end_at">پایان</label><input id="end_at" name="end_at" type="datetime-local" /></div>
            <div className="field"><label htmlFor="registration_open_at">شروع ثبت‌نام</label><input id="registration_open_at" name="registration_open_at" type="datetime-local" /></div>
            <div className="field"><label htmlFor="registration_close_at">پایان ثبت‌نام</label><input id="registration_close_at" name="registration_close_at" type="datetime-local" /></div>
            <div className="field field-wide"><label htmlFor="summary">خلاصه</label><textarea id="summary" name="summary" rows={3} maxLength={500} /></div>
            <div className="field field-wide"><label htmlFor="description">توضیحات</label><textarea id="description" name="description" rows={7} maxLength={8000} /></div>
          </div>
        </fieldset>
        <div className="button-row"><button className="btn btn-primary" type="submit">ذخیره برنامه</button><Link className="btn btn-secondary" href="/admin/programs">انصراف</Link></div>
      </form>
    </section>
  );
}

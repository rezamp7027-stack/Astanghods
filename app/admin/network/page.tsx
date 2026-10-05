import { requireStaff } from "@/lib/auth";
import { createOrganization, addOrganizationMember } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminNetworkPage() {
  const { supabase } = await requireStaff();
  const [{ data: orgData }, { data: provinceData }, { data: profileData }] = await Promise.all([
    supabase.from("organizations").select("id,name,slug,organization_type,city,is_active,province_id").order("created_at", { ascending: false }),
    supabase.from("provinces").select("id,name").order("name"),
    supabase.from("profiles").select("id,display_name,full_name").order("created_at",{ascending:false}).limit(500),
  ]);
  const orgs = orgData ?? [];
  const provinces = provinceData ?? [];
  const profiles = profileData ?? [];
  const provinceNames = new Map(provinces.map((p) => [p.id, p.name]));

  return (
    <section>
      <div className="admin-head"><div><span className="eyebrow">شبکه</span><h1>سازمان‌ها و شبکه استانی</h1><p className="lead">مدارس، مراکز و واحدهای شبکه را مدیریت کنید.</p></div></div>
      <div className="admin-card">
        <form className="admin-form" action={createOrganization}>
          <fieldset><legend>افزودن سازمان</legend><div className="form-grid">
            <div className="field"><label htmlFor="name">نام سازمان *</label><input id="name" name="name" required maxLength={180} /></div>
            <div className="field"><label htmlFor="slug">شناسه *</label><input id="slug" name="slug" required pattern="[a-z0-9-]+" maxLength={100} /></div>
            <div className="field"><label htmlFor="organization_type">نوع سازمان</label><select id="organization_type" name="organization_type" defaultValue="school"><option value="school">مدرسه</option><option value="center">مرکز</option><option value="mosque">مسجد</option><option value="ngo">تشکل</option><option value="other">سایر</option></select></div>
            <div className="field"><label htmlFor="province_id">استان</label><select id="province_id" name="province_id" defaultValue=""><option value="">بدون استان</option>{provinces.map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
            <div className="field"><label htmlFor="city">شهر</label><input id="city" name="city" maxLength={100} /></div>
            <div className="field"><label htmlFor="website">وب‌سایت</label><input id="website" name="website" type="url" inputMode="url" /></div>
            <div className="field field-wide"><label htmlFor="description">توضیحات</label><textarea id="description" name="description" rows={4} maxLength={2000} /></div>
          </div></fieldset>
          <button className="btn btn-primary" type="submit">ثبت سازمان</button>
        </form>
      </div>
      <div className="admin-card"><h2>افزودن عضو به مجموعه</h2><form className="admin-form" action={addOrganizationMember}><fieldset><legend>عضویت سازمانی</legend><div className="form-grid">
<div className="field"><label htmlFor="member-org">مجموعه *</label><select id="member-org" name="organization_id" required><option value="">انتخاب مجموعه</option>{orgs.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
<div className="field"><label htmlFor="member-user">کاربر *</label><select id="member-user" name="user_id" required><option value="">انتخاب کاربر</option>{profiles.map(p=><option key={p.id} value={p.id}>{p.display_name??p.full_name??p.id.slice(0,8)}</option>)}</select></div>
<div className="field"><label htmlFor="member-role">نقش</label><select id="member-role" name="role_name" defaultValue="member"><option value="member">عضو</option><option value="manager">مدیر</option><option value="editor">ویرایشگر</option></select></div>
</div></fieldset><button className="btn btn-secondary" type="submit" disabled={!orgs.length||!profiles.length}>افزودن عضو</button></form></div>
      <div className="admin-card-grid">
        {orgs.map((o) => <article className="admin-card" key={o.id}><span className="status">{o.is_active ? "فعال" : "غیرفعال"}</span><h2>{o.name}</h2><p>{provinceNames.get(o.province_id ?? "") ?? "بدون استان"} · {o.city ?? "بدون شهر"} · {o.organization_type}</p></article>)}
      </div>
      {!orgs.length && <div className="empty">هنوز سازمانی ثبت نشده است.</div>}
    </section>
  );
}

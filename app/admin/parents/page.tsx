import { requireStaff } from "@/lib/auth";
import { createParentLink } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminParentsPage() {
  const { supabase } = await requireStaff();
  const [{ data: linkData }, { data: profileData }] = await Promise.all([
    supabase.from("parent_links").select("id,parent_user_id,youth_user_id,relationship,consented_at,is_active").order("created_at",{ascending:false}).limit(200),
    supabase.from("profiles").select("id,display_name,full_name").order("created_at",{ascending:false}).limit(500),
  ]);
  const links=linkData??[], profiles=profileData??[];
  const names=new Map(profiles.map(p=>[p.id,p.display_name??p.full_name??"کاربر"]));

  return <section>
    <div className="admin-head"><div><span className="eyebrow">خانواده</span><h1>روابط والد و جوان</h1><p className="lead">رابطه ایجاد می‌شود و سپس خود جوان رضایت را تأیید می‌کند.</p></div></div>
    <div className="admin-card"><form className="admin-form" action={createParentLink}><fieldset><legend>ایجاد رابطه</legend><div className="form-grid">
      <div className="field"><label htmlFor="parent_user_id">والد *</label><select id="parent_user_id" name="parent_user_id" required><option value="">انتخاب والد</option>{profiles.map(p=><option value={p.id} key={p.id}>{names.get(p.id)??p.id.slice(0,8)}</option>)}</select></div>
      <div className="field"><label htmlFor="youth_user_id">جوان *</label><select id="youth_user_id" name="youth_user_id" required><option value="">انتخاب جوان</option>{profiles.map(p=><option value={p.id} key={p.id}>{names.get(p.id)??p.id.slice(0,8)}</option>)}</select></div>
      <div className="field"><label htmlFor="relationship">نسبت</label><select id="relationship" name="relationship" defaultValue="parent"><option value="parent">والد</option><option value="guardian">سرپرست</option><option value="other">سایر</option></select></div>
    </div></fieldset><button className="btn btn-primary" type="submit" disabled={!profiles.length}>ایجاد رابطه</button></form></div>
    <div className="table-wrap"><table><caption className="visually-hidden">روابط والد</caption><thead><tr><th scope="col">والد</th><th scope="col">جوان</th><th scope="col">وضعیت رضایت</th><th scope="col">نسبت</th></tr></thead><tbody>
      {links.map(l=><tr key={l.id}><th scope="row">{names.get(l.parent_user_id)??l.parent_user_id.slice(0,8)}</th><td>{names.get(l.youth_user_id)??l.youth_user_id.slice(0,8)}</td><td><span className="status">{l.consented_at?"رضایت تأیید شده":"در انتظار رضایت"}</span></td><td>{l.relationship??"والد"}</td></tr>)}
    </tbody></table></div>
    {!links.length&&<div className="empty">هیچ رابطه‌ای ثبت نشده است.</div>}
  </section>;
}

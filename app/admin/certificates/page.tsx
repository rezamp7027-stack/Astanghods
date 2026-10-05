import { requireStaff } from "@/lib/auth";
import { issueCertificate } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const { supabase } = await requireStaff();
  const [{ data: certData }, { data: profileData }, { data: courseData }, { data: programData }] = await Promise.all([
    supabase.from("certificates").select("id,user_id,title,certificate_number,verification_code,issued_at,revoked_at").order("issued_at",{ascending:false}).limit(200),
    supabase.from("profiles").select("id,display_name,full_name").order("created_at",{ascending:false}).limit(500),
    supabase.from("courses").select("id,title").order("title"),
    supabase.from("programs").select("id,title").order("title"),
  ]);
  const rows=certData??[], profiles=profileData??[], courses=courseData??[], programs=programData??[];
  const names=new Map(profiles.map(p=>[p.id,p.display_name??p.full_name??"کاربر"]));

  return <section>
    <div className="admin-head"><div><span className="eyebrow">اعتبار</span><h1>گواهی‌ها</h1><p className="lead">صدور و پایش گواهی دیجیتال با کد قابل استعلام عمومی.</p></div></div>
    <div className="admin-card">
      <form className="admin-form" action={issueCertificate}>
        <fieldset><legend>صدور گواهی</legend><div className="form-grid">
          <div className="field"><label htmlFor="user_id">جوان *</label><select id="user_id" name="user_id" required><option value="">انتخاب جوان</option>{profiles.map(p=><option value={p.id} key={p.id}>{p.display_name??p.full_name??p.id.slice(0,8)}</option>)}</select></div>
          <div className="field"><label htmlFor="title">عنوان *</label><input id="title" name="title" required maxLength={200}/></div>
          <div className="field"><label htmlFor="certificate_number">شماره گواهی *</label><input id="certificate_number" name="certificate_number" required maxLength={80} placeholder="مثلاً AQR-2026-0001"/></div>
          <div className="field"><label htmlFor="course_id">دوره مرتبط</label><select id="course_id" name="course_id" defaultValue=""><option value="">بدون دوره</option>{courses.map(c=><option value={c.id} key={c.id}>{c.title}</option>)}</select></div>
          <div className="field"><label htmlFor="program_id">برنامه مرتبط</label><select id="program_id" name="program_id" defaultValue=""><option value="">بدون برنامه</option>{programs.map(p=><option value={p.id} key={p.id}>{p.title}</option>)}</select></div>
        </div></fieldset>
        <div className="notice">حداقل یکی از «دوره مرتبط» یا «برنامه مرتبط» باید انتخاب شود.</div>
        <button className="btn btn-primary" type="submit" disabled={!profiles.length}>صدور گواهی</button>
      </form>
    </div>
    <div className="table-wrap"><table><caption className="visually-hidden">گواهی‌های صادرشده</caption><thead><tr><th scope="col">دریافت‌کننده</th><th scope="col">عنوان</th><th scope="col">شماره</th><th scope="col">وضعیت</th><th scope="col">کد</th></tr></thead><tbody>
      {rows.map(r=><tr key={r.id}><th scope="row">{names.get(r.user_id)??r.user_id.slice(0,8)}</th><td>{r.title}</td><td>{r.certificate_number}</td><td><span className="status">{r.revoked_at?"باطل":"معتبر"}</span></td><td><code>{r.verification_code}</code></td></tr>)}
    </tbody></table></div>
    {!rows.length&&<div className="empty">هنوز گواهی‌ای صادر نشده است.</div>}
  </section>;
}

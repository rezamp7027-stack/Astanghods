import { requireStaff } from "@/lib/auth";
import { assignMentor } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminMentorsPage() {
  const { supabase } = await requireStaff();
  const [{ data: mentorData }, { data: assignmentData }, { data: profileData }, { data: programData }] = await Promise.all([
    supabase.from("mentor_profiles").select("user_id,expertise,is_available,max_active_assignments").order("created_at",{ascending:false}),
    supabase.from("mentor_assignments").select("id,mentor_user_id,youth_user_id,program_id,started_at").is("ended_at",null).order("started_at",{ascending:false}),
    supabase.from("profiles").select("id,display_name,full_name").order("created_at",{ascending:false}).limit(500),
    supabase.from("programs").select("id,title").order("title"),
  ]);
  const mentors=mentorData??[], assignments=assignmentData??[], profiles=profileData??[], programs=programData??[];
  const names=new Map(profiles.map(p=>[p.id,p.display_name??p.full_name??"کاربر"]));
  const mentorIds=new Set(mentors.map(m=>m.user_id));

  return <section>
    <div className="admin-head"><div><span className="eyebrow">شبکه مربیان</span><h1>مدیریت مربیان</h1><p className="lead">اختصاص مربی به جوان با دسترسی محدودشده در RLS.</p></div></div>
    <div className="admin-card-grid">{mentors.map(m=><article className="admin-card" key={m.user_id}><h2>{names.get(m.user_id)??m.user_id.slice(0,8)}</h2><p className="muted">{m.is_available?"در دسترس":"غیرفعال"} · سقف {m.max_active_assignments}</p><div className="tag-row">{(m.expertise??[]).slice(0,4).map(x=><span className="tag" key={x}>{x}</span>)}</div><p>assignment فعال: {assignments.filter(a=>a.mentor_user_id===m.user_id).length}</p></article>)}</div>
    <div className="admin-card"><h2>ایجاد assignment</h2><form className="admin-form" action={assignMentor}><fieldset><legend>انتساب</legend><div className="form-grid">
      <div className="field"><label htmlFor="mentor_user_id">مربی *</label><select id="mentor_user_id" name="mentor_user_id" required><option value="">انتخاب مربی</option>{mentors.map(m=><option value={m.user_id} key={m.user_id}>{names.get(m.user_id)??m.user_id.slice(0,8)}</option>)}</select></div>
      <div className="field"><label htmlFor="youth_user_id">جوان *</label><select id="youth_user_id" name="youth_user_id" required><option value="">انتخاب جوان</option>{profiles.filter(p=>!mentorIds.has(p.id)).map(p=><option value={p.id} key={p.id}>{names.get(p.id)??p.id.slice(0,8)}</option>)}</select></div>
      <div className="field"><label htmlFor="program_id">برنامه</label><select id="program_id" name="program_id" defaultValue=""><option value="">بدون برنامه</option>{programs.map(p=><option value={p.id} key={p.id}>{p.title}</option>)}</select></div>
    </div></fieldset><button className="btn btn-primary" type="submit" disabled={!mentors.length||!profiles.length}>ثبت assignment</button></form></div>
    {!mentors.length&&<div className="empty">پروفایل مربی ثبت نشده است.</div>}
  </section>;
}

import Link from "next/link";
import { requireStaff } from "@/lib/auth";
export const dynamic="force-dynamic";
const labels:Record<string,string>={draft:"پیش‌نویس",published:"منتشرشده",registration_closed:"ثبت‌نام بسته",running:"در حال اجرا",completed:"تکمیل‌شده",archived:"بایگانی"};
export default async function AdminProgramsPage(){
 const {supabase}=await requireStaff();
 const {data:programData}=await supabase.from("programs").select("id,title,status,capacity,start_at,city,program_type").order("created_at",{ascending:false});
 const programs=programData??[]; const ids=programs.map(p=>p.id);
 const {data:regData}=ids.length?await supabase.from("registrations").select("program_id,status").in("program_id",ids):{data:[] as {program_id:string;status:string}[]};
 const regs=regData??[]; const counts=new Map<string,{confirmed:number;waitlisted:number}>();
 for(const r of regs){const c=counts.get(r.program_id)??{confirmed:0,waitlisted:0};if(r.status==="confirmed")c.confirmed++;if(r.status==="waitlisted")c.waitlisted++;counts.set(r.program_id,c);}
 return <section><div className="admin-head"><div><span className="eyebrow">مدیریت</span><h1>برنامه‌ها</h1><p className="lead">وضعیت، ظرفیت و مشارکت هر برنامه.</p></div><Link className="btn btn-primary" href="/admin/programs/new">برنامه جدید</Link></div><div className="table-wrap"><table><caption className="visually-hidden">فهرست برنامه‌ها</caption><thead><tr><th scope="col">برنامه</th><th scope="col">وضعیت</th><th scope="col">ظرفیت</th><th scope="col">ثبت‌نام</th><th scope="col">شروع</th></tr></thead><tbody>{programs.map(p=>{const c=counts.get(p.id)??{confirmed:0,waitlisted:0};return <tr key={p.id}><th scope="row"><strong>{p.title}</strong><div className="muted">{p.city??"بدون شهر"} · {p.program_type}</div></th><td><span className="status">{labels[p.status]??p.status}</span></td><td>{p.capacity??"∞"}</td><td>{c.confirmed} تأیید · {c.waitlisted} صف</td><td><div>{p.start_at?new Date(p.start_at).toLocaleDateString("fa-IR"):"-"}</div><Link className="btn btn-secondary btn-small" href={"/admin/programs/"+p.id}>ویرایش</Link></td></tr>})}</tbody></table></div>{!programs.length&&<div className="empty">هنوز برنامه‌ای ثبت نشده است.</div>}</section>
}
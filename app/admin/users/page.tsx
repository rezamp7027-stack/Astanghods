import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { setUserRole } from "@/app/admin/actions";
export const dynamic="force-dynamic";
export default async function AdminUsersPage(){
 const {supabase}=await requireStaff();
 const [{data:profileData},{data:roleData},{data:userRoleData}]=await Promise.all([
  supabase.from("profiles").select("id,display_name,full_name,phone,is_active,created_at").order("created_at",{ascending:false}).limit(500),
  supabase.from("roles").select("slug,name,description").order("name"),
  supabase.from("user_roles").select("user_id,roles(slug,name)")
 ]);
 const profiles=profileData??[],roles=roleData??[],userRoles=userRoleData??[];
 const map=new Map<string,string[]>();
 for(const item of userRoles){const role=Array.isArray(item.roles)?item.roles[0]:item.roles;if(role?.name){map.set(item.user_id,[...(map.get(item.user_id)??[]),role.name]);}}
 return <section><div className="admin-head"><div><span className="eyebrow">امنیت</span><h1>کاربران و نقش‌ها</h1><p className="lead">اختصاص نقش فقط توسط super_admin انجام می‌شود.</p></div></div><div className="notice">برای bootstrap اولین مدیر، بعد از ساخت اولین حساب کاربری، نقش super_admin را یک‌بار از SQL migration/دسترسی مستقیم تنظیم کنید؛ پس از آن این صفحه مدیریت نقش را به عهده می‌گیرد.</div><div className="table-wrap"><table><caption className="visually-hidden">کاربران و نقش‌های سامانه</caption><thead><tr><th scope="col">کاربر</th><th scope="col">تماس</th><th scope="col">وضعیت</th><th scope="col">نقش‌ها</th><th scope="col">تغییر نقش</th></tr></thead><tbody>{profiles.map(p=><tr key={p.id}><th scope="row"><strong>{p.display_name??p.full_name??"کاربر"}</strong><div className="muted">{p.id.slice(0,12)}…</div></th><td>{p.phone??"-"}</td><td>{p.is_active?"فعال":"غیرفعال"}</td><td>{(map.get(p.id)??[]).join("، ")||"بدون نقش"}</td><td><form className="inline-form" action={setUserRole}><input type="hidden" name="user_id" value={p.id}/><select name="role" aria-label={"نقش برای "+(p.display_name??p.full_name??"کاربر")}>{roles.map(r=><option value={r.slug} key={r.slug}>{r.name}</option>)}</select><select name="enabled" defaultValue="true" aria-label="فعال یا غیرفعال"><option value="true">فعال</option><option value="false">حذف</option></select><button className="btn btn-secondary btn-small" type="submit">اعمال</button></form></td></tr>)}</tbody></table></div></section>
}
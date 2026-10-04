import Link from "next/link";
import {getCurrentUser} from "@/lib/supabase/server";
import {getCurrentProfile} from "@/lib/data/profile";
import {RoleDashboard} from "@/components/role-dashboard";
export const dynamic="force-dynamic";
export default async function DashboardPage(){
 const[user,profile]=await Promise.all([getCurrentUser(),getCurrentProfile()]);
 return <main id="content" className="dashboard-shell"><div className="container"><div className="dashboard-head"><div><span className="eyebrow">پنل یکپارچه</span><h1>{user?"پروفایل و مسیر تو":"نمونه داشبورد مسیر من"}</h1><p>{profile?.full_name||user?.email||"داده واقعی پس از اتصال Supabase نمایش داده می‌شود."}</p></div><Link href="/programs" className="button button-secondary">کشف برنامه</Link></div>{!user&&<div className="setup-banner"><strong>اتصال داده در انتظار است.</strong><span>برای مشاهده اطلاعات واقعی، متغیرهای Supabase را در محیط اجرا تنظیم کن.</span></div>}<RoleDashboard role={profile?.role||"youth"}/></div></main>;
}
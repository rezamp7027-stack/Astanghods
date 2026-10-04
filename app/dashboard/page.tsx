import Link from "next/link";
import {getCurrentUser} from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export default async function DashboardPage(){
 const user=await getCurrentUser();
 return <main id="content" className="dashboard-shell"><div className="container"><div className="dashboard-head"><div><span className="eyebrow">مسیر من</span><h1>{user?"سلام، مسیرت ادامه دارد.":"نمونه داشبورد مسیر من"}</h1><p>{user?.email??"برای داده واقعی، متغیرهای Supabase را در محیط اجرا تنظیم کن."}</p></div><Link href="/programs" className="button button-secondary">کشف برنامه</Link></div>
 {!user&&<div className="setup-banner"><strong>اتصال داده در انتظار است.</strong><span>ساختار تجربه کاربری آماده است، اما ابزار فعلی به پروژه Supabase موجود دسترسی قابل مشاهده ندارد؛ داده ساختگی را جای داده واقعی جا نمی‌زنیم.</span></div>}
 <div className="dashboard-grid"><section className="dashboard-card progress-card"><div className="card-kicker">ادامه مسیر</div><div className="progress-row"><div><strong>بی‌نهایت</strong><span>۳ جلسه از ۵ جلسه</span></div><b>۶۰٪</b></div><div className="progress-track"><span style={{width:"60%"}}/></div><Link href="/programs/bi-nahayat">ادامه دوره ←</Link></section>
 <section className="dashboard-card"><div className="card-kicker">قدم بعدی پیشنهادی</div><h2>یک گفت‌وگوی فکری، این هفته</h2><p>محتوای مرتبط با آخرین دوره‌ای که گذراندی، در صف پیشنهادی تو قرار گرفته است.</p><span className="text-button">مشاهده پیشنهادها ←</span></section>
 <section className="dashboard-card"><div className="card-kicker">دستاوردها</div><div className="achievement-grid"><span>✦<small>شروع مسیر</small></span><span>◎<small>اولین دوره</small></span><span>↗<small>در حال رشد</small></span></div></section>
 <section className="dashboard-card"><div className="card-kicker">برنامه شهر من</div><h2>۳ فرصت نزدیک تو</h2><div className="city-item"><span>مشهد</span><b>نشست اندیشه</b><small>جمعه · ۱۷:۰۰</small></div><div className="city-item"><span>مشهد</span><b>کارگاه کتاب‌خوانی</b><small>شنبه · ۱۰:۰۰</small></div><div className="city-item"><span>آنلاین</span><b>لایو پرسش و پاسخ</b><small>دوشنبه · ۲۰:۳۰</small></div></section></div></div></main>;
}
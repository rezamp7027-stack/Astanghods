import {InfoCard} from "@/components/info-card";
export const metadata={title:"رویدادها | جوانان آستان قدس رضوی"};
const events=[
["جمعه","نشست اندیشه نوجوان","گفت‌وگوی حضوری با محور پرسش‌های فکری","مشهد"],
["شنبه","باشگاه کتاب‌خوانی","خواندن و گفت‌وگو درباره یک کتاب منتخب","آنلاین"],
["یکشنبه","کارگاه مهارت زندگی","تمرین تصمیم‌گیری، ارتباط و خودشناسی","مشهد"],
["دوشنبه","لایو پرسش و پاسخ","پرسش‌های شما، پاسخ کارشناسی و قابل پیگیری","آنلاین"],
["پنجشنبه","اردوی تربیتی","یک تجربه چندبخشی برای یادگیری و ارتباط","مشهد"],
["ماه جاری","فراخوان خدمت","فرصت‌های داوطلبی و فعالیت اجتماعی","استان‌ها"]
];
export default function EventsPage(){return <main id="content" className="page-shell"><div className="container"><div className="page-intro"><span className="eyebrow">تقویم</span><h1>اتفاق‌های نزدیکت را پیدا کن.</h1><p>تقویم واحد، به‌جای چند سامانه جدا، همه فرصت‌های حضوری و آنلاین را در یک جا نشان می‌دهد.</p></div><div className="info-grid">{events.map(([when,title,text,place])=><InfoCard key={title} kicker={when+" · "+place} title={title} text={text} href="/programs" linkLabel="جزئیات"/>)}</div></div></main>}
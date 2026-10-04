import Link from "next/link";
import type {AppRole} from "@/lib/data/profile";
const configs:{
 [key in Exclude<AppRole,"admin">]:{label:string;title:string;text:string;cards:Array<[string,string,string,string]>}
}={
 youth:{label:"مسیر من",title:"مسیرت ادامه دارد.",text:"از آخرین فعالیتت به قدم بعدی برو.",cards:[["ادامه","بی‌نهایت","۳ جلسه از ۵ جلسه","/programs/bi-nahayat"],["پیشنهاد","برنامه بعدی","یک گفت‌وگوی فکری این هفته","/programs"],["شهر من","مشهد","۳ فرصت نزدیک","/events"],["دستاورد","سطح ۴","جست‌وجوگر","/content"]]},
 parent:{label:"پنل والد",title:"همه‌چیز درباره مسیر فرزندت، یکجا.",text:"برنامه، رضایت‌نامه، حضور و اطلاعیه‌ها را ببین.",cards:[["فرزند","مسیر جاری","۱ برنامه فعال","/events"],["رضایت‌نامه","در انتظار","۱ مورد نیازمند تأیید","/events"],["برنامه","این هفته","۲ برنامه ثبت‌شده","/events"],["ارتباط","مربی","اطلاعیه جدید","/content"]]},
 mentor:{label:"پنل مربی",title:"گروهت آماده پیگیری است.",text:"حضور، ارزیابی و محتوای گروه را مدیریت کن.",cards:[["گروه","نوجوانان","۲۴ عضو فعال","/events"],["حضور","این هفته","۸۸٪ حضور","/events"],["ارزیابی","در صف","۷ ارزیابی","/content"],["محتوا","جلسه بعد","۳ فایل آماده","/content"]]},
 organization:{label:"پنل تشکل",title:"شبکه‌ات را از یک پنل مدیریت کن.",text:"اعضا، فعالیت‌ها و درخواست‌های همکاری را یکجا ببین.",cards:[["اعضا","شبکه","۱۴۰ عضو","/network"],["فعالیت","این ماه","۱۲ فعالیت ثبت‌شده","/events"],["همکاری","درخواست‌ها","۳ درخواست جدید","/network"],["ظرفیت","مربی","۸ مربی فعال","/network"]]}
};
export function RoleDashboard({role}:{role:AppRole}){const config=role==="admin"?configs.organization:configs[role];return <div><div className="role-dashboard-head"><span className="eyebrow">{config.label}</span><h2>{config.title}</h2><p>{config.text}</p></div><div className="role-dashboard-grid">{config.cards.map(([k,t,x,href])=><Link className="dashboard-card role-stat" href={href} key={t}><div className="card-kicker">{k}</div><h3>{t}</h3><strong>{x}</strong><span>مشاهده ←</span></Link>)}</div></div>}
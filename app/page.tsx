import Link from "next/link";
import {ProgramFinder} from "@/components/program-finder";
import {ProgramCard} from "@/components/program-card";
import {SectionHeading} from "@/components/section-heading";
import {getPrograms} from "@/lib/data/programs";

const roles=[
 ["نوجوان و جوان","برنامه مناسب سن و علاقه‌ات را پیدا کن و مسیرت را ادامه بده.","/programs"],
 ["والد","برنامه‌ها، رضایت‌نامه‌ها و وضعیت حضور فرزندت را یکجا ببین.","/login"],
 ["مربی","کلاس‌ها، ارزیابی‌ها و ارتباط با گروهت را مدیریت کن.","/login"],
 ["تشکل و مدرسه","گروه بساز، ثبت‌نام دسته‌جمعی و فعالیت‌ها را مدیریت کن.","/login"]
];
const pathway=[
 ["۰۱","آشنایی","از یک برنامه یا محتوای درست شروع می‌کنی."],
 ["۰۲","یادگیری","دوره، اردو یا نشست بعدی را بر اساس مسیرت پیدا می‌کنی."],
 ["۰۳","استمرار","بعد از هر برنامه، قدم بعدی برایت روشن می‌ماند."],
 ["۰۴","شبکه","به مربی‌ها، گروه‌ها و فرصت‌های فعالیت اجتماعی وصل می‌شوی."]
];

export default async function HomePage(){
 const programs=await getPrograms();
 return <main>
  <section className="hero"><div className="container hero-grid"><div className="hero-copy">
   <span className="eyebrow">پلتفرم جامع جوانان آستان قدس رضوی</span>
   <h1>یک برنامه را تمام نکن. <span>یک مسیر بساز.</span></h1>
   <p>برنامه‌ها، آموزش، محتوا، رویدادها و شبکه جوانان در یک تجربه واحد. از اولین برخورد تا قدم بعدی، مسیرت گم نمی‌شود.</p>
   <div className="hero-actions"><Link className="button button-primary" href="/programs">برنامه مناسب من</Link><Link className="button button-secondary" href="#path">مسیر من چطور کار می‌کند؟</Link></div>
   <div className="hero-stats"><div><strong>۱</strong><span>حساب کاربری</span></div><div><strong>۳۶۰°</strong><span>مسیر ارتباط</span></div><div><strong>استانی</strong><span>ادامه مسیر</span></div></div>
  </div><div className="hero-panel"><div className="panel-glow"/><div className="mini-label">مسیر پیشنهادی</div>
   <div className="route-card featured-route"><span className="route-icon">✦</span><div><strong>بی‌نهایت</strong><small>شروع مسیر معرفتی نوجوان</small></div><b>۶۰٪</b></div>
   <div className="route-line"/><div className="route-card"><span className="route-icon muted">↗</span><div><strong>سدید</strong><small>گام بعدی پیشنهادی</small></div><span className="tag tag-warm">پیشنهاد</span></div>
   <div className="route-line"/><div className="route-card"><span className="route-icon muted">◎</span><div><strong>برنامه شهر من</strong><small>فعالیت‌های نزدیک تو</small></div><span className="tag tag-soft">۳ مورد</span></div>
   <div className="panel-foot"><span className="pulse"/> مسیرت زنده می‌ماند، حتی بعد از پایان یک دوره.</div>
  </div></div></section>

  <section className="section section-tight"><div className="container"><SectionHeading kicker="از کجا شروع کنم؟" title="بر اساس نقشت وارد شو" text="تجربه‌ای که برای نوجوان طراحی شده، قرار نیست برای مدیر تشکل هم همان باشد. هرکس ورودی خودش را دارد."/>
   <div className="role-grid">{roles.map(([title,text,href])=><Link href={href} className="role-card" key={title}><span className="role-arrow">←</span><h3>{title}</h3><p>{text}</p></Link>)}</div>
  </div></section>

  <section className="section finder-section"><div className="container"><SectionHeading kicker="کشف برنامه" title="برنامه مناسب تو، نه یک فهرست بی‌پایان" text="سن، علاقه، شهر و شکل حضور را انتخاب کن؛ پلتفرم به‌جای کاربر تصمیم نمی‌گیرد، فقط راه را کوتاه می‌کند."/><ProgramFinder programs={programs}/></div></section>

  <section className="section"><div className="container"><SectionHeading kicker="در حال ثبت‌نام" title="چند فرصت که می‌توانی ببینی" action={{href:"/programs",label:"همه برنامه‌ها"}}/><div className="program-grid">{programs.slice(0,3).map(p=><ProgramCard key={p.slug} program={p}/>)}</div></div></section>

  <section className="section path-section" id="path"><div className="container"><SectionHeading kicker="هسته محصول" title="از رویدادمحوری به مسیرمحوری" text="هر تعامل باید یک قدم بعدی داشته باشد. این همان چیزی است که CRM تربیتی را از یک فرم ثبت‌نام معمولی جدا می‌کند."/><div className="path-grid">{pathway.map(([num,title,text])=><div className="path-step" key={num}><span>{num}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

  <section className="section dark-section"><div className="container split-cta"><div><span className="eyebrow eyebrow-light">یک هویت، یک شبکه</span><h2>پشت صحنه، همه‌چیز یکجا مدیریت می‌شود.</h2><p>هویت کاربر، دوره‌ها، رویدادها، تشکل‌ها، استان‌ها، محتوا، اعلان‌ها و گزارش‌ها روی یک زیرساخت واحد قرار می‌گیرند.</p></div><div className="architecture-card"><div>کاربر</div><i>↓</i><div>پروفایل و مسیر</div><i>↓</i><div>برنامه‌ها + محتوا + شبکه</div><i>↓</i><div className="accent-box">CRM و داشبورد مدیریتی</div></div></div></section>
 </main>;
}
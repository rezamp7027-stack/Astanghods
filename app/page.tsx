import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const pillars = [
  ["برنامه‌ها و مسیر رشد", "برنامه مناسب خودت را پیدا کن و مسیرت را قدم‌به‌قدم ادامه بده."],
  ["یادگیری واقعی", "دوره، محتوای آموزشی و تجربه میدانی در یک فضای واحد."],
  ["شبکه جوانان رضوی", "با جوانان، مربیان و مجموعه‌های هم‌مسیر در ارتباط باش."],
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">سامانه جامع جوانان آستان قدس رضوی</span>
              <h1>از یک برنامه خوب، یک مسیر ماندگار بساز.</h1>
              <p className="lead">جایی برای پیدا کردن برنامه‌ها، یادگیری، ارتباط با مربی، حضور در شبکه جوانان و ادامه مسیر بعد از پایان هر دوره.</p>
              <div className="hero-actions">
                <Link href="/programs" className="btn btn-primary">مشاهده برنامه‌ها</Link>
                <Link href="/login" className="btn btn-secondary">ورود به مسیر من</Link>
              </div>
            </div>
            <aside className="hero-card" aria-label="نمای کلی سامانه">
              <div>
                <span className="eyebrow">مسیر من</span>
                <h2>یک حساب، یک مسیر</h2>
                <p className="lead" style={{fontSize:15}}>ثبت‌نام‌ها، دوره‌ها و فعالیت‌های مهمت را یک‌جا ببین.</p>
              </div>
              <div>
                <div className="hero-stat"><span>برنامه‌های در دسترس</span><strong>+ برنامه</strong></div>
                <div className="hero-stat"><span>ثبت‌نام هوشمند</span><strong>ظرفیت + صف</strong></div>
                <div className="hero-stat"><span>ادامه ارتباط</span><strong>۹۰ روز</strong></div>
              </div>
            </aside>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-head"><div><h2>یک سایت خبری دیگر نیست</h2><p>هسته محصول برای ارتباط و رشد طراحی شده، نه فقط انتشار خبر.</p></div></div>
            <div className="cards">
              {pillars.map(([title, text]) => <article className="card" key={title}><h3>{title}</h3><p>{text}</p><span className="tag">در هسته پلتفرم</span></article>)}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

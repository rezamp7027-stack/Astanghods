import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

const pillars = [
  ["برنامه‌ها و مسیر رشد", "برنامه مناسب خودت را پیدا کن و مسیرت را قدم‌به‌قدم ادامه بده."],
  ["یادگیری واقعی", "دوره، محتوای آموزشی و تجربه میدانی در یک فضای واحد."],
  ["شبکه جوانان رضوی", "با جوانان، مربیان و مجموعه‌های هم‌مسیر در ارتباط باش."],
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const [programs, courses, events, archive] = await Promise.all([
    supabase.from("programs").select("*", { count: "exact", head: true }).eq("status", "published").eq("is_historical", false),
    supabase.from("courses").select("*", { count: "exact", head: true }).eq("is_published", true).eq("is_historical", false),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("is_public", true).gte("starts_at", new Date().toISOString()),
    supabase.from("content").select("*", { count: "exact", head: true }).eq("status", "published").eq("is_historical", true),
  ]);

  const stats = [
    ["برنامه جاری", programs.count ?? 0],
    ["دوره فعال", courses.count ?? 0],
    ["رویداد پیش‌رو", events.count ?? 0],
    ["رکورد آرشیوی", archive.count ?? 0],
  ];

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
            <aside className="hero-card" aria-label="نمای واقعی سامانه">
              <div>
                <span className="eyebrow">وضعیت سامانه</span>
                <h2>یک حساب، یک مسیر</h2>
                <p className="lead" style={{ fontSize: 15 }}>اعداد زیر از داده‌های واقعی سامانه خوانده می‌شوند، نه از اسلایدی که کسی سال‌ها پیش ساخته باشد.</p>
              </div>
              <div>
                {stats.map(([label, value]) => (
                  <div className="hero-stat" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>یک سایت خبری دیگر نیست</h2>
                <p>هسته محصول برای ارتباط و رشد طراحی شده، نه فقط انتشار خبر.</p>
              </div>
            </div>
            <div className="cards">
              {pillars.map(([title, text]) => (
                <article className="card" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="tag">در هسته پلتفرم</span>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="callout">
              <strong>آرشیو پژوهشی مؤسسه</strong>
              <p>رکوردهای تاریخی مؤسسه جدا از برنامه‌های جاری نگهداری شده‌اند تا سابقه فعالیت‌ها با آمار و برنامه‌های امروز قاطی نشود.</p>
              <div className="button-row">
                <Link href="/content" className="btn btn-secondary">مشاهده آرشیو</Link>
                <Link href="/search" className="btn btn-secondary">جست‌وجوی سامانه</Link>
                <Link href="/research" className="btn btn-secondary">منابع پژوهش</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

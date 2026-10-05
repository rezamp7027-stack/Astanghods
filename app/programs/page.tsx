import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

type Program = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  program_type: string;
  city: string | null;
  capacity: number | null;
  start_at: string | null;
  is_historical: boolean;
};

export const dynamic = "force-dynamic";

function ProgramCard({ program, historical = false }: { program: Program; historical?: boolean }) {
  return (
    <article className="program-card">
      <div>
        <div className="program-card-top">
          <span className="status">{historical ? "آرشیوی" : "منتشرشده"}</span>
          <span className="tag">{program.program_type}</span>
        </div>
        <h2>{program.title}</h2>
        <p>{program.summary ?? "برای این برنامه توضیح کوتاهی ثبت نشده است."}</p>
        <div className="meta">
          {program.city && <span>{program.city}</span>}
          {program.capacity && <span>ظرفیت {program.capacity} نفر</span>}
          {program.start_at && <span>{new Date(program.start_at).toLocaleDateString("fa-IR")}</span>}
        </div>
      </div>
      <div className="bottom">
        <span className="tag">{historical ? "سابقه مؤسسه" : "ثبت‌نام آنلاین"}</span>
        <Link className="btn btn-secondary" href={`/programs/${program.slug}`}>مشاهده</Link>
      </div>
    </article>
  );
}

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: programs, error } = await supabase
    .from("programs")
    .select("id,title,slug,summary,program_type,city,capacity,start_at,is_historical")
    .in("status", ["published", "running", "registration_closed", "completed"])
    .order("is_historical", { ascending: true })
    .order("start_at", { ascending: false });

  const rows = (programs ?? []) as Program[];
  const current = rows.filter((program) => !program.is_historical && program.slug);
  const historical = rows.filter((program) => program.is_historical || !current.some((item) => item.id === program.id));

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">کشف و مشارکت</span>
            <h1>برنامه‌ها</h1>
            <p>برنامه‌ای پیدا کن که به سن، علاقه و مسیر رشدت نزدیک‌تر باشد.</p>
          </div>
          {error ? <div className="notice error" role="alert">خطا در دریافت برنامه‌ها.</div> : null}

          <section>
            <div className="section-head"><div><h2>برنامه‌های جاری</h2><p>فقط برنامه‌هایی که برای استفاده فعلی منتشر شده‌اند.</p></div></div>
            {current.length ? (
              <div className="program-grid">{current.map((program) => <ProgramCard key={program.id} program={program} />)}</div>
            ) : (
              <div className="empty">در حال حاضر برنامه جاری منتشرشده‌ای ثبت نشده است.</div>
            )}
          </section>

          <section className="section">
            <div className="section-head"><div><h2>آرشیو برنامه‌ها</h2><p>سوابق تاریخی مؤسسه، با برچسب آرشیوی و جدا از ظرفیت ثبت‌نام.</p></div></div>
            {historical.length ? (
              <div className="program-grid">{historical.map((program) => <ProgramCard key={program.id} program={program} historical />)}</div>
            ) : (
              <div className="empty">هنوز سابقه برنامه‌ای در آرشیو ثبت نشده است.</div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

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
};

export const dynamic = "force-dynamic";

export default async function ProgramsPage() {
  const supabase = await createClient();
  const { data: programs, error } = await supabase
    .from("programs")
    .select("id,title,slug,summary,program_type,city,capacity,start_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <h1>برنامه‌ها</h1>
            <p>برنامه‌ای پیدا کن که به سن، علاقه و مسیر رشدت نزدیک‌تر باشد.</p>
          </div>
          {error ? <div className="notice error">خطا در دریافت برنامه‌ها.</div> : null}
          {!programs?.length ? (
            <div className="empty">هنوز برنامه منتشرشده‌ای در سامانه قرار نگرفته است.</div>
          ) : (
            <div className="program-grid">
              {(programs as Program[]).map((program) => (
                <article className="program-card" key={program.id}>
                  <div>
                    <div className="program-card-top"><span className="status">منتشرشده</span><span className="tag">{program.program_type}</span></div>
                    <h2>{program.title}</h2>
                    <p>{program.summary ?? "برای این برنامه توضیح کوتاهی ثبت نشده است."}</p>
                    <div className="meta">
                      {program.city && <span>{program.city}</span>}
                      {program.capacity && <span>ظرفیت {program.capacity} نفر</span>}
                      {program.start_at && <span>{new Date(program.start_at).toLocaleDateString("fa-IR")}</span>}
                    </div>
                  </div>
                  <div className="bottom"><span className="tag">ثبت‌نام آنلاین</span><Link className="btn btn-secondary" href={`/programs/${program.slug}`}>مشاهده</Link></div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

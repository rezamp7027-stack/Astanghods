import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { RegistrationButton } from "@/components/registration-button";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type Program = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  program_type: string;
  audience_min_age: number | null;
  audience_max_age: number | null;
  capacity: number | null;
  registration_open_at: string | null;
  registration_close_at: string | null;
  start_at: string | null;
  end_at: string | null;
  location_name: string | null;
  city: string | null;
  is_historical: boolean;
  source_url: string | null;
  source_confidence: string | null;
};

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .in("status", ["published", "running", "registration_closed", "completed"])
    .maybeSingle();

  const program = data as Program | null;
  if (!program) notFound();

  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub ? String(claims.claims.sub) : null;
  const { data: myRegistration } = !program.is_historical && userId
    ? await supabase.from("registrations").select("status").eq("program_id", program.id).eq("user_id", userId).maybeSingle()
    : { data: null };

  const ageText = program.audience_min_age === null && program.audience_max_age === null
    ? "همه سنین اعلام‌شده"
    : `${program.audience_min_age ?? "همه"}${program.audience_max_age !== null ? ` تا ${program.audience_max_age}` : ""} سال`;

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container detail-grid">
          <article className="detail-card">
            <span className="status">{program.is_historical ? "رکورد آرشیوی" : "برنامه منتشرشده"}</span>
            <h1>{program.title}</h1>
            <p className="lead">{program.summary}</p>
            <div className="callout"><strong>گروه سنی</strong><br />{ageText}</div>
            <h2>درباره برنامه</h2>
            <p>{program.description ?? "توضیحات کامل این برنامه هنوز ثبت نشده است."}</p>
            <div className="tag-row">
              <span className="tag">{program.program_type}</span>
              {program.city && <span className="tag">{program.city}</span>}
              {program.location_name && <span className="tag">{program.location_name}</span>}
            </div>
            {program.is_historical && (
              <div className="notice" style={{ marginTop: 18 }}>
                این رکورد بخشی از آرشیو پژوهشی مؤسسه است و به‌عنوان برنامه جاری یا قابل ثبت‌نام نمایش داده نمی‌شود.
              </div>
            )}
            {program.source_url && (
              <a className="btn btn-secondary" href={program.source_url} target="_blank" rel="noreferrer" style={{ marginTop: 18 }}>
                مشاهده منبع
              </a>
            )}
          </article>

          <aside className="detail-card sticky">
            {program.is_historical ? (
              <>
                <h2>آرشیو</h2>
                <p>اطلاعات این برنامه برای مستندسازی سوابق مؤسسه نگهداری شده است.</p>
                {program.source_confidence && <div className="notice">اعتماد منبع: <strong>{program.source_confidence}</strong></div>}
                <Link href="/programs" className="btn btn-secondary">بازگشت به برنامه‌ها</Link>
              </>
            ) : (
              <>
                <h2>ثبت‌نام</h2>
                <p>ثبت‌نام با کنترل ظرفیت انجام می‌شود. در صورت تکمیل ظرفیت، سامانه شما را در صف انتظار قرار می‌دهد.</p>
                <RegistrationButton programId={program.id} initialStatus={myRegistration?.status ?? null} />
                {program.registration_close_at && (
                  <div className="notice">مهلت ثبت‌نام: {new Date(program.registration_close_at).toLocaleDateString("fa-IR")}</div>
                )}
              </>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

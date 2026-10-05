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
};

export default async function ProgramDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  const program = data as Program | null;
  if (!program) notFound();

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container detail-grid">
          <article className="detail-card">
            <span className="status">برنامه منتشرشده</span>
            <h1>{program.title}</h1>
            <p className="lead">{program.summary}</p>
            <div className="callout">
              <strong>گروه سنی</strong><br />
              {program.audience_min_age ?? "همه"}{program.audience_max_age ? ` تا ${program.audience_max_age}` : ""} سال
            </div>
            <h2>درباره برنامه</h2>
            <p>{program.description ?? "توضیحات کامل این برنامه هنوز ثبت نشده است."}</p>
            <div className="tag-row">
              <span className="tag">{program.program_type}</span>
              {program.city && <span className="tag">{program.city}</span>}
              {program.location_name && <span className="tag">{program.location_name}</span>}
            </div>
          </article>
          <aside className="detail-card sticky">
            <h2>ثبت‌نام</h2>
            <p>ثبت‌نام با کنترل ظرفیت انجام می‌شود. در صورت تکمیل ظرفیت، سامانه شما را در صف انتظار قرار می‌دهد.</p>
            <RegistrationButton programId={program.id} />
            {program.registration_close_at && (
              <div className="notice">مهلت ثبت‌نام: {new Date(program.registration_close_at).toLocaleDateString("fa-IR")}</div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

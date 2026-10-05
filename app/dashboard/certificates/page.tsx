import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login?next=/dashboard/certificates");

  const userId = String(claims.claims.sub);
  const { data: certData, error } = await supabase
    .from("certificates")
    .select("id,title,certificate_number,verification_code,issued_at,revoked_at")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  const certs = certData ?? [];
  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">مسیر من</span>
            <h1>گواهی‌های من</h1>
            <p>گواهی‌های دیجیتال صادرشده برای تو.</p>
          </div>
          {error && <div className="notice error" role="alert">خطا در دریافت گواهی‌ها.</div>}
          <div className="admin-card-grid">
            {certs.map((certificate) => (
              <article className="admin-card" key={certificate.id}>
                <span className="status">{certificate.revoked_at ? "باطل‌شده" : "معتبر"}</span>
                <h2>{certificate.title}</h2>
                <p>{certificate.certificate_number}</p>
                <div className="tag-row">
                  <span className="tag">صدور {new Date(certificate.issued_at).toLocaleDateString("fa-IR")}</span>
                  <span className="tag">کد {certificate.verification_code.slice(0, 10)}…</span>
                </div>
                <Link className="btn btn-secondary" href={`/certificate/verify?code=${encodeURIComponent(certificate.verification_code)}`}>
                  استعلام عمومی
                </Link>
              </article>
            ))}
          </div>
          {!certs.length && <div className="empty">هنوز گواهی‌ای برای شما صادر نشده است.</div>}
          <Link className="btn btn-secondary" href="/dashboard">بازگشت</Link>
        </div>
      </main>
    </>
  );
}

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type VerificationResult = {
  certificate_number: string;
  title: string;
  issued_at: string;
  valid: boolean;
};

export default async function VerifyCertificatePage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const params = await searchParams;
  const code = (params.code ?? "").trim().slice(0, 64);
  let result: VerificationResult | null = null;
  let error = "";

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("verify_certificate", { p_code: code });
    const row = Array.isArray(data) ? data[0] : data;
    if (row) result = row as VerificationResult;
    else error = "گواهی‌ای با این کد پیدا نشد.";
  }

  return (
    <>
      <SiteHeader />
      <main className="page">
        <div className="container narrow">
          <div className="page-head">
            <span className="eyebrow">استعلام اصالت</span>
            <h1>تأیید گواهی</h1>
            <p>کد استعلام را وارد کنید تا وضعیت گواهی از مرجع سامانه بررسی شود.</p>
          </div>

          <form className="admin-form" method="GET">
            <div className="field">
              <label htmlFor="code">کد استعلام *</label>
              <input id="code" name="code" required minLength={8} maxLength={64} defaultValue={code} autoComplete="off" dir="ltr" />
            </div>
            <button className="btn btn-primary" type="submit">استعلام</button>
          </form>

          {result && (
            <article className="admin-card" style={{ marginTop: 18 }}>
              <span className="status">{result.valid ? "معتبر" : "باطل‌شده"}</span>
              <h2>{result.title}</h2>
              <p>شماره گواهی: {result.certificate_number}</p>
              <p>تاریخ صدور: {new Date(result.issued_at).toLocaleDateString("fa-IR")}</p>
            </article>
          )}
          {error && <div className="empty" role="alert" style={{ marginTop: 18 }}>{error}</div>}
          <Link className="btn btn-secondary" href="/" style={{ marginTop: 18 }}>بازگشت به خانه</Link>
        </div>
      </main>
      <footer className="footer"><div className="container">سامانه جامع جوانان آستان قدس رضوی</div></footer>
    </>
  );
}

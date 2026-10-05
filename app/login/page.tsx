import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next || "/dashboard";

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <Link href="/" className="brand" aria-label="صفحه اصلی جوانان آستان قدس رضوی">
          <span className="brand-mark" aria-hidden="true">ر</span>
          <span>جوانان رضوی</span>
        </Link>
        <div style={{ height: 18 }} />
        <h1>ورود</h1>
        <p>یک لینک ورود امن به ایمیل شما ارسال می‌شود.</p>
        {params.error && <div className="notice error">ورود کامل نشد. لینک را دوباره از صفحه ورود درخواست کنید.</div>}
        <LoginForm nextPath={next} />
      </div>
    </main>
  );
}

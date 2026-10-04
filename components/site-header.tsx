import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="صفحه اصلی جوانان آستان قدس رضوی">
          <span className="brand-mark" aria-hidden="true">ر</span>
          <span>جوانان رضوی</span>
        </Link>
        <nav className="nav-links" aria-label="ناوبری اصلی">
          <Link href="/programs">برنامه‌ها</Link>
          <Link href="/dashboard">مسیر من</Link>
          <Link href="/programs">آموزش</Link>
          <Link href="/programs">رویدادها</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/login" className="btn btn-secondary">ورود</Link>
          <Link href="/programs" className="btn btn-primary">کشف برنامه‌ها</Link>
        </div>
      </div>
    </header>
  );
}

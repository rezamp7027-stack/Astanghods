import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="صفحه اصلی جوانان آستان قدس رضوی">
          <span className="brand-mark" aria-hidden="true">ر</span><span>جوانان رضوی</span>
        </Link>
        <nav className="nav-links" aria-label="ناوبری اصلی">
          <Link href="/programs">برنامه‌ها</Link><Link href="/courses">آموزش</Link><Link href="/events">رویدادها</Link><Link href="/network">شبکه</Link><Link href="/volunteer">خدمت</Link><Link href="/search">جست‌وجو</Link><Link href="/dashboard">مسیر من</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/certificate/verify" className="btn btn-secondary">استعلام گواهی</Link>
          <Link href="/login" className="btn btn-secondary">ورود</Link>
          <Link href="/programs" className="btn btn-primary">کشف برنامه‌ها</Link>
        </div>
      </div>
    </header>
  );
}
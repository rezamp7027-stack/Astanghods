import Link from "next/link";

const links = [
  ["/programs", "برنامه‌ها"],
  ["/courses", "آموزش"],
  ["/events", "رویدادها"],
  ["/network", "شبکه"],
  ["/provinces", "استان‌ها"],
  ["/volunteer", "خدمت"],
  ["/search", "جست‌وجو"],
  ["/dashboard", "مسیر من"],
  ["/dashboard/assistant", "دستیار"],
];

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  return (
    <nav className={mobile ? "mobile-menu-links" : "nav-links"} aria-label={mobile ? "ناوبری موبایل" : "ناوبری اصلی"}>
      {links.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}
    </nav>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand" aria-label="صفحه اصلی جوانان آستان قدس رضوی">
          <span className="brand-mark" aria-hidden="true">ر</span>
          <span>جوانان رضوی</span>
        </Link>

        <NavLinks />

        <div className="nav-actions">
          <Link href="/certificate/verify" className="btn btn-secondary">استعلام گواهی</Link>
          <Link href="/login" className="btn btn-secondary">ورود</Link>
          <Link href="/programs" className="btn btn-primary">کشف برنامه‌ها</Link>
        </div>

        <details className="mobile-menu">
          <summary className="btn btn-secondary" aria-label="باز کردن منوی سایت">منو</summary>
          <div className="mobile-menu-panel">
            <NavLinks mobile />
            <Link href="/certificate/verify" className="btn btn-secondary">استعلام گواهی</Link>
            <Link href="/login" className="btn btn-primary">ورود</Link>
          </div>
        </details>
      </div>
    </header>
  );
}

import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true">R</span>
          <span>Astanghods Youth</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link href="/programs">Programs</Link>
          <Link href="/dashboard">My Path</Link>
          <Link href="/login">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}

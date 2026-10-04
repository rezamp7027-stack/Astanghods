"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader(){
  const pathname=usePathname();
  const links=[["برنامه‌ها","/programs"],["مسیر من","/dashboard"],["محتوا","/programs"],["شبکه","/programs"]];
  return <header className="site-header"><div className="container nav">
    <Link href="/" className="brand"><span className="brand-mark">✦</span><span>جوانان آستان قدس<small>مسیر رشد · آموزش · شبکه</small></span></Link>
    <nav className="nav-links" aria-label="منوی اصلی">{links.map(([label,href])=><Link key={label} className={pathname.startsWith(href)?"active":""} href={href}>{label}</Link>)}</nav>
    <div className="nav-actions"><Link href="/login" className="nav-login">ورود</Link><Link href="/programs" className="button button-primary">شروع مسیر</Link></div>
  </div></header>;
}
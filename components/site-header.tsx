"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
export function SiteHeader(){
 const pathname=usePathname(),[open,setOpen]=useState(false);
 const links=[["برنامه‌ها","/programs"],["مسیر من","/dashboard"],["محتوا","/content"],["رویدادها","/events"],["شبکه","/network"],["خدمت","/volunteer"]];
 return <header className="site-header"><div className="container nav">
  <Link href="/" className="brand" onClick={()=>setOpen(false)}><span className="brand-mark">✦</span><span>جوانان آستان قدس<small>مسیر رشد · آموزش · شبکه</small></span></Link>
  <nav className="nav-links" aria-label="منوی اصلی">{links.map(([label,href])=><Link key={label} className={pathname.startsWith(href)?"active":""} href={href}>{label}</Link>)}</nav>
  <div className="nav-actions"><Link href="/login" className="nav-login">ورود</Link><Link href="/programs" className="button button-primary">شروع مسیر</Link><button className="menu-button" type="button" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(v=>!v)}>{open?"بستن":"منو"}</button></div>
 </div>{open&&<nav id="mobile-nav" className="mobile-nav" aria-label="منوی موبایل"><div className="container">{links.map(([label,href])=><Link key={label} href={href} onClick={()=>setOpen(false)}>{label}<span>←</span></Link>)}</div></nav>}</header>;
}
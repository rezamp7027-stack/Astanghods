import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title:"جوانان آستان قدس رضوی | مسیر رشد، آموزش و شبکه",
  description:"درگاه جامع ارتباط، آموزش و شبکه‌سازی جوانان آستان قدس رضوی",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="fa" dir="rtl"><body><SiteHeader />{children}</body></html>;
}
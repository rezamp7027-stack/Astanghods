import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "جوانان آستان قدس رضوی",
    template: "%s | جوانان آستان قدس رضوی",
  },
  description:
    "سامانه جامع ارتباط، آموزش، برنامه‌ها و شبکه‌سازی جوانان آستان قدس رضوی",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}

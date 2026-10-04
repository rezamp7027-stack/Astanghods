import Link from "next/link";

export default function NotFound() {
  return (
    <main className="auth-shell">
      <div className="auth-card">
        <span className="eyebrow">۴۰۴</span>
        <h1>این صفحه پیدا نشد</h1>
        <p>آدرس اشتباه است یا این بخش هنوز منتشر نشده. اینترنت هم طبق معمول تصمیم گرفته کمی ماجرا را شخصی کند.</p>
        <Link className="btn btn-primary" href="/">بازگشت به صفحه اصلی</Link>
      </div>
    </main>
  );
}

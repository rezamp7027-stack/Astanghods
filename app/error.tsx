"use client";

import { useEffect } from "react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep production error reporting integration here once the observability provider is configured.
  }, []);

  return (
    <main className="auth-shell">
      <div className="auth-card" role="alert">
        <span className="eyebrow">خطا</span>
        <h1>مشکلی پیش آمد</h1>
        <p>در اجرای این بخش خطایی رخ داد. می‌توانید بدون از دست دادن نشست کاربری، دوباره تلاش کنید.</p>
        <button className="btn btn-primary" type="button" onClick={() => reset()}>
          تلاش دوباره
        </button>
      </div>
    </main>
  );
}

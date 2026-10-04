# معماری سامانه جامع ارتباط، آموزش و شبکه‌سازی جوانان آستان قدس رضوی

## اصل محصول
یک هویت، یک مسیر، چند نقش.

## لایه‌ها
- Web: Next.js App Router + TypeScript + RTL mobile-first
- Identity: Supabase Auth، با قابلیت OTP و MFA در مرحله بعد
- Data: Supabase/Postgres، با repository/adapter مستقل از UI
- Domain: Youth CRM، Programs، Learning، Events، Organizations، Volunteers، Content
- Async: Temporal برای workflowهای طولانی‌مدت مثل صف انتظار، اعلان زمان‌دار، پسادوره و صدور گواهی
- Staff SSO: در صورت نیاز سازمانی، Auth0 به‌صورت لایه SSO برای کارکنان و سامانه‌های داخلی

## جریان اصلی
ثبت‌نام → ارزیابی شرایط → تأیید/صف انتظار → حضور → تکمیل → پیشنهاد قدم بعدی → استمرار ارتباط.

## اصل امنیت
داده مجاز هر نقش حداقلی است. تصمیم‌های authorization بر اساس metadata قابل ویرایش کاربر انجام نمی‌شود. نقش‌های حساس باید در app metadata و policyهای دیتابیس کنترل شوند.

## وضعیت اتصال Backend
این repository فعلاً schema واقعی پروژه Supabase را از ابزار متصل دریافت نمی‌کند. بنابراین adapter برنامه‌ها ابتدا اتصال را امتحان می‌کند و در نبود دسترسی، fallback توسعه‌ای دارد. تا زمان تطبیق schema واقعی، migration یا overwrite دیتابیس انجام نمی‌شود.

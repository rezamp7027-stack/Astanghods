# Astanghods

سامانه جامع ارتباط، آموزش و شبکه‌سازی جوانان آستان قدس رضوی.

## وضعیت

این branch پایه محصول را از صفر ساخته و در PR شماره 1 نگه‌داری می‌شود.

### ساخته شده
- Next.js App Router + TypeScript + React
- تجربه RTL و mobile-first
- صفحه اصلی مسیرمحور
- کشف، فیلتر و جزئیات برنامه‌ها
- لایه داده جدا از UI برای اتصال Supabase
- ورود، ثبت‌نام، بازیابی و تغییر رمز
- session refresh با Proxy و Supabase SSR
- داشبورد role-aware برای نوجوان، والد، مربی و تشکل
- صفحات محتوا، رویدادها، شبکه، خدمت، استان‌ها، معرفی و حریم خصوصی
- sitemap، robots و manifest
- هدرهای امنیتی پایه
- CI برای typecheck، lint، build و Fallow

## قرارداد معماری

اطلاعات معماری در `docs/architecture.md` و قرارداد backend در `docs/backend-contract.md` قرار دارد.

اصل کلیدی:

یک حساب کاربری، یک هویت، یک مسیر.

## وضعیت Supabase

اتصال فعلی ابزار Supabase سازمان `Astanghods` را می‌بیند، اما هیچ project را در این نشست expose نمی‌کند. بنابراین schema واقعی، RLS، migrations و Edge Functions قابل بررسی نیستند و عمداً هیچ migration یا overwrite روی production انجام نشده است.

وقتی project واقعی در اتصال Supabase قابل مشاهده شود، قدم بعدی:
1. inventory کامل tables/extensions/migrations/functions
2. بررسی RLS و داده‌های حساس
3. تطبیق adapter با schema واقعی
4. پیاده‌سازی ثبت‌نام اتمیک و waitlist
5. ساخت parent consent و attendance
6. اتصال LMS، notifications و CRM
7. افزودن workflowهای پایدار Temporal

## اجرا

Node.js 22+
`npm install`
`.env.local` را از `.env.example` بسازید.
`npm run dev`

تا وقتی Supabase تنظیم نشده باشد، صفحات عمومی برنامه‌ها از داده fallback توسعه‌ای استفاده می‌کنند.

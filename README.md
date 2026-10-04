# Astanghods Youth Platform

سامانه جامع ارتباط، آموزش و شبکه‌سازی جوانان آستان قدس رضوی.

این repository هسته وب‌اپلیکیشن پلتفرم را نگه می‌دارد. معماری از ابتدا برای mobile-first، RTL، امنیت داده، RLS و رشد مرحله‌ای طراحی شده است.

## Stack

- Next.js 16 + React 19 + TypeScript
- Supabase PostgreSQL + Auth + Storage/Realtime
- GitHub Actions برای CI
- Temporal برای workflowهای بلندمدت در مراحل بعد
- Auth0 برای SSO سازمانی در صورت نیاز تاییدشده
- AI/NVIDIA در لایه‌های بعدی، با داده و محتوای کنترل‌شده

## اولین vertical slice

ورود با لینک ایمیل → پروفایل → کشف برنامه‌ها → صفحه جزئیات → ثبت‌نام اتمیک → ظرفیت/صف انتظار → داشبورد «مسیر من»

## مسیرهای فعلی

- / صفحه اصلی
- /programs کشف برنامه‌های منتشرشده
- /programs/[slug] جزئیات برنامه و ثبت‌نام
- /login ورود بدون رمز با OTP/Email Link
- /auth/callback تکمیل نشست
- /dashboard مسیر من
- /dashboard/profile پروفایل

## Supabase

Project: `tvoeeeggjypptlblyuyr`

دو migration پایه در محیط Supabase اعمال شده‌اند و RLS برای جدول‌های public فعال است.

در کلاینت فقط از publishable key استفاده کنید. secret/service_role هرگز نباید در browser یا فایل `.env.example` قرار بگیرد.

## Environment

```bash
cp .env.example .env.local
```

سپس مقدار واقعی `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` را از Project Connect/API Keys تنظیم کنید.

## Local development

```bash
npm install
npm run dev
```

اعتبارسنجی:

```bash
npm run typecheck
npm run lint
npm run build
```

## Security baseline

- RLS روی تمام جدول‌های exposed در schema public
- کنترل دسترسی مبتنی بر role بدون اتکا به user-editable metadata
- ثبت consent و audit log برای گسترش‌های بعدی
- privileged functions در schema خصوصی
- محدودسازی دسترسی مربی/والد به رابطه واقعی
- عدم نگهداری secret در کلاینت

این repository فعلاً آغاز فاز Foundation است؛ ماژول‌های CRM، LMS کامل، شبکه استانی، خدمت، gamification، Temporal و AI بعد از تثبیت هسته اضافه می‌شوند.

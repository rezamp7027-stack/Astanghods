# سامانه جامع جوانان آستان قدس رضوی

پلتفرم موبایل‌محور برای ارتباط، آموزش، ثبت‌نام برنامه‌ها، شبکه‌سازی، خدمت داوطلبانه، رشد و تداوم تعامل جوانان.

## Stack
- Next.js 16 + React 19 + TypeScript
- Supabase PostgreSQL + Auth + Storage + Realtime + RLS
- GitHub + GitHub Actions
- Supabase Edge Functions برای workerهای اعلان و Journey
- NVIDIA NIM پشت abstraction سمت سرور
- Engram برای ثبت وضعیت و تصمیمات معماری

## قابلیت‌های عملیاتی
- Program discovery + registration + atomic capacity/waitlist
- Event discovery + registration + capacity/waitlist
- LMS: course/module/lesson/enrollment/progress
- Youth dashboard: learning, attendance, certificates, growth, recommendations
- Parent portal با consent واقعی
- Mentor portal با assignment واقعی
- Organization portal
- Province network / استان من
- Volunteer/service network
- Content management + public content pages
- Search
- Digital certificate verification
- Notifications + channel preferences + delivery queue
- CRM analytics + Journeys
- Support requests
- Role management با محافظت از آخرین super_admin
- Curated AI assistant با NVIDIA NIM

## مسیرهای اصلی
Public: `/programs`, `/events`, `/courses`, `/content`, `/network`, `/provinces`, `/volunteer`, `/research`, `/search`, `/certificate/verify`

User: `/dashboard`, `/dashboard/learning`, `/dashboard/growth`, `/dashboard/recommendations`, `/dashboard/attendance`, `/dashboard/certificates`, `/dashboard/consent`, `/dashboard/notifications`, `/dashboard/volunteer`, `/dashboard/assistant`, `/dashboard/support`

Role portals: `/parent`, `/mentor`, `/organization`

Admin: `/admin` با مدیریت برنامه، رویداد، ثبت‌نام، حضور، گواهی، LMS، محتوا، مربی، والد، شبکه، CRM، Journey، اعلان، خدمت، تحلیل، کاربران و پشتیبانی.

## امنیت
- RLS روی جداول exposed
- Parent فقط youthهای linked + consented
- Mentor فقط assignment فعال
- Staff با app_role
- privileged logic در private schema
- public RPCها SECURITY INVOKER
- no service_role / AI secret in browser
- audit logs برای تغییرات مهم
- certificate verification فقط خروجی safe و عمومی
- AI فقط با context منتشرشده و بدون افشای داده خصوصی

## Workerها
- `dispatch-notifications`
- `run-journeys`

هر دو با JWT محافظت شده‌اند. برای اجرای زمان‌بندی‌شده production باید از scheduler/Cron یا orchestration مثل Temporal استفاده شوند.

## Environment
Public browser:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Server-only:
- NVIDIA_NIM_API_KEY
- NVIDIA_NIM_BASE_URL
- NVIDIA_NIM_MODEL

Worker secrets:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- MAIL_FROM
- SMS_PROVIDER_URL
- SMS_PROVIDER_TOKEN

## Bootstrap مدیر
پس از ایجاد اولین حساب کاربری، یک‌بار نقش `super_admin` را از مسیر مدیریتی/SQL امن تخصیص دهید. بعد از آن `/admin/users` مرجع مدیریت نقش‌هاست و حذف آخرین super_admin مسدود شده است.

## Research archive
- `supabase/seed/aqr_javanan_research.sql` seed idempotent برای داده‌های پژوهش‌شده مؤسسه.
- `/research` فهرست عمومی منابع، نوع منبع و سطح اعتماد را نمایش می‌دهد.
- رکوردهای تاریخی با `is_historical` از برنامه‌ها و دوره‌های جاری جدا می‌مانند.
- آمار تاریخی به‌عنوان آمار جاری نمایش داده نمی‌شود.

## Validation
```bash
npm install
npm run typecheck
npm run lint
npm run build
```

Merge به `main` فقط بعد از سبز شدن Typecheck/Lint/Build و بررسی Supabase security advisor انجام شود.

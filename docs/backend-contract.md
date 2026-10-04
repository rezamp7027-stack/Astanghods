# Backend contract

این سند قرارداد داده‌ای لایه محصول است، نه دستور اجرای مستقیم روی production.

## Identity
- auth.users: منبع هویت احراز هویت
- profiles: اطلاعات کاربری غیرحساس و نقش
- نقش‌های حساس از user-editable metadata خوانده نمی‌شوند.

## Core
- programs: برنامه‌ها و رویدادهای قابل ثبت‌نام
- enrollments: رابطه کاربر و برنامه، با وضعیت pending/confirmed/waitlist/cancelled/completed
- pathway_events: رویدادهای مسیر برای CRM و recommendation
- organizations: تشکل‌ها و مدارس
- notifications: اعلان‌های قابل پیگیری

## Youth safety
- parent_links: رابطه والد و فرزند با وضعیت تأیید
- consents: رضایت‌نامه با نسخه سیاست و timestamp
- mentor_assignments: انتساب مربی به cohort با دسترسی حداقلی
- attendance: حضور در session/event

## Learning
- courses
- course_modules
- lesson_progress
- assessments
- certificates

## Network / volunteer
- organization_members
- organization_activities
- volunteer_profiles
- volunteer_opportunities
- volunteer_applications

## Workflow RPCs
ثبت‌نام رویداد باید در نهایت یک transaction/RPC اتمیک داشته باشد تا ظرفیت، waitlist و race condition سمت سرور کنترل شود. UI نباید خودش ظرفیت را محاسبه کند و بعد insert ساده بزند.

## Notifications
Email/SMS/push providerها خارج از UI هستند. ارسال زمان‌دار، retry و idempotency برای workflowهای پایدار کاندید Temporal هستند.

## Integration rule
نام جدول‌ها و ستون‌ها باید با schema واقعی Supabase تطبیق داده شوند. adapterها نقطه اتصال‌اند تا domain از تغییرات فیزیکی دیتابیس مستقل بماند.

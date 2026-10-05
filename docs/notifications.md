# Notification worker

تابع `dispatch-notifications` صف notification_deliveries را پردازش می‌کند. Gateway JWT را بررسی می‌کند و خود تابع نیز فقط نقش‌های `super_admin` و `crm_manager` را مجاز می‌داند. Jobها ابتدا با شرط status=queued claim می‌شوند و خطاهای موقت تا پنج مرتبه با backoff به صف برمی‌گردند.

برای email از Resend و برای SMS از provider عمومی استفاده می‌شود. متغیرهای backend:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY + MAIL_FROM
- SMS_PROVIDER_URL + SMS_PROVIDER_TOKEN

کلیدهای secret فقط در runtime تابع نگهداری می‌شوند و هرگز در browser یا repository قرار نمی‌گیرند.

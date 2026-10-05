# NOIR Restaurant Platform
Production-oriented luxury restaurant website, digital menu and Supabase-backed admin system.

## Stack
Next.js 16, React 19, Supabase SSR/Auth/Postgres/Storage, native responsive CSS, QR generation.

## Environment
Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and NEXT_PUBLIC_SITE_URL. Never expose a secret/service-role key to the browser.

## First admin
Open /admin/setup, create the first account, then sign in. The first authenticated account can become Super Admin only while no user role exists.

## Real features
Dynamic restaurant settings, bilingual menu, category/item CRUD, availability flags, media upload with browser WebP compression, protected Storage writes, gallery, offers, reservations, theme editor, SEO, QR menu, role management, audit log, analytics events and drag-and-drop ordering.

## Database
The Supabase project was reset to the restaurant schema by migration 20261005190000_restaurant_platform_reset. The previous youth-platform public application tables were removed; Auth users are preserved.

## Run
npm install
npm run lint
npm run typecheck
npm run build
npm run dev
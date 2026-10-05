# NOIR Restaurant Platform

A production-oriented restaurant website built as a static frontend on GitHub Pages with Supabase as the backend.

## Architecture

- GitHub Pages serves `docs/`
- Supabase PostgreSQL stores restaurant content, menu, offers, gallery, reservations, analytics and audit logs
- Supabase Auth handles admin login
- Supabase Storage handles restaurant images
- Row Level Security controls public vs staff access
- GitHub Actions validates and deploys the static site

## Admin

Open the website and use **مدیریت**. Staff access is controlled by `user_roles` with `super_admin`, `manager`, and `editor`.

The first administrator can be bootstrapped with the `bootstrap_first_admin()` RPC after authenticating.

## Deployment

Every push to `main` runs the Pages workflow. The published site is:

https://rezamp7027-stack.github.io/Astanghods/

No Render service is required for this architecture.

## Supabase

Project URL is configured in `docs/app.js` and only the public publishable key is exposed there. Never place a service-role key in the frontend.

-- Production hardening for the GitHub Pages + Supabase architecture.
alter table public.rate_limits set schema private;
alter table private.rate_limits disable row level security;

create or replace function private.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path to 'private', 'pg_temp'
as $function$
declare
  row private.rate_limits%rowtype;
  now_ts timestamptz:=clock_timestamp();
begin
  perform pg_advisory_xact_lock(hashtext(p_key));
  select * into row from private.rate_limits where key=p_key for update;
  if not found then
    insert into private.rate_limits(key,window_start,request_count) values(p_key,now_ts,1);
    return true;
  end if;
  if row.window_start + make_interval(secs=>p_window_seconds) <= now_ts then
    update private.rate_limits set window_start=now_ts,request_count=1 where key=p_key;
    return true;
  end if;
  if row.request_count >= p_limit then return false; end if;
  update private.rate_limits set request_count=request_count+1 where key=p_key;
  return true;
end
$function$;

drop policy if exists analytics_access on public.analytics_events;
drop policy if exists audit_select on public.audit_logs;
drop policy if exists gallery_access on public.gallery_items;
drop policy if exists media_access on public.media;
drop policy if exists categories_access on public.menu_categories;
drop policy if exists items_access on public.menu_items;
drop policy if exists navigation_access on public.navigation_items;
drop policy if exists reservation_access on public.reservations;
drop policy if exists settings_access on public.restaurant_settings;
drop policy if exists seo_access on public.seo_settings;
drop policy if exists sections_access on public.site_sections;
drop policy if exists socials_access on public.social_links;
drop policy if exists offers_access on public.special_offers;
drop policy if exists theme_access on public.theme_settings;

-- Public content is publicly readable for anonymous visitors; authenticated staff
-- already have role-scoped staff policies, so do not duplicate those SELECT paths.
alter policy gallery_public_read on public.gallery_items to anon;
alter policy media_public_read on public.media to anon;
alter policy categories_public_read on public.menu_categories to anon;
alter policy items_public_read on public.menu_items to anon;
alter policy navigation_public_read on public.navigation_items to anon;
alter policy settings_public_read on public.restaurant_settings to anon;
alter policy seo_public_read on public.seo_settings to anon;
alter policy sections_public_read on public.site_sections to anon;
alter policy socials_public_read on public.social_links to anon;
alter policy offers_public_read on public.special_offers to anon;
alter policy theme_public_read on public.theme_settings to anon;

drop policy if exists profiles_admin_read on public.profiles;
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_select on public.profiles
for select to authenticated
using (((select auth.uid()) = id) or (select private.has_role('super_admin'::text)));

drop policy if exists user_roles_self_read on public.user_roles;
drop policy if exists user_roles_super_admin_all on public.user_roles;
create policy user_roles_select on public.user_roles
for select to authenticated
using (((select auth.uid()) = user_id) or (select private.has_role('super_admin'::text)));
create policy user_roles_super_admin_insert on public.user_roles
for insert to authenticated
with check ((select private.has_role('super_admin'::text)));
create policy user_roles_super_admin_update on public.user_roles
for update to authenticated
using ((select private.has_role('super_admin'::text)))
with check ((select private.has_role('super_admin'::text)));
create policy user_roles_super_admin_delete on public.user_roles
for delete to authenticated
using ((select private.has_role('super_admin'::text)));

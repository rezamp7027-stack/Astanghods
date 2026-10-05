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
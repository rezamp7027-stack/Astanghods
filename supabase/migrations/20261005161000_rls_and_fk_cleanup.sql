alter table public.rate_limits disable row level security;

drop policy if exists profiles_self_read on public.profiles;
drop policy if exists profiles_admin_read on public.profiles;
create policy profiles_select on public.profiles for select to authenticated using (auth.uid()=id or private.has_role('super_admin'));
drop policy if exists user_roles_self_read on public.user_roles;
drop policy if exists user_roles_super_admin_all on public.user_roles;
create policy user_roles_select on public.user_roles for select to authenticated using (auth.uid()=user_id or private.has_role('super_admin'));
create policy user_roles_insert on public.user_roles for insert to authenticated with check (private.has_role('super_admin'));
create policy user_roles_update on public.user_roles for update to authenticated using(private.has_role('super_admin')) with check(private.has_role('super_admin'));
create policy user_roles_delete on public.user_roles for delete to authenticated using(private.has_role('super_admin'));

drop policy if exists settings_public_read on public.restaurant_settings;
drop policy if exists settings_manager_manage on public.restaurant_settings;
create policy settings_access on public.restaurant_settings for all to anon,authenticated using(true) with check(private.has_any_role(array['super_admin','manager']));

drop policy if exists theme_public_read on public.theme_settings;
drop policy if exists theme_super_admin_manage on public.theme_settings;
create policy theme_access on public.theme_settings for all to anon,authenticated using(true) with check(private.has_role('super_admin'));

drop policy if exists sections_public_read on public.site_sections;
drop policy if exists sections_editor_manage on public.site_sections;
create policy sections_access on public.site_sections for all to anon,authenticated using(enabled or private.has_any_role(array['super_admin','editor'])) with check(private.has_any_role(array['super_admin','editor']));

drop policy if exists navigation_public_read on public.navigation_items;
drop policy if exists navigation_manager_manage on public.navigation_items;
create policy navigation_access on public.navigation_items for all to anon,authenticated using(is_enabled or private.has_any_role(array['super_admin','manager'])) with check(private.has_any_role(array['super_admin','manager']));

drop policy if exists socials_public_read on public.social_links;
drop policy if exists socials_manager_manage on public.social_links;
create policy socials_access on public.social_links for all to anon,authenticated using(is_enabled or private.has_any_role(array['super_admin','manager'])) with check(private.has_any_role(array['super_admin','manager']));

drop policy if exists media_public_read on public.media;
drop policy if exists media_staff_all on public.media;
create policy media_access on public.media for all to anon,authenticated using(deleted_at is null or private.has_any_role(array['super_admin','manager','editor'])) with check(private.has_any_role(array['super_admin','manager','editor']));

drop policy if exists categories_public_read on public.menu_categories;
drop policy if exists categories_staff_all on public.menu_categories;
create policy categories_access on public.menu_categories for all to anon,authenticated using((is_active and deleted_at is null) or private.has_any_role(array['super_admin','manager','editor'])) with check(private.has_any_role(array['super_admin','manager','editor']));

drop policy if exists items_public_read on public.menu_items;
drop policy if exists items_staff_all on public.menu_items;
create policy items_access on public.menu_items for all to anon,authenticated using((deleted_at is null and exists(select 1 from public.menu_categories c where c.id=category_id and c.is_active and c.deleted_at is null)) or private.has_any_role(array['super_admin','manager','editor'])) with check(private.has_any_role(array['super_admin','manager','editor']));

drop policy if exists gallery_public_read on public.gallery_items;
drop policy if exists gallery_staff_all on public.gallery_items;
create policy gallery_access on public.gallery_items for all to anon,authenticated using((is_enabled and deleted_at is null) or private.has_any_role(array['super_admin','manager','editor'])) with check(private.has_any_role(array['super_admin','manager','editor']));

drop policy if exists offers_public_read on public.special_offers;
drop policy if exists offers_staff_all on public.special_offers;
create policy offers_access on public.special_offers for all to anon,authenticated using((is_active and starts_at<=now() and ends_at>=now()) or private.has_any_role(array['super_admin','manager','editor'])) with check(private.has_any_role(array['super_admin','manager','editor']));

drop policy if exists seo_public_read on public.seo_settings;
drop policy if exists seo_super_admin_manage on public.seo_settings;
create policy seo_access on public.seo_settings for all to anon,authenticated using(true) with check(private.has_role('super_admin'));

drop policy if exists reservation_public_insert on public.reservations;
drop policy if exists reservation_staff_read on public.reservations;
drop policy if exists reservation_staff_update on public.reservations;
drop policy if exists reservation_staff_delete on public.reservations;
create policy reservation_access on public.reservations for all to anon,authenticated using(private.has_any_role(array['super_admin','manager'])) with check((reservation_at>=now() and char_length(trim(name)) between 2 and 120 and char_length(trim(phone)) between 7 and 30 and party_size between 1 and 50) or private.has_any_role(array['super_admin','manager']));

drop policy if exists analytics_insert on public.analytics_events;
drop policy if exists analytics_read on public.analytics_events;
create policy analytics_access on public.analytics_events for all to anon,authenticated using(private.has_role('super_admin')) with check(event_type in('page_view','menu_view','menu_item_view','contact_click','map_click','reservation_submit') or private.has_role('super_admin'));

drop policy if exists audit_read on public.audit_logs;
create policy audit_select on public.audit_logs for select to authenticated using(private.has_role('super_admin'));

create index if not exists gallery_items_media_id_idx on public.gallery_items(media_id);
create index if not exists media_created_by_idx on public.media(created_by);
create index if not exists menu_categories_media_id_idx on public.menu_categories(media_id);
create index if not exists menu_items_media_id_idx on public.menu_items(media_id);
create index if not exists restaurant_settings_logo_media_id_idx on public.restaurant_settings(logo_media_id);
create index if not exists restaurant_settings_favicon_media_id_idx on public.restaurant_settings(favicon_media_id);
create index if not exists seo_settings_og_image_media_id_idx on public.seo_settings(og_image_media_id);
create index if not exists site_sections_image_media_id_idx on public.site_sections(image_media_id);
create index if not exists site_sections_mobile_image_media_id_idx on public.site_sections(mobile_image_media_id);
create index if not exists special_offers_image_media_id_idx on public.special_offers(image_media_id);
create index if not exists user_roles_assigned_by_idx on public.user_roles(assigned_by);
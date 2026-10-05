-- Reproducible final RLS consolidation
drop policy if exists engagement_events_self_insert on public.engagement_events;
drop policy if exists engagement_self_insert on public.engagement_events;
create policy engagement_events_insert on public.engagement_events for insert to authenticated with check(user_id=(select auth.uid()));
drop policy if exists engagement_events_self_read on public.engagement_events;
drop policy if exists engagement_self_read on public.engagement_events;
drop policy if exists engagement_staff_read on public.engagement_events;
create policy engagement_events_read on public.engagement_events for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','regional_manager','auditor']::public.app_role[]));
drop policy if exists gamification_events_self on public.gamification_events;
drop policy if exists gamification_events_staff on public.gamification_events;
create policy gamification_events_read on public.gamification_events for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','auditor']::public.app_role[]));
drop policy if exists gamification_points_self on public.gamification_points;
drop policy if exists gamification_points_staff on public.gamification_points;
create policy gamification_points_read on public.gamification_points for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','auditor']::public.app_role[]));
drop policy if exists profiles_select_self on public.profiles;
drop policy if exists volunteer_assignments_read on public.volunteer_assignments;
drop policy if exists volunteer_assignments_staff on public.volunteer_assignments;
create policy volunteer_assignments_read on public.volunteer_assignments for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','regional_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists waitlist_select_self on public.waitlist_entries;
-- Reproducible copy of the final live RLS consolidation.
drop policy if exists support_requests_self_read on public.support_requests;
drop policy if exists support_requests_self_insert on public.support_requests;
drop policy if exists support_requests_staff on public.support_requests;
create policy support_requests_read on public.support_requests for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','auditor']::public.app_role[]));
create policy support_requests_insert on public.support_requests for insert to authenticated with check(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
create policy support_requests_update on public.support_requests for update to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager']::public.app_role[])) with check(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
drop policy if exists user_roles_select_self on public.user_roles;
drop policy if exists user_roles_staff_read on public.user_roles;
create policy user_roles_read on public.user_roles for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','auditor']::public.app_role[]));
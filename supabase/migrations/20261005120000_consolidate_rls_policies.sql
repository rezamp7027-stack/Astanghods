-- Consolidate permissive RLS policies without widening access.
-- Generated after validating the live Supabase policy set.

drop policy if exists profiles_staff_read on public.profiles;
drop policy if exists profiles_parent_children_read on public.profiles;
drop policy if exists profiles_mentor_assigned_read on public.profiles;
drop policy if exists profiles_read_scoped on public.profiles;
create policy profiles_read_scoped on public.profiles for select to authenticated
using (id=(select auth.uid()) or public.has_any_role(array['super_admin','program_manager','content_manager','mentor_manager','regional_manager','crm_manager','auditor']::public.app_role[]) or exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=profiles.id and pl.is_active=true and pl.consented_at is not null) or exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=profiles.id and ma.ended_at is null));

drop policy if exists registrations_read on public.registrations;
drop policy if exists registrations_parent_read on public.registrations;
drop policy if exists registrations_mentor_read on public.registrations;
create policy registrations_read on public.registrations for select to authenticated
using (user_id=(select auth.uid()) or public.has_any_role(array['super_admin','program_manager','crm_manager','auditor']::public.app_role[]) or exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=registrations.user_id and pl.is_active=true and pl.consented_at is not null) or exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=registrations.user_id and ma.ended_at is null));
drop policy if exists registrations_update on public.registrations;
create policy registrations_update on public.registrations for update to authenticated
using ((user_id=(select auth.uid()) and status in('pending','confirmed','waitlisted')) or public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]))
with check ((user_id=(select auth.uid()) and status='cancelled') or public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]));

drop policy if exists waitlist_staff_read on public.waitlist_entries;
drop policy if exists waitlist_parent_read on public.waitlist_entries;
drop policy if exists waitlist_mentor_read on public.waitlist_entries;
create policy waitlist_read on public.waitlist_entries for select to authenticated
using (public.has_any_role(array['super_admin','program_manager','crm_manager','auditor']::public.app_role[]) or exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=waitlist_entries.user_id and pl.is_active=true and pl.consented_at is not null) or exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=waitlist_entries.user_id and ma.ended_at is null));

drop policy if exists enrollments_read on public.enrollments;
drop policy if exists enrollments_parent_read on public.enrollments;
drop policy if exists enrollments_mentor_read on public.enrollments;
create policy enrollments_read on public.enrollments for select to authenticated
using (user_id=(select auth.uid()) or public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[]) or exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=enrollments.user_id and pl.is_active=true and pl.consented_at is not null) or exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=enrollments.user_id and ma.ended_at is null));

drop policy if exists lesson_progress_self on public.lesson_progress;
drop policy if exists lesson_progress_parent_read on public.lesson_progress;
drop policy if exists lesson_progress_mentor_read on public.lesson_progress;
create policy lesson_progress_read on public.lesson_progress for select to authenticated
using (user_id=(select auth.uid()) or exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=lesson_progress.user_id and pl.is_active=true and pl.consented_at is not null) or exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=lesson_progress.user_id and ma.ended_at is null));
create policy lesson_progress_self_insert on public.lesson_progress for insert to authenticated with check (user_id=(select auth.uid()) and exists(select 1 from public.lessons l join public.course_modules m on m.id=l.module_id join public.enrollments e on e.course_id=m.course_id where l.id=lesson_progress.lesson_id and e.user_id=(select auth.uid()) and e.status in('active','completed')));
create policy lesson_progress_self_update on public.lesson_progress for update to authenticated using (user_id=(select auth.uid()) and exists(select 1 from public.lessons l join public.course_modules m on m.id=l.module_id join public.enrollments e on e.course_id=m.course_id where l.id=lesson_progress.lesson_id and e.user_id=(select auth.uid()) and e.status in('active','completed'))) with check (user_id=(select auth.uid()) and exists(select 1 from public.lessons l join public.course_modules m on m.id=l.module_id join public.enrollments e on e.course_id=m.course_id where l.id=lesson_progress.lesson_id and e.user_id=(select auth.uid()) and e.status in('active','completed')));
create policy lesson_progress_self_delete on public.lesson_progress for delete to authenticated using (user_id=(select auth.uid()) and exists(select 1 from public.lessons l join public.course_modules m on m.id=l.module_id join public.enrollments e on e.course_id=m.course_id where l.id=lesson_progress.lesson_id and e.user_id=(select auth.uid()) and e.status in('active','completed')));

drop policy if exists attendance_self_read on public.attendance;
drop policy if exists attendance_parent_read on public.attendance;
drop policy if exists attendance_mentor_read on public.attendance;
drop policy if exists attendance_staff_read on public.attendance;
create policy attendance_read on public.attendance for select to authenticated
using (user_id=(select auth.uid()) or public.has_any_role(array['super_admin','program_manager','mentor_manager','auditor']::public.app_role[]) or exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=attendance.user_id and pl.is_active=true and pl.consented_at is not null) or exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null));
drop policy if exists attendance_staff_write on public.attendance;
drop policy if exists attendance_mentor_write on public.attendance;
create policy attendance_insert on public.attendance for insert to authenticated
with check (public.has_any_role(array['super_admin','program_manager','mentor_manager']::public.app_role[]) or exists(select 1 from public.mentor_assignments ma left join public.event_sessions es on es.id=attendance.session_id left join public.events ev on ev.id=es.event_id where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null and (ma.program_id is null or ma.program_id=ev.program_id)));
drop policy if exists attendance_staff_update on public.attendance;
drop policy if exists attendance_mentor_update on public.attendance;
create policy attendance_update on public.attendance for update to authenticated
using (public.has_any_role(array['super_admin','program_manager','mentor_manager']::public.app_role[]) or exists(select 1 from public.mentor_assignments ma left join public.event_sessions es on es.id=attendance.session_id left join public.events ev on ev.id=es.event_id where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null and (ma.program_id is null or ma.program_id=ev.program_id)))
with check (public.has_any_role(array['super_admin','program_manager','mentor_manager']::public.app_role[]) or exists(select 1 from public.mentor_assignments ma left join public.event_sessions es on es.id=attendance.session_id left join public.events ev on ev.id=es.event_id where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null and (ma.program_id is null or ma.program_id=ev.program_id)));

drop policy if exists certificates_self_read on public.certificates;
drop policy if exists certificates_parent_read on public.certificates;
drop policy if exists certificates_staff_read on public.certificates;
create policy certificates_read on public.certificates for select to authenticated
using (user_id=(select auth.uid()) or public.has_any_role(array['super_admin','program_manager','content_manager','mentor_manager','regional_manager','crm_manager','auditor']::public.app_role[]) or exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=certificates.user_id and pl.is_active=true and pl.consented_at is not null));

drop policy if exists event_registrations_self_read on public.event_registrations;
drop policy if exists event_registrations_staff_read on public.event_registrations;
create policy event_registrations_read on public.event_registrations for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','program_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists event_registrations_self_cancel on public.event_registrations;
drop policy if exists event_registrations_staff_update on public.event_registrations;
create policy event_registrations_update on public.event_registrations for update to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[])) with check((user_id=(select auth.uid()) and status='cancelled') or public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]));

drop policy if exists recommendations_self on public.recommendations;
drop policy if exists recommendations_staff on public.recommendations;
create policy recommendations_read on public.recommendations for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','program_manager']::public.app_role[]));
drop policy if exists recommendations_self_update on public.recommendations;
create policy recommendations_update on public.recommendations for update to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','program_manager']::public.app_role[])) with check(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','program_manager']::public.app_role[]));
create policy recommendations_insert on public.recommendations for insert to authenticated with check(public.has_any_role(array['super_admin','crm_manager','program_manager']::public.app_role[]));
create policy recommendations_delete on public.recommendations for delete to authenticated using(public.has_any_role(array['super_admin','crm_manager','program_manager']::public.app_role[]));

drop policy if exists journey_enrollments_self on public.journey_enrollments;
drop policy if exists journey_enrollments_staff on public.journey_enrollments;
create policy journey_enrollments_read on public.journey_enrollments for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
create policy journey_enrollments_insert on public.journey_enrollments for insert to authenticated with check(public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
create policy journey_enrollments_update on public.journey_enrollments for update to authenticated using(public.has_any_role(array['super_admin','crm_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
create policy journey_enrollments_delete on public.journey_enrollments for delete to authenticated using(public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));

drop policy if exists volunteer_profiles_self on public.volunteer_profiles;
drop policy if exists volunteer_profiles_staff on public.volunteer_profiles;
create policy volunteer_profiles_read on public.volunteer_profiles for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','crm_manager','regional_manager','auditor']::public.app_role[]));
create policy volunteer_profiles_insert on public.volunteer_profiles for insert to authenticated with check(user_id=(select auth.uid()));
create policy volunteer_profiles_update on public.volunteer_profiles for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy volunteer_profiles_delete on public.volunteer_profiles for delete to authenticated using(user_id=(select auth.uid()));

drop policy if exists volunteer_opportunities_public_read on public.volunteer_opportunities;
drop policy if exists volunteer_opportunities_staff on public.volunteer_opportunities;
create policy volunteer_opportunities_read on public.volunteer_opportunities for select to anon,authenticated using(status='published' or public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[]));
create policy volunteer_opportunities_insert on public.volunteer_opportunities for insert to authenticated with check(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[]));
create policy volunteer_opportunities_update on public.volunteer_opportunities for update to authenticated using(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[]));
create policy volunteer_opportunities_delete on public.volunteer_opportunities for delete to authenticated using(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[]));

drop policy if exists volunteer_assignments_self_read on public.volunteer_assignments;
drop policy if exists volunteer_assignments_staff_read on public.volunteer_assignments;
create policy volunteer_assignments_read on public.volunteer_assignments for select to authenticated using(user_id=(select auth.uid()) or public.has_any_role(array['super_admin','regional_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists volunteer_assignments_staff_update on public.volunteer_assignments;
create policy volunteer_assignments_update on public.volunteer_assignments for update to authenticated using(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','regional_manager','crm_manager']::public.app_role[]));

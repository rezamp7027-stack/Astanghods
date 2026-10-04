-- Astanghods Performance / RLS Consolidation
-- Applied remotely as migration 20261004232650.

create index if not exists audit_logs_actor_user_idx on public.audit_logs(actor_user_id);
create index if not exists consent_records_user_idx on public.consent_records(user_id);
create index if not exists content_author_idx on public.content(author_id);
create index if not exists course_modules_course_idx on public.course_modules(course_id);
create index if not exists courses_created_by_idx on public.courses(created_by);
create index if not exists enrollments_user_idx on public.enrollments(user_id);
create index if not exists event_sessions_event_idx on public.event_sessions(event_id);
create index if not exists events_program_idx on public.events(program_id);
create index if not exists lesson_progress_user_idx on public.lesson_progress(user_id);
create index if not exists mentor_assignments_assigned_by_idx on public.mentor_assignments(assigned_by);
create index if not exists mentor_assignments_program_idx on public.mentor_assignments(program_id);
create index if not exists organization_members_user_idx on public.organization_members(user_id);
create index if not exists organizations_province_idx on public.organizations(province_id);
create index if not exists parent_links_youth_idx on public.parent_links(youth_user_id);
create index if not exists profiles_province_idx on public.profiles(province_id);
create index if not exists programs_created_by_idx on public.programs(created_by);
create index if not exists user_roles_assigned_by_idx on public.user_roles(assigned_by);
create index if not exists user_roles_role_idx on public.user_roles(role_id);
create index if not exists waitlist_entries_user_idx on public.waitlist_entries(user_id);

drop policy if exists content_manage_staff on public.content;
create policy content_write_staff on public.content
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy content_update_staff on public.content
  for update to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy content_delete_staff on public.content
  for delete to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
drop policy if exists content_public_read on public.content;
create policy content_read on public.content
  for select to anon, authenticated
  using (
    status = 'published'
    or public.has_any_role(array['super_admin','content_manager']::public.app_role[])
  );

drop policy if exists courses_manage_staff on public.courses;
create policy courses_write_staff on public.courses
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy courses_update_staff on public.courses
  for update to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy courses_delete_staff on public.courses
  for delete to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
drop policy if exists courses_public_read on public.courses;
create policy courses_read on public.courses
  for select to anon, authenticated
  using (
    is_published = true
    or public.has_any_role(array['super_admin','content_manager']::public.app_role[])
  );

drop policy if exists modules_manage_staff on public.course_modules;
create policy modules_write_staff on public.course_modules
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy modules_update_staff on public.course_modules
  for update to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy modules_delete_staff on public.course_modules
  for delete to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
drop policy if exists modules_public_read on public.course_modules;
create policy modules_read on public.course_modules
  for select to anon, authenticated
  using (
    exists (select 1 from public.courses c where c.id = course_id and c.is_published = true)
    or public.has_any_role(array['super_admin','content_manager']::public.app_role[])
  );

drop policy if exists enrollments_staff_manage on public.enrollments;
create policy enrollments_write_staff on public.enrollments
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[]));
create policy enrollments_update_staff on public.enrollments
  for update to authenticated
  using (public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[]));
create policy enrollments_delete_staff on public.enrollments
  for delete to authenticated
  using (public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[]));
drop policy if exists enrollments_select_self on public.enrollments;
create policy enrollments_read on public.enrollments
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_any_role(array['super_admin','content_manager','program_manager']::public.app_role[])
  );

drop policy if exists event_sessions_manage_staff on public.event_sessions;
create policy event_sessions_write_staff on public.event_sessions
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy event_sessions_update_staff on public.event_sessions
  for update to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy event_sessions_delete_staff on public.event_sessions
  for delete to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
drop policy if exists event_sessions_public_read on public.event_sessions;
create policy event_sessions_read on public.event_sessions
  for select to anon, authenticated
  using (
    exists (select 1 from public.events e where e.id = event_id and e.is_public = true)
    or public.has_any_role(array['super_admin','program_manager']::public.app_role[])
  );

drop policy if exists events_manage_staff on public.events;
create policy events_write_staff on public.events
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy events_update_staff on public.events
  for update to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy events_delete_staff on public.events
  for delete to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
drop policy if exists events_public_read on public.events;
create policy events_read on public.events
  for select to anon, authenticated
  using (
    is_public = true
    or public.has_any_role(array['super_admin','program_manager']::public.app_role[])
  );

drop policy if exists lessons_manage_staff on public.lessons;
create policy lessons_write_staff on public.lessons
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy lessons_update_staff on public.lessons
  for update to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
create policy lessons_delete_staff on public.lessons
  for delete to authenticated
  using (public.has_any_role(array['super_admin','content_manager']::public.app_role[]));
drop policy if exists lessons_public_read on public.lessons;
create policy lessons_read on public.lessons
  for select to anon, authenticated
  using (
    (
      is_published = true
      and exists (
        select 1 from public.course_modules m
        join public.courses c on c.id = m.course_id
        where m.id = module_id and c.is_published = true
      )
    )
    or public.has_any_role(array['super_admin','content_manager']::public.app_role[])
  );

drop policy if exists mentor_assignments_staff_manage on public.mentor_assignments;
create policy mentor_assignments_write_staff on public.mentor_assignments
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','mentor_manager']::public.app_role[]));
create policy mentor_assignments_update_staff on public.mentor_assignments
  for update to authenticated
  using (public.has_any_role(array['super_admin','mentor_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','mentor_manager']::public.app_role[]));
create policy mentor_assignments_delete_staff on public.mentor_assignments
  for delete to authenticated
  using (public.has_any_role(array['super_admin','mentor_manager']::public.app_role[]));
drop policy if exists mentor_assignments_mentor_read on public.mentor_assignments;
drop policy if exists mentor_assignments_youth_read on public.mentor_assignments;
create policy mentor_assignments_read on public.mentor_assignments
  for select to authenticated
  using (
    mentor_user_id = (select auth.uid())
    or youth_user_id = (select auth.uid())
    or public.has_any_role(array['super_admin','mentor_manager']::public.app_role[])
  );

drop policy if exists organization_members_manage_staff on public.organization_members;
create policy organization_members_write_staff on public.organization_members
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));
create policy organization_members_update_staff on public.organization_members
  for update to authenticated
  using (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));
create policy organization_members_delete_staff on public.organization_members
  for delete to authenticated
  using (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));
drop policy if exists organization_members_self on public.organization_members;
create policy organization_members_read on public.organization_members
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_any_role(array['super_admin','regional_manager']::public.app_role[])
  );

drop policy if exists organizations_manage_staff on public.organizations;
create policy organizations_write_staff on public.organizations
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));
create policy organizations_update_staff on public.organizations
  for update to authenticated
  using (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));
create policy organizations_delete_staff on public.organizations
  for delete to authenticated
  using (public.has_any_role(array['super_admin','regional_manager']::public.app_role[]));
drop policy if exists organizations_member_read on public.organizations;
create policy organizations_read on public.organizations
  for select to authenticated
  using (
    public.has_any_role(array['super_admin','regional_manager']::public.app_role[])
    or exists (
      select 1 from public.organization_members om
      where om.organization_id = id
        and om.user_id = (select auth.uid())
        and om.is_active = true
    )
  );

drop policy if exists parent_links_parent_read on public.parent_links;
drop policy if exists parent_links_youth_read on public.parent_links;
create policy parent_links_read on public.parent_links
  for select to authenticated
  using (
    parent_user_id = (select auth.uid())
    or youth_user_id = (select auth.uid())
  );

drop policy if exists program_tracks_manage_staff on public.program_tracks;
create policy program_tracks_write_staff on public.program_tracks
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy program_tracks_update_staff on public.program_tracks
  for update to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy program_tracks_delete_staff on public.program_tracks
  for delete to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
drop policy if exists program_tracks_public_read on public.program_tracks;
create policy program_tracks_read on public.program_tracks
  for select to anon, authenticated
  using (
    exists (select 1 from public.programs p where p.id = program_id and p.status = 'published')
    or public.has_any_role(array['super_admin','program_manager']::public.app_role[])
  );

drop policy if exists programs_manage_staff on public.programs;
create policy programs_write_staff on public.programs
  for insert to authenticated
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy programs_update_staff on public.programs
  for update to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]))
  with check (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
create policy programs_delete_staff on public.programs
  for delete to authenticated
  using (public.has_any_role(array['super_admin','program_manager']::public.app_role[]));
drop policy if exists programs_public_read on public.programs;
create policy programs_read on public.programs
  for select to anon, authenticated
  using (
    status = 'published'
    or public.has_any_role(array['super_admin','program_manager']::public.app_role[])
  );

drop policy if exists registrations_staff_read on public.registrations;
drop policy if exists registrations_select_self on public.registrations;
create policy registrations_read on public.registrations
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or public.has_any_role(array['super_admin','program_manager','crm_manager','auditor']::public.app_role[])
  );

drop policy if exists registrations_staff_update on public.registrations;
drop policy if exists registrations_update_self_cancel on public.registrations;
create policy registrations_update on public.registrations
  for update to authenticated
  using (
    (user_id = (select auth.uid()) and status in ('pending','confirmed','waitlisted'))
    or public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[])
  )
  with check (
    (user_id = (select auth.uid()) and status = 'cancelled')
    or public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[])
  );

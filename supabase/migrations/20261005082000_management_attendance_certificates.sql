-- Mirrors the management/attendance/certificate SQL already applied to the remote project.
create table if not exists public.attendance (
 id uuid primary key default gen_random_uuid(),
 session_id uuid not null references public.event_sessions(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 status text not null default 'present' check(status in('present','absent','late','excused')),
 checked_at timestamptz, marked_by uuid references auth.users(id) on delete set null, notes text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(session_id,user_id)
);
create table if not exists public.certificates (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 course_id uuid references public.courses(id) on delete set null,
 program_id uuid references public.programs(id) on delete set null,
 title text not null, certificate_number text not null unique,
 verification_code text not null unique default encode(gen_random_bytes(12),'hex'),
 issued_at timestamptz not null default now(), revoked_at timestamptz,
 metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(),
 check(course_id is not null or program_id is not null)
);
create table if not exists public.notification_deliveries (
 id uuid primary key default gen_random_uuid(),
 notification_id uuid not null references public.notifications(id) on delete cascade,
 channel text not null check(channel in('in_app','sms','email','push')),
 status text not null default 'queued' check(status in('queued','processing','sent','failed','cancelled')),
 provider text, provider_message_id text, attempts integer not null default 0 check(attempts>=0),
 scheduled_at timestamptz, sent_at timestamptz, last_error text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 unique(notification_id,channel)
);
create index if not exists attendance_session_idx on public.attendance(session_id,status);
create index if not exists attendance_user_idx on public.attendance(user_id,created_at desc);
create index if not exists certificates_user_idx on public.certificates(user_id,issued_at desc);
create index if not exists certificates_course_idx on public.certificates(course_id);
create index if not exists certificates_program_idx on public.certificates(program_id);
create index if not exists notification_deliveries_queue_idx on public.notification_deliveries(status,scheduled_at);
create index if not exists notification_deliveries_notification_idx on public.notification_deliveries(notification_id);
drop trigger if exists attendance_set_updated_at on public.attendance;
create trigger attendance_set_updated_at before update on public.attendance for each row execute function public.set_updated_at();
drop trigger if exists notification_deliveries_set_updated_at on public.notification_deliveries;
create trigger notification_deliveries_set_updated_at before update on public.notification_deliveries for each row execute function public.set_updated_at();
alter table public.attendance enable row level security;
alter table public.certificates enable row level security;
alter table public.notification_deliveries enable row level security;
grant select,insert,update,delete on public.attendance to authenticated;
grant select,insert,update,delete on public.certificates to authenticated;
grant select,insert,update,delete on public.notification_deliveries to authenticated;

drop policy if exists profiles_staff_read on public.profiles;
create policy profiles_staff_read on public.profiles for select to authenticated using(public.has_any_role(array['super_admin','program_manager','content_manager','mentor_manager','regional_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists profiles_parent_children_read on public.profiles;
create policy profiles_parent_children_read on public.profiles for select to authenticated using(exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=profiles.id and pl.is_active=true and pl.consented_at is not null));
drop policy if exists profiles_mentor_assigned_read on public.profiles;
create policy profiles_mentor_assigned_read on public.profiles for select to authenticated using(exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=profiles.id and ma.ended_at is null));

drop policy if exists registrations_parent_read on public.registrations;
create policy registrations_parent_read on public.registrations for select to authenticated using(exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=registrations.user_id and pl.is_active=true and pl.consented_at is not null));
drop policy if exists registrations_mentor_read on public.registrations;
create policy registrations_mentor_read on public.registrations for select to authenticated using(exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=registrations.user_id and ma.ended_at is null));

drop policy if exists waitlist_staff_read on public.waitlist_entries;
create policy waitlist_staff_read on public.waitlist_entries for select to authenticated using(public.has_any_role(array['super_admin','program_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists waitlist_parent_read on public.waitlist_entries;
create policy waitlist_parent_read on public.waitlist_entries for select to authenticated using(exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=waitlist_entries.user_id and pl.is_active=true and pl.consented_at is not null));
drop policy if exists waitlist_mentor_read on public.waitlist_entries;
create policy waitlist_mentor_read on public.waitlist_entries for select to authenticated using(exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=waitlist_entries.user_id and ma.ended_at is null));

drop policy if exists enrollments_parent_read on public.enrollments;
create policy enrollments_parent_read on public.enrollments for select to authenticated using(exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=enrollments.user_id and pl.is_active=true and pl.consented_at is not null));
drop policy if exists enrollments_mentor_read on public.enrollments;
create policy enrollments_mentor_read on public.enrollments for select to authenticated using(exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=enrollments.user_id and ma.ended_at is null));

drop policy if exists lesson_progress_parent_read on public.lesson_progress;
create policy lesson_progress_parent_read on public.lesson_progress for select to authenticated using(exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=lesson_progress.user_id and pl.is_active=true and pl.consented_at is not null));
drop policy if exists lesson_progress_mentor_read on public.lesson_progress;
create policy lesson_progress_mentor_read on public.lesson_progress for select to authenticated using(exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=lesson_progress.user_id and ma.ended_at is null));

drop policy if exists attendance_self_read on public.attendance;
create policy attendance_self_read on public.attendance for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists attendance_parent_read on public.attendance;
create policy attendance_parent_read on public.attendance for select to authenticated using(exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=attendance.user_id and pl.is_active=true and pl.consented_at is not null));
drop policy if exists attendance_mentor_read on public.attendance;
create policy attendance_mentor_read on public.attendance for select to authenticated using(exists(select 1 from public.mentor_assignments ma where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null));
drop policy if exists attendance_staff_read on public.attendance;
create policy attendance_staff_read on public.attendance for select to authenticated using(public.has_any_role(array['super_admin','program_manager','mentor_manager','auditor']::public.app_role[]));
drop policy if exists attendance_staff_write on public.attendance;
create policy attendance_staff_write on public.attendance for insert to authenticated with check(public.has_any_role(array['super_admin','program_manager','mentor_manager']::public.app_role[]));
drop policy if exists attendance_mentor_write on public.attendance;
create policy attendance_mentor_write on public.attendance for insert to authenticated with check(exists(select 1 from public.mentor_assignments ma left join public.event_sessions es on es.id=attendance.session_id left join public.events ev on ev.id=es.event_id where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null and (ma.program_id is null or ma.program_id=ev.program_id)));
drop policy if exists attendance_staff_update on public.attendance;
create policy attendance_staff_update on public.attendance for update to authenticated using(public.has_any_role(array['super_admin','program_manager','mentor_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','program_manager','mentor_manager']::public.app_role[]));
drop policy if exists attendance_mentor_update on public.attendance;
create policy attendance_mentor_update on public.attendance for update to authenticated using(exists(select 1 from public.mentor_assignments ma left join public.event_sessions es on es.id=attendance.session_id left join public.events ev on ev.id=es.event_id where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null and (ma.program_id is null or ma.program_id=ev.program_id))) with check(exists(select 1 from public.mentor_assignments ma left join public.event_sessions es on es.id=attendance.session_id left join public.events ev on ev.id=es.event_id where ma.mentor_user_id=(select auth.uid()) and ma.youth_user_id=attendance.user_id and ma.ended_at is null and (ma.program_id is null or ma.program_id=ev.program_id)));
drop policy if exists attendance_staff_delete on public.attendance;
create policy attendance_staff_delete on public.attendance for delete to authenticated using(public.has_any_role(array['super_admin','program_manager','mentor_manager']::public.app_role[]));

drop policy if exists certificates_self_read on public.certificates;
create policy certificates_self_read on public.certificates for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists certificates_parent_read on public.certificates;
create policy certificates_parent_read on public.certificates for select to authenticated using(exists(select 1 from public.parent_links pl where pl.parent_user_id=(select auth.uid()) and pl.youth_user_id=certificates.user_id and pl.is_active=true and pl.consented_at is not null));
drop policy if exists certificates_staff_read on public.certificates;
create policy certificates_staff_read on public.certificates for select to authenticated using(public.has_any_role(array['super_admin','program_manager','content_manager','mentor_manager','regional_manager','crm_manager','auditor']::public.app_role[]));
drop policy if exists certificates_staff_write on public.certificates;
create policy certificates_staff_write on public.certificates for insert to authenticated with check(public.has_any_role(array['super_admin','program_manager','content_manager']::public.app_role[]));
drop policy if exists certificates_staff_update on public.certificates;
create policy certificates_staff_update on public.certificates for update to authenticated using(public.has_any_role(array['super_admin','program_manager','content_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','program_manager','content_manager']::public.app_role[]));
drop policy if exists certificates_staff_delete on public.certificates;
create policy certificates_staff_delete on public.certificates for delete to authenticated using(public.has_any_role(array['super_admin','program_manager','content_manager']::public.app_role[]));

drop policy if exists notification_deliveries_staff_read on public.notification_deliveries;
create policy notification_deliveries_staff_read on public.notification_deliveries for select to authenticated using(public.has_any_role(array['super_admin','crm_manager','auditor']::public.app_role[]));
drop policy if exists notification_deliveries_staff_write on public.notification_deliveries;
create policy notification_deliveries_staff_write on public.notification_deliveries for insert to authenticated with check(public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
drop policy if exists notification_deliveries_staff_update on public.notification_deliveries;
create policy notification_deliveries_staff_update on public.notification_deliveries for update to authenticated using(public.has_any_role(array['super_admin','crm_manager']::public.app_role[])) with check(public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
drop policy if exists notification_deliveries_staff_delete on public.notification_deliveries;
create policy notification_deliveries_staff_delete on public.notification_deliveries for delete to authenticated using(public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));

create or replace function public.admin_promote_waitlist(p_program_id uuid)
returns table(registration_id uuid,user_id uuid,waitlist_position integer)
language plpgsql security definer set search_path=public,pg_temp
as $$
declare v_capacity integer; v_confirmed integer; v_item public.waitlist_entries%rowtype;
begin
 if auth.uid() is null then raise exception 'authentication_required'; end if;
 if not public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]) then raise exception 'forbidden'; end if;
 select capacity into v_capacity from public.programs where id=p_program_id for update;
 if not found then raise exception 'program_not_found'; end if;
 if v_capacity is null then raise exception 'unlimited_capacity'; end if;
 select count(*)::integer into v_confirmed from public.registrations where program_id=p_program_id and status='confirmed';
 if v_confirmed>=v_capacity then raise exception 'capacity_full'; end if;
 select w.* into v_item from public.waitlist_entries w join public.registrations r on r.id=w.registration_id where w.program_id=p_program_id and w.promoted_at is null and r.status='waitlisted' order by w.position asc,w.joined_at asc for update of w,r skip locked limit 1;
 if not found then raise exception 'waitlist_empty'; end if;
 update public.registrations set status='confirmed' where id=v_item.registration_id;
 update public.waitlist_entries set promoted_at=now() where id=v_item.id;
 return query select v_item.registration_id,v_item.user_id,v_item.position;
end; $$;
revoke all on function public.admin_promote_waitlist(uuid) from public,anon;
grant execute on function public.admin_promote_waitlist(uuid) to authenticated;

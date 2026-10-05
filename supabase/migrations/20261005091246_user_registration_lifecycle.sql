create or replace function private.cancel_my_program_registration(p_program_id uuid)
returns public.registrations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_row public.registrations%rowtype;
  v_capacity integer;
  v_confirmed integer;
  v_next public.waitlist_entries%rowtype;
begin
  if v_user is null then raise exception 'authentication_required'; end if;

  update public.registrations
     set status = 'cancelled', updated_at = now()
   where program_id = p_program_id
     and user_id = v_user
     and status in ('pending','confirmed','waitlisted')
   returning * into v_row;

  if not found then raise exception 'registration_not_found'; end if;

  delete from public.waitlist_entries where registration_id = v_row.id;

  select capacity into v_capacity from public.programs where id = p_program_id;
  select count(*)::integer into v_confirmed
    from public.registrations
   where program_id = p_program_id and status = 'confirmed';

  if v_capacity is not null and v_confirmed < v_capacity then
    select w.* into v_next
      from public.waitlist_entries w
      join public.registrations r on r.id = w.registration_id
     where w.program_id = p_program_id
       and w.promoted_at is null
       and r.status = 'waitlisted'
     order by w.position asc, w.joined_at asc
     for update of w, r skip locked
     limit 1;

    if found then
      update public.registrations set status='confirmed', updated_at=now() where id=v_next.registration_id;
      update public.waitlist_entries set promoted_at=now() where id=v_next.id;
      insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata)
      values(v_next.user_id,'program_waitlist_promoted','program','program',p_program_id,
             jsonb_build_object('registration_id',v_next.registration_id,'trigger','self_cancellation'));
    end if;
  end if;

  insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata)
  values(v_user,'program_registration_cancelled','registration','program',p_program_id,
         jsonb_build_object('registration_id',v_row.id));
  return v_row;
end;
$$;

create or replace function public.cancel_my_program_registration(p_program_id uuid)
returns public.registrations
language sql
set search_path = public, pg_temp
as $$ select private.cancel_my_program_registration(p_program_id); $$;

create or replace function private.cancel_my_event_registration(p_event_id uuid)
returns public.event_registrations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_row public.event_registrations%rowtype;
  v_capacity integer;
  v_confirmed integer;
  v_next public.event_registrations%rowtype;
begin
  if v_user is null then raise exception 'authentication_required'; end if;

  update public.event_registrations
     set status = 'cancelled', updated_at = now()
   where event_id = p_event_id
     and user_id = v_user
     and status in ('pending','confirmed','waitlisted')
   returning * into v_row;

  if not found then raise exception 'registration_not_found'; end if;

  select capacity into v_capacity from public.events where id = p_event_id;
  select count(*)::integer into v_confirmed
    from public.event_registrations
   where event_id = p_event_id and status = 'confirmed';

  if v_capacity is not null and v_confirmed < v_capacity then
    select * into v_next
      from public.event_registrations
     where event_id = p_event_id and status = 'waitlisted'
     order by registered_at asc, id asc
     for update skip locked
     limit 1;

    if found then
      update public.event_registrations set status='confirmed', updated_at=now() where id=v_next.id;
      insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata)
      values(v_next.user_id,'event_waitlist_promoted','event','event',p_event_id,
             jsonb_build_object('registration_id',v_next.id,'trigger','self_cancellation'));
    end if;
  end if;

  insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata)
  values(v_user,'event_registration_cancelled','registration','event',p_event_id,
         jsonb_build_object('registration_id',v_row.id));
  return v_row;
end;
$$;

create or replace function public.cancel_my_event_registration(p_event_id uuid)
returns public.event_registrations
language sql
set search_path = public, pg_temp
as $$ select private.cancel_my_event_registration(p_event_id); $$;

revoke execute on function public.cancel_my_program_registration(uuid) from public, anon;
grant execute on function public.cancel_my_program_registration(uuid) to authenticated;

revoke execute on function public.cancel_my_event_registration(uuid) from public, anon;
grant execute on function public.cancel_my_event_registration(uuid) to authenticated;

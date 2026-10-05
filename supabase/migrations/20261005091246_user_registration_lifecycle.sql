create or replace function private.cancel_my_program_registration(p_program_id uuid)
returns public.registrations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_row public.registrations%rowtype;
begin
  if v_user is null then raise exception 'authentication_required'; end if;

  update public.registrations
     set status = 'cancelled',
         updated_at = now()
   where program_id = p_program_id
     and user_id = v_user
     and status in ('pending','confirmed','waitlisted')
   returning * into v_row;

  if not found then raise exception 'registration_not_found'; end if;

  delete from public.waitlist_entries where registration_id = v_row.id;

  insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata)
  values(v_user,'program_registration_cancelled','registration','program',p_program_id,jsonb_build_object('registration_id',v_row.id));

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
begin
  if v_user is null then raise exception 'authentication_required'; end if;

  update public.event_registrations
     set status = 'cancelled',
         updated_at = now()
   where event_id = p_event_id
     and user_id = v_user
     and status in ('pending','confirmed','waitlisted')
   returning * into v_row;

  if not found then raise exception 'registration_not_found'; end if;

  insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata)
  values(v_user,'event_registration_cancelled','registration','event',p_event_id,jsonb_build_object('registration_id',v_row.id));

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

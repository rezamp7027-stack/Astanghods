create or replace function private.admin_promote_event_waitlist(p_event_id uuid)
returns public.event_registrations
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user uuid := auth.uid();
  v_capacity integer;
  v_confirmed integer;
  v_row public.event_registrations%rowtype;
begin
  if v_user is null then raise exception 'authentication_required'; end if;
  if not public.has_any_role(array['super_admin','program_manager','crm_manager']::public.app_role[]) then
    raise exception 'forbidden';
  end if;
  select capacity into v_capacity from public.events where id = p_event_id for update;
  if not found then raise exception 'event_not_found'; end if;
  if v_capacity is null then raise exception 'unlimited_capacity'; end if;
  select count(*)::integer into v_confirmed
  from public.event_registrations
  where event_id = p_event_id and status = 'confirmed';
  if v_confirmed >= v_capacity then raise exception 'capacity_full'; end if;
  select er.* into v_row
  from public.event_registrations er
  where er.event_id = p_event_id and er.status = 'waitlisted'
  order by er.registered_at asc, er.id asc
  for update skip locked limit 1;
  if not found then raise exception 'waitlist_empty'; end if;
  update public.event_registrations
     set status = 'confirmed', updated_at = now()
   where id = v_row.id
   returning * into v_row;
  insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata)
  values(v_row.user_id,'event_waitlist_promoted','event','event',p_event_id,
         jsonb_build_object('registration_id',v_row.id));
  return v_row;
end;
$$;

create or replace function public.admin_promote_event_waitlist(p_event_id uuid)
returns public.event_registrations
language sql
set search_path = public, pg_temp
as $$ select private.admin_promote_event_waitlist(p_event_id); $$;

revoke execute on function public.admin_promote_event_waitlist(uuid) from public, anon;
grant execute on function public.admin_promote_event_waitlist(uuid) to authenticated;

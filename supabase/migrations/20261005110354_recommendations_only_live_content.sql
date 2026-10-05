create or replace function private.refresh_recommendations(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path to 'public','pg_temp'
as $function$
declare
  v_province uuid;
  v_count integer:=0;
begin
  if auth.uid() is null or auth.uid()<>p_user_id then
    raise exception 'forbidden';
  end if;

  select province_id into v_province
  from public.profiles
  where id=p_user_id;

  delete from public.recommendations
  where user_id=p_user_id and status='active';

  insert into public.recommendations(user_id,entity_type,entity_id,score,reason)
  select
    p_user_id,
    'program',
    p.id,
    0.55
      + case when v_province is not null and p.province_id=v_province then 0.35 else 0 end
      + case when p.capacity is null then 0.05 else 0 end,
    case
      when v_province is not null and p.province_id=v_province then 'برنامه‌ای در استان شما'
      else 'برنامه منتشرشده جدید'
    end
  from public.programs p
  where p.status='published'
    and p.is_historical=false
    and (p.registration_close_at is null or p.registration_close_at>=now())
    and not exists(
      select 1
      from public.registrations r
      where r.program_id=p.id
        and r.user_id=p_user_id
        and r.status in('pending','confirmed','waitlisted')
    )
  order by
    0.55
      + case when v_province is not null and p.province_id=v_province then 0.35 else 0 end
      + case when p.capacity is null then 0.05 else 0 end desc,
    p.published_at desc nulls last
  limit 8;

  get diagnostics v_count = row_count;

  insert into public.recommendations(user_id,entity_type,entity_id,score,reason)
  select p_user_id,'course',c.id,0.5,'دوره منتشرشده برای ادامه یادگیری'
  from public.courses c
  where c.is_published=true
    and c.is_historical=false
    and not exists(
      select 1
      from public.enrollments e
      where e.course_id=c.id
        and e.user_id=p_user_id
    )
  order by c.updated_at desc
  limit 4
  on conflict do nothing;

  return v_count;
end;
$function$;

revoke execute on function private.refresh_recommendations(uuid) from public;

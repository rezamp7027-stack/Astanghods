-- Journey trigger automation
create or replace function public.enroll_matching_journeys()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare j record;
begin
 for j in select id from public.journeys where is_active=true and trigger_type='registration' loop
  insert into public.journey_enrollments(journey_id,user_id,current_step,status,next_run_at) values(j.id,NEW.user_id,1,'active',now()) on conflict(journey_id,user_id) do nothing;
 end loop;
 return NEW;
end;$$;
revoke execute on function public.enroll_matching_journeys() from public,anon,authenticated;
drop trigger if exists registration_journey_trigger on public.registrations;
create trigger registration_journey_trigger after insert on public.registrations for each row execute function public.enroll_matching_journeys();

create or replace function public.enroll_completion_journeys()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare j record;
begin
 if TG_OP='INSERT' or (coalesce(OLD.status,'')<>'completed' and NEW.status='completed') then
  for j in select id from public.journeys where is_active=true and trigger_type='completion' loop
   insert into public.journey_enrollments(journey_id,user_id,current_step,status,next_run_at) values(j.id,NEW.user_id,1,'active',now()) on conflict(journey_id,user_id) do nothing;
  end loop;
 end if;
 return NEW;
end;$$;
revoke execute on function public.enroll_completion_journeys() from public,anon,authenticated;
drop trigger if exists completion_journey_trigger on public.registrations;
create trigger completion_journey_trigger after update on public.registrations for each row execute function public.enroll_completion_journeys();
create index if not exists journey_enrollments_due_idx on public.journey_enrollments(status,next_run_at,journey_id);
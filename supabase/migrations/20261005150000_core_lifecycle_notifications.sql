-- Reproducible lifecycle notification triggers
create or replace function public.notify_on_event_registration()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_event text;
begin
 select title into v_event from public.events where id=NEW.event_id;
 perform private.queue_user_notification(NEW.user_id,'ثبت‌نام رویداد',coalesce(v_event,'رویداد')||' با وضعیت '||NEW.status||' ثبت شد.','event_registration');
 return NEW;
end;$$;
revoke execute on function public.notify_on_event_registration() from public,anon,authenticated;
drop trigger if exists event_registration_notification_trigger on public.event_registrations;
create trigger event_registration_notification_trigger after insert on public.event_registrations for each row execute function public.notify_on_event_registration();

create or replace function public.notify_on_enrollment()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_course text;
begin
 select title into v_course from public.courses where id=NEW.course_id;
 if TG_OP='INSERT' then perform private.queue_user_notification(NEW.user_id,'شروع یادگیری',coalesce(v_course,'دوره')||' به مسیر یادگیری شما اضافه شد.','course_enrollment'); end if;
 return NEW;
end;$$;
revoke execute on function public.notify_on_enrollment() from public,anon,authenticated;
drop trigger if exists course_enrollment_notification_trigger on public.enrollments;
create trigger course_enrollment_notification_trigger after insert on public.enrollments for each row execute function public.notify_on_enrollment();

create or replace function public.notify_on_certificate()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 perform private.queue_user_notification(NEW.user_id,'گواهی شما صادر شد','گواهی «'||NEW.title||'» با شماره '||NEW.certificate_number||' صادر شد.','certificate');
 return NEW;
end;$$;
revoke execute on function public.notify_on_certificate() from public,anon,authenticated;
drop trigger if exists certificate_notification_trigger on public.certificates;
create trigger certificate_notification_trigger after insert on public.certificates for each row execute function public.notify_on_certificate();
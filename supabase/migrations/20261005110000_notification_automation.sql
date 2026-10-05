create or replace function private.queue_user_notification(p_user_id uuid,p_title text,p_body text,p_type text default 'system')
returns uuid language plpgsql security definer set search_path=public,pg_temp as $$
declare v_notification uuid;v_prefs public.notification_preferences%rowtype;
begin
 insert into public.notifications(user_id,title,body,notification_type) values(p_user_id,p_title,p_body,p_type) returning id into v_notification;
 select * into v_prefs from public.notification_preferences where user_id=p_user_id;
 if coalesce(v_prefs.in_app,true) then insert into public.notification_deliveries(notification_id,channel) values(v_notification,'in_app') on conflict do nothing;end if;
 if coalesce(v_prefs.email,false) then insert into public.notification_deliveries(notification_id,channel) values(v_notification,'email') on conflict do nothing;end if;
 if coalesce(v_prefs.sms,false) then insert into public.notification_deliveries(notification_id,channel) values(v_notification,'sms') on conflict do nothing;end if;
 if coalesce(v_prefs.push,false) then insert into public.notification_deliveries(notification_id,channel) values(v_notification,'push') on conflict do nothing;end if;
 return v_notification;
end;$$;
revoke all on function private.queue_user_notification(uuid,text,text,text) from public,anon,authenticated;

create or replace function public.notify_on_registration()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_title text;v_status text:=case when NEW.status='waitlisted' then 'صف انتظار' else 'تأیید شده' end;v_program text;
begin
 select title into v_program from public.programs where id=NEW.program_id;
 v_title='ثبت‌نام برنامه';
 perform private.queue_user_notification(NEW.user_id,v_title,coalesce(v_program,'برنامه')||' با وضعیت '||v_status||' ثبت شد.','registration');
 return NEW;
end;$$;
revoke execute on function public.notify_on_registration() from public,anon,authenticated;
drop trigger if exists registration_notification_trigger on public.registrations;
create trigger registration_notification_trigger after insert on public.registrations for each row execute function public.notify_on_registration();
-- Engagement automation, recommendation refresh and growth rewards
create or replace function private.refresh_recommendations(p_user_id uuid)
returns integer language plpgsql security definer set search_path=public,pg_temp as $$
declare v_province uuid; v_count integer:=0;
begin
 if auth.uid() is null or auth.uid()<>p_user_id then raise exception 'forbidden'; end if;
 select province_id into v_province from public.profiles where id=p_user_id;
 delete from public.recommendations where user_id=p_user_id and status='active';
 insert into public.recommendations(user_id,entity_type,entity_id,score,reason)
 select p_user_id,'program',p.id,0.55+case when v_province is not null and p.province_id=v_province then 0.35 else 0 end+case when p.capacity is null then 0.05 else 0 end,
   case when v_province is not null and p.province_id=v_province then 'برنامه‌ای در استان شما' else 'برنامه منتشرشده جدید' end
 from public.programs p
 where p.status='published' and (p.registration_close_at is null or p.registration_close_at>=now())
   and not exists(select 1 from public.registrations r where r.program_id=p.id and r.user_id=p_user_id and r.status in('pending','confirmed','waitlisted'))
 order by 0.55+case when v_province is not null and p.province_id=v_province then 0.35 else 0 end desc,p.published_at desc nulls last limit 8;
 get diagnostics v_count=row_count;
 insert into public.recommendations(user_id,entity_type,entity_id,score,reason)
 select p_user_id,'course',c.id,0.5,'دوره منتشرشده برای ادامه یادگیری'
 from public.courses c where c.is_published=true and not exists(select 1 from public.enrollments e where e.course_id=c.id and e.user_id=p_user_id)
 order by c.updated_at desc limit 4 on conflict do nothing;
 return v_count;
end; $$;
revoke all on function private.refresh_recommendations(uuid) from public,anon,authenticated;
drop function if exists public.refresh_my_recommendations();
create or replace function public.refresh_my_recommendations() returns integer language sql security invoker set search_path=public,pg_temp as $$ select private.refresh_recommendations(auth.uid()); $$;
revoke all on function public.refresh_my_recommendations() from public,anon;grant execute on function public.refresh_my_recommendations() to authenticated;

create or replace function public.reward_on_registration() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 insert into public.gamification_points(user_id,total_points,level) values(NEW.user_id,10,1) on conflict(user_id) do update set total_points=greatest(0,public.gamification_points.total_points+10),level=greatest(1,floor(greatest(0,public.gamification_points.total_points+10)/100)+1),updated_at=now();
 insert into public.gamification_events(user_id,points,reason,entity_type,entity_id) values(NEW.user_id,10,'ثبت‌نام در برنامه','program',NEW.program_id);
 insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata) values(NEW.user_id,'program_registered','registration','program',NEW.program_id,jsonb_build_object('registration_id',NEW.id));
 return NEW;
end; $$;
drop trigger if exists registrations_reward_trigger on public.registrations;create trigger registrations_reward_trigger after insert on public.registrations for each row execute function public.reward_on_registration();
revoke execute on function public.reward_on_registration() from public,anon,authenticated;

create or replace function public.reward_on_lesson_completion() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare v_course uuid;
begin
 if coalesce(OLD.progress_percent,0)<100 and NEW.progress_percent>=100 then
  select cm.course_id into v_course from public.lessons l join public.course_modules cm on cm.id=l.module_id where l.id=NEW.lesson_id;
  insert into public.gamification_points(user_id,total_points,level) values(NEW.user_id,20,1) on conflict(user_id) do update set total_points=greatest(0,public.gamification_points.total_points+20),level=greatest(1,floor(greatest(0,public.gamification_points.total_points+20)/100)+1),updated_at=now();
  insert into public.gamification_events(user_id,points,reason,entity_type,entity_id) values(NEW.user_id,20,'تکمیل درس','lesson',NEW.lesson_id);
  insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata) values(NEW.user_id,'lesson_completed','lms','course',v_course,jsonb_build_object('lesson_id',NEW.lesson_id));
 end if; return NEW;
end; $$;
drop trigger if exists lesson_completion_reward_trigger on public.lesson_progress;create trigger lesson_completion_reward_trigger after insert or update on public.lesson_progress for each row execute function public.reward_on_lesson_completion();
revoke execute on function public.reward_on_lesson_completion() from public,anon,authenticated;

create or replace function public.reward_on_certificate() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
 insert into public.gamification_points(user_id,total_points,level) values(NEW.user_id,30,1) on conflict(user_id) do update set total_points=greatest(0,public.gamification_points.total_points+30),level=greatest(1,floor(greatest(0,public.gamification_points.total_points+30)/100)+1),updated_at=now();
 insert into public.gamification_events(user_id,points,reason,entity_type,entity_id) values(NEW.user_id,30,'دریافت گواهی','certificate',NEW.id);
 insert into public.engagement_events(user_id,event_type,source,entity_type,entity_id,metadata) values(NEW.user_id,'certificate_issued','certificate','certificate',NEW.id,jsonb_build_object('certificate_number',NEW.certificate_number));
 return NEW;
end; $$;
drop trigger if exists certificate_reward_trigger on public.certificates;create trigger certificate_reward_trigger after insert on public.certificates for each row execute function public.reward_on_certificate();
revoke execute on function public.reward_on_certificate() from public,anon,authenticated;

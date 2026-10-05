-- Reproducible admin role management and support requests
drop policy if exists user_roles_staff_read on public.user_roles;
create policy user_roles_staff_read on public.user_roles for select to authenticated using(public.has_any_role(array['super_admin','auditor']::public.app_role[]));
create or replace function private.admin_set_user_role(p_user_id uuid,p_role public.app_role,p_enabled boolean)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare v_actor uuid:=auth.uid();v_role_id uuid;v_count integer;
begin
 if v_actor is null then raise exception 'authentication_required';end if;
 if not public.has_role('super_admin'::public.app_role) then raise exception 'forbidden';end if;
 if not exists(select 1 from auth.users where id=p_user_id) then raise exception 'user_not_found';end if;
 select id into v_role_id from public.roles where slug=p_role;if not found then raise exception 'role_not_found';end if;
 if p_enabled then
  insert into public.user_roles(user_id,role_id,assigned_by) values(p_user_id,v_role_id,v_actor) on conflict do nothing;
 else
  if p_role='super_admin'::public.app_role then
   select count(*) into v_count from public.user_roles ur join public.roles r on r.id=ur.role_id where r.slug='super_admin'::public.app_role;
   if v_count<=1 then raise exception 'cannot_remove_last_super_admin';end if;
  end if;
  delete from public.user_roles where user_id=p_user_id and role_id=v_role_id;
 end if;
 insert into public.audit_logs(actor_user_id,action,entity_type,entity_id,metadata) values(v_actor,'user_role.change','user_role',p_user_id,jsonb_build_object('role',p_role::text,'enabled',p_enabled));
 return true;
end;$$;
revoke all on function private.admin_set_user_role(uuid,public.app_role,boolean) from public,anon,authenticated;
drop function if exists public.admin_set_user_role(uuid,public.app_role,boolean);
create or replace function public.admin_set_user_role(p_user_id uuid,p_role public.app_role,p_enabled boolean)
returns boolean language sql security invoker set search_path=public,pg_temp as $$ select private.admin_set_user_role(p_user_id,p_role,p_enabled); $$;
revoke all on function public.admin_set_user_role(uuid,public.app_role,boolean) from public,anon;
grant execute on function public.admin_set_user_role(uuid,public.app_role,boolean) to authenticated;

create table if not exists public.support_requests (
 id uuid primary key default gen_random_uuid(),user_id uuid not null references auth.users(id) on delete cascade,
 category text not null default 'general',subject text not null,body text not null,
 status text not null default 'open' check(status in('open','in_progress','resolved','closed')),
 priority text not null default 'normal' check(priority in('low','normal','high','urgent')),
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),resolved_at timestamptz
);
create index if not exists support_requests_user_idx on public.support_requests(user_id,created_at desc);
create index if not exists support_requests_status_idx on public.support_requests(status,priority,created_at desc);
alter table public.support_requests enable row level security;
grant select,insert,update on public.support_requests to authenticated;
drop policy if exists support_requests_self_read on public.support_requests;
create policy support_requests_self_read on public.support_requests for select to authenticated using(user_id=(select auth.uid()));
drop policy if exists support_requests_self_insert on public.support_requests;
create policy support_requests_self_insert on public.support_requests for insert to authenticated with check(user_id=(select auth.uid()));
drop policy if exists support_requests_staff on public.support_requests;
create policy support_requests_staff on public.support_requests for all to authenticated using(public.has_any_role(array['super_admin','crm_manager','auditor']::public.app_role[])) with check(public.has_any_role(array['super_admin','crm_manager']::public.app_role[]));
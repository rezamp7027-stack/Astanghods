-- Astanghods Security Hardening
-- This mirrors the hardening applied to the remote Supabase project.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid())
      and r.slug = required_role
  );
$$;

create or replace function public.has_any_role(required_roles public.app_role[])
returns boolean
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid())
      and r.slug = any(required_roles)
  );
$$;

create or replace function public.register_for_program(p_program_id uuid)
returns table(
  registration_id uuid,
  registration_status public.registration_status,
  waitlist_position integer
)
language sql
security invoker
set search_path = public, pg_temp
as $$
  select * from private.register_for_program(p_program_id);
$$;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.has_role(public.app_role) from public, anon;
revoke execute on function public.has_any_role(public.app_role[]) from public, anon;
grant execute on function public.has_role(public.app_role) to authenticated;
grant execute on function public.has_any_role(public.app_role[]) to authenticated;

drop policy if exists organizations_read_public on public.organizations;
create policy organizations_member_read on public.organizations
  for select to authenticated
  using (
    public.has_any_role(
      array['super_admin','regional_manager']::public.app_role[]
    )
    or exists (
      select 1
      from public.organization_members om
      where om.organization_id = id
        and om.user_id = (select auth.uid())
        and om.is_active = true
    )
  );

create table if not exists public.rate_limits(key text primary key,window_start timestamptz not null default now(),request_count integer not null default 0);
alter table public.rate_limits enable row level security;
revoke all on public.rate_limits from anon,authenticated;
create or replace function private.consume_rate_limit(p_key text,p_limit integer,p_window_seconds integer)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare row public.rate_limits%rowtype;now_ts timestamptz:=clock_timestamp();
begin perform pg_advisory_xact_lock(hashtext(p_key));select * into row from public.rate_limits where key=p_key for update;
if not found then insert into public.rate_limits(key,window_start,request_count)values(p_key,now_ts,1);return true;end if;
if row.window_start+make_interval(secs=>p_window_seconds)<=now_ts then update public.rate_limits set window_start=now_ts,request_count=1 where key=p_key;return true;end if;
if row.request_count>=p_limit then return false;end if;
update public.rate_limits set request_count=request_count+1 where key=p_key;return true;end$$;
create or replace function public.consume_rate_limit(p_key text,p_limit integer default 20,p_window_seconds integer default 60)
returns boolean language sql security invoker set search_path=public,private as $$select private.consume_rate_limit(p_key,p_limit,p_window_seconds)$$;
revoke all on function private.consume_rate_limit(text,integer,integer) from public,anon,authenticated;revoke all on function public.consume_rate_limit(text,integer,integer) from public;grant execute on function public.consume_rate_limit(text,integer,integer) to anon,authenticated;
-- Run on the existing Raat Baaki database after the original setup SQL.
-- Existing registrations are preserved. Guest Auth accounts are no longer required.
begin;
alter table public.raat_guests alter column user_id drop not null;
alter table public.raat_guests add column if not exists paid boolean not null default false;
alter table public.raat_guests add column if not exists entry_code text;
create unique index if not exists raat_guest_entry_code_unique on public.raat_guests(entry_code);
-- Keep all guest data private; public submissions go through the validated server API.
alter table public.raat_guests enable row level security;
revoke all on public.raat_guests from anon, authenticated;
grant all on public.raat_guests to service_role;

create or replace function public.raat_check_in(pass_token text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare guest public.raat_guests;
begin
 update public.raat_guests set checked_in_at = now()
 where (qr_token = pass_token or entry_code = upper(pass_token))
 and status = 'approved' and paid = true and checked_in_at is null
 returning * into guest;
 if found then
  return jsonb_build_object('accepted',true,'name',guest.full_name,'entry_code',guest.entry_code,'checked_in_at',guest.checked_in_at);
 end if;
 select * into guest from public.raat_guests
 where qr_token = pass_token or entry_code = upper(pass_token);
 if not found then return jsonb_build_object('accepted',false,'reason','Invalid entry code'); end if;
 if guest.status <> 'approved' then return jsonb_build_object('accepted',false,'reason','Entry code is inactive'); end if;
 if guest.checked_in_at is not null then return jsonb_build_object('accepted',false,'reason','Already entered','name',guest.full_name,'checked_in_at',guest.checked_in_at); end if;
 if not guest.paid then return jsonb_build_object('accepted',false,'reason','Payment not marked paid','name',guest.full_name); end if;
 return jsonb_build_object('accepted',false,'reason','Entry denied');
end $$;
revoke all on function public.raat_check_in(text) from public, anon, authenticated;
grant execute on function public.raat_check_in(text) to service_role;
commit;

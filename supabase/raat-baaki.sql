-- Run once in Supabase SQL Editor. Separate tables preserve old ticket records.
begin;
create table if not exists public.raat_settings (
 id integer primary key check (id = 1), title text not null, ticket_name text not null,
 price integer not null check (price >= 0), venue text not null,
 event_date text not null, event_time text not null, description text not null,
 booking_open boolean not null default false
);
insert into public.raat_settings values
(1, 'Raat Baaki', 'Poolside Pass', 0, 'TBR', '21 November 2026', '5 PM onwards',
 'An evening of festive lights, poolside conversations and music. Payment is arranged manually with STATIC.', false)
on conflict (id) do nothing;
create table if not exists public.raat_guests (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id),
 full_name text not null, phone text not null, instagram text not null,
 drink text not null check (drink in ('alcoholic','non-alcoholic')),
 smoking text not null check (smoking in ('yes','no')),
 relationship text not null check (relationship in ('single','mingle','prefer-not-to-say')),
 approachable text not null check (approachable in ('yes','no')),
 referral text not null, photo_paths text[] not null check (cardinality(photo_paths) = 2),
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 amount integer not null check (amount >= 0), qr_token text unique,
 checked_in_at timestamptz, created_at timestamptz not null default now(),
 unique(user_id), check (status <> 'approved' or qr_token is not null)
);
alter table public.raat_settings enable row level security;
alter table public.raat_guests enable row level security;
-- No direct browser table access. The API verifies the caller and performs scoped operations.
revoke all on public.raat_settings, public.raat_guests from anon, authenticated;
grant all on public.raat_settings, public.raat_guests to service_role;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('raat-guest-photos','raat-guest-photos',false,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- One atomic update: simultaneous scans cannot both admit the same pass.
create or replace function public.raat_check_in(pass_token text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare guest public.raat_guests;
begin
 update public.raat_guests set checked_in_at = now()
 where qr_token = pass_token and status = 'approved' and checked_in_at is null
 returning * into guest;
 if found then
  return jsonb_build_object('accepted', true, 'name', guest.full_name, 'checked_in_at', guest.checked_in_at);
 end if;
 select * into guest from public.raat_guests where qr_token = pass_token;
 if not found then return jsonb_build_object('accepted',false,'reason','Invalid pass'); end if;
 if guest.status <> 'approved' then return jsonb_build_object('accepted',false,'reason','Pass is not approved'); end if;
 return jsonb_build_object('accepted',false,'reason','Already checked in','name',guest.full_name,'checked_in_at',guest.checked_in_at);
end $$;
revoke all on function public.raat_check_in(text) from public, anon, authenticated;
grant execute on function public.raat_check_in(text) to service_role;
commit;

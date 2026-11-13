-- Emberfall's accounts and cloud saves (development plan §2.2; architecture A7: Supabase, guest-first).
-- Run once in a new project: the Supabase dashboard's SQL Editor, or `supabase db push` (docs/online-setup.md).
--
-- Every player is a Supabase auth user: a guest is an anonymous one, made at the first sign-in; linking Apple, Google
-- or an email code upgrades that same user, so the id (and the heroes under it) never changes. Row Level Security is
-- on for every table: a player reads and writes only their own rows, through the public anon key. The service-role key
-- (the validator's, later: development plan §2.13) is the only thing that may mark a save verified, and it never
-- ships in the game.

-- ── profiles: one a player ────────────────────────────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  -- the name others see, with its tag (Brann#4821): the game's name rule (sim/names.js) is checked in the client;
  -- here, its shape (letters, spaces and hyphens, 1-16) and that a name and tag are one player's
  display_name text not null default 'Guest'
    check (char_length(display_name) between 1 and 16 and display_name ~ '^[A-Za-zÀ-ÖØ-öø-ɏ -]+$'),
  tag smallint not null check (tag between 1000 and 9999),
  -- the device's local profile this player started from (net/profile.js), so a second device can tell it's them
  device_profile uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- "unique within a suffix" (development plan §2.2): two Branns, never two Brann#4821s. The tag starts as the device
  -- profile's; on a clash the client draws another and tries again (net/supabase.js)
  unique (display_name, tag)
);
alter table public.profiles enable row level security;
create policy "a player reads their own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "a player makes their own profile" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy "a player changes their own profile" on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- ── saves: one a game slot ────────────────────────────────────────────────────────────────────────────────────────
-- The sim's snapshot as the game keeps it (persist/save.js: version, meta, data). Until the validator replays sessions
-- (§2.13) a cloud save is a backup of the device's, never verified; a client may not say otherwise.
create table public.saves (
  user_id uuid not null references auth.users (id) on delete cascade,
  slot smallint not null check (slot between 1 and 3),
  version integer not null check (version > 0),
  meta jsonb not null default '{}'::jsonb,
  data jsonb not null check (pg_column_size(data) < 262144),
  verified boolean not null default false,
  saved_at timestamptz not null default now(),
  primary key (user_id, slot)
);
alter table public.saves enable row level security;
create policy "a player reads their own saves" on public.saves for select to authenticated using (user_id = (select auth.uid()));
create policy "a player stores their own saves, unverified" on public.saves for insert to authenticated
  with check (user_id = (select auth.uid()) and verified = false);
create policy "a player replaces their own saves, unverified" on public.saves for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and verified = false);
create policy "a player deletes their own saves" on public.saves for delete to authenticated using (user_id = (select auth.uid()));

-- ── the time a row last changed ───────────────────────────────────────────────────────────────────────────────────
create function public.touch() returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_table_name = 'saves' then new.saved_at := now(); else new.updated_at := now(); end if;
  return new;
end $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch();
create trigger saves_touch before insert or update on public.saves for each row execute function public.touch();

-- ── delete account (a store requirement): the player's auth user, and with it every row above ─────────────────────
create function public.delete_my_account() returns void language sql security definer set search_path = '' as $$
  delete from auth.users where id = (select auth.uid());
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

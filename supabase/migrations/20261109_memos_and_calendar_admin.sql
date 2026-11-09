-- Admin-managed school memos and calendar event overrides.
-- Existing calendar JSON remains the baseline; rows here override records with the same ID.

create table if not exists public.school_memos (
  id uuid primary key default gen_random_uuid(),
  memo_number text not null,
  title text not null,
  date_issued date not null,
  category text not null,
  issuing_office text not null,
  description text not null default '',
  file_path text not null,
  file_url text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists school_memos_publication_idx
  on public.school_memos (status, date_issued desc);

create table if not exists public.school_calendar_events (
  id text primary key,
  title text not null,
  start_date date not null,
  end_date date not null,
  start_time time,
  end_time time,
  category text not null,
  audience text not null,
  event_status text not null check (event_status in ('Confirmed', 'Tentative', 'For Confirmation')),
  location text,
  description text not null default '',
  publication_status text not null default 'draft' check (publication_status in ('draft', 'published', 'archived')),
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint school_calendar_event_date_order check (end_date >= start_date)
);

create index if not exists school_calendar_events_publication_idx
  on public.school_calendar_events (publication_status, start_date);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as 'select exists (select 1 from public.profiles where id = auth.uid() and role in (''admin'', ''super_admin''))';

alter table public.school_memos enable row level security;
alter table public.school_calendar_events enable row level security;

drop policy if exists "Public can read published school memos" on public.school_memos;
create policy "Public can read published school memos"
on public.school_memos for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can manage school memos" on public.school_memos;
create policy "Admins can manage school memos"
on public.school_memos for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read published calendar overrides" on public.school_calendar_events;
create policy "Public can read published calendar overrides"
on public.school_calendar_events for select
to anon, authenticated
using (publication_status = 'published');

drop policy if exists "Admins can manage calendar events" on public.school_calendar_events;
create policy "Admins can manage calendar events"
on public.school_calendar_events for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('school-memos', 'school-memos', true, 15728640, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

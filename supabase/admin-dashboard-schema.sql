-- Tabunoc NHS custom admin dashboard foundation.
-- Run in Supabase SQL editor, then create admin users through Supabase Auth.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'staff',
  full_name text,
  email text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.homepage_highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  caption text,
  image_url text,
  category text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  is_published boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.community_questions (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact text,
  question text not null,
  category text,
  status text not null default 'pending',
  admin_answer text,
  is_public boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.map_locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  latitude double precision,
  longitude double precision,
  x double precision,
  y double precision,
  type text,
  is_published boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.map_routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  route_data jsonb not null default '{}'::jsonb,
  description text,
  is_published boolean not null default false,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'super_admin')
  );
$$;

alter table public.profiles enable row level security;
alter table public.homepage_highlights enable row level security;
alter table public.faq_items enable row level security;
alter table public.community_questions enable row level security;
alter table public.map_locations enable row level security;
alter table public.map_routes enable row level security;

create policy "Admins can manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Public can read published highlights"
on public.homepage_highlights for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage highlights"
on public.homepage_highlights for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published FAQs"
on public.faq_items for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage FAQs"
on public.faq_items for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Anyone can submit community questions"
on public.community_questions for insert
to anon, authenticated
with check (true);

create policy "Public can read public answered questions"
on public.community_questions for select
to anon, authenticated
using (is_public = true and status = 'answered');

create policy "Admins can manage community questions"
on public.community_questions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published map locations"
on public.map_locations for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage map locations"
on public.map_locations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Public can read published map routes"
on public.map_routes for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage map routes"
on public.map_routes for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

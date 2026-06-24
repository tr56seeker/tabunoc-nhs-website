# Homepage highlights setup

Run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.homepage_highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  image_path text not null,
  image_url text not null,
  alt_text text,
  facebook_url text,
  status text not null default 'draft',
  display_order integer default 0,
  event_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

alter table public.homepage_highlights enable row level security;
```

For an existing `homepage_highlights` table, run this migration:

```sql
alter table public.homepage_highlights
add column if not exists facebook_url text;
```

Create a Supabase Storage bucket named `homepage-highlights`.

Recommended bucket setting:

- Use a public bucket so published images can display on the homepage.
- Handle uploads only through the server-side admin API routes. Do not give browser clients upload access or expose the service role key.

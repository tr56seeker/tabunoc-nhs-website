alter table public.faq_community_questions
add column if not exists reviewed_at timestamptz,
add column if not exists reviewed_by text,
add column if not exists moderation_note text;

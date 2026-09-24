-- 007_games_scores.sql
-- Memory Quiz, Shape Draw, Memory Journey, regional games.
-- The PWA always stores a local copy; these rows are the care-team overlay.

create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.profiles(id) on delete cascade,
  game_id text not null,
  title text,
  score numeric,
  extra jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

comment on table public.game_sessions is 'One row per finished game. game_id examples: memory-quiz, shape-draw, memory-journey.';
comment on column public.game_sessions.extra is 'Quiz percentage, latency, city, language, etc.';

create table if not exists public.quiz_latest (
  patient_id uuid primary key references public.profiles(id) on delete cascade,
  session_id uuid references public.game_sessions(id) on delete set null,
  percentage numeric,
  score numeric,
  total_questions integer,
  language text,
  updated_at timestamptz not null default now()
);

comment on table public.quiz_latest is 'Fast path for dashboard + doctor roster (latest Memory Quiz only).';

create or replace function public.touch_quiz_latest()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.game_id in ('memory-quiz', 'quiz', 'memory_quiz') and new.patient_id is not null then
    insert into public.quiz_latest (
      patient_id, session_id, percentage, score, total_questions, language, updated_at
    )
    values (
      new.patient_id,
      new.id,
      coalesce((new.extra->>'percentage')::numeric, new.score),
      new.score,
      nullif(new.extra->>'totalQuestions', '')::integer,
      new.extra->>'language',
      now()
    )
    on conflict (patient_id) do update set
      session_id = excluded.session_id,
      percentage = excluded.percentage,
      score = excluded.score,
      total_questions = excluded.total_questions,
      language = excluded.language,
      updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists game_sessions_quiz_latest on public.game_sessions;
create trigger game_sessions_quiz_latest
after insert on public.game_sessions
for each row execute function public.touch_quiz_latest();

export const SUPABASE_SQL_SETUP = `-- ==============================================================
-- CloudReady — AZ-900 Exam Prep Database Schema & RLS Policies
-- Execute this script in the Supabase SQL Editor
-- ==============================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Create Study Progress Table
CREATE TABLE IF NOT EXISTS public.study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  questions_correct INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_topic UNIQUE (user_id, topic_id),
  CONSTRAINT positive_answered CHECK (questions_answered >= 0),
  CONSTRAINT valid_correct_count CHECK (questions_correct >= 0 AND questions_correct <= questions_answered)
);

-- Enable RLS on study_progress
ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

-- Study Progress Policies (Strict Per-User Isolation)
CREATE POLICY "Users can view their own study progress"
  ON public.study_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own study progress"
  ON public.study_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study progress"
  ON public.study_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3. Create Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id TEXT NOT NULL,
  topic_title TEXT,
  total_questions INTEGER NOT NULL CHECK (total_questions > 0),
  correct_answers INTEGER NOT NULL,
  accuracy NUMERIC(5, 2) NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT valid_score CHECK (correct_answers >= 0 AND correct_answers <= total_questions)
);

-- Enable RLS on quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quiz Attempts Policies
CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4. Create Study Plans Table
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  hours_per_week INTEGER NOT NULL DEFAULT 6,
  learner_level TEXT NOT NULL DEFAULT 'beginner',
  completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_plan UNIQUE (user_id)
);

ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study plan"
  ON public.study_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own study plan"
  ON public.study_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own study plan"
  ON public.study_plans FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. Create Flashcard Reviews Table (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.flashcard_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('mastered', 'needs_review')),
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_card UNIQUE (user_id, card_id)
);

ALTER TABLE public.flashcard_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own flashcard reviews"
  ON public.flashcard_reviews FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own flashcard reviews"
  ON public.flashcard_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own flashcard reviews"
  ON public.flashcard_reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. Trigger for Auto-Creating Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, created_at, updated_at)
  VALUES (new.id, split_part(new.email, '@', 1), now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
`;

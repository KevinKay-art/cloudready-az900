# CloudReady — AZ-900 Exam Preparation Companion

> **"Building Smarter Exam Prep Tools from Our Own Learning Journey."**  
> An educational, community-focused cloud prep companion built for the **Vibe Coding Hackathon**.

🌐 **Live Working Demo**: [CloudReady App on AI Studio](https://ais-pre-ye4dd7vwjri62fa7xkjozg-479005775401.europe-west2.run.app)  
📊 **Presentation Deck (Canva)**: [View Canva Pitch Deck](https://canva.link/j2g6282zhp7pgez)  
💻 **GitHub Repository**: [KevinKay-art/cloudready-az900](https://github.com/KevinKay-art/cloudready-az900)  
🎓 **Exam Target**: Microsoft Certified: Azure Fundamentals (AZ-900)  
🛡️ **Status**: Independent & Unofficial Community Resource

---

## 🎯 Overview

Studying for the Microsoft Azure Fundamentals (AZ-900) certification can be daunting for beginners, self-taught developers, and career changers. Dense technical jargon, subtle distinctions (e.g., Scalability vs. Elasticity, Availability Zones vs. Region Pairs), and walls of documentation often lead to memorization rather than true intuition.

**CloudReady** transforms real study notes and exam preparation hurdles into an interactive, community-driven preparation tool:
- **Learn**: 12 bite-sized syllabus modules featuring plain-English explanations, real-world practical analogies, key term glossaries, and "Common Misconception" trap warnings.
- **Practise**: 36+ original, scenario-based multiple-choice practice questions with single-answer locking, immediate feedback, and in-depth distractor breakdowns explaining *why* wrong options are incorrect.
- **Review**: Dynamic results analytics identifying your weakest domain and pointing directly to targeted revision topics.
- **Integrity**: Full local storage fallback with optional cloud sync to **Supabase** backed by Row Level Security (RLS).

---

## 🚀 Solutions to All 5 Hackathon Challenges

### 1. 📝 Practice & Assessment: Smart Quiz Builder
- **Original Question Bank**: 36+ scenario-based practice questions spread across all 3 AZ-900 domains.
- **4 Options (A, B, C, D)**: Single choice per question with single-answer locking to prevent repeated click scoring.
- **Immediate Feedback**: Instant Correct/Incorrect visual confirmation with simple explanation and distractor analysis explaining *why* wrong options are incorrect.
- **Exam Countdown Timer & Question Grid**: Optional 15, 30, or 45-minute countdown clock and question navigator drawer.
- **Targeted Mistakes Drill**: Automatically extracts missed questions so learners can practice only their past mistakes until 100% mastery.

### 2. 🧠 Memory & Revision: Flashcard Coach
- **Spaced-Repetition Engine**: Interactive 3D flip card coach categorizing concepts into "Mastered" vs. "Still Learning (Repeat Soon)".
- **High-Yield Content**: Covers key acronyms, definitions, and common AZ-900 exam traps.
- **Filter by Difficulty**: Dedicated toggle to filter the deck down strictly to difficult cards that need review.

### 3. 📅 Planning: Personal Study Planner
- **Target Exam Date**: Computes exact days remaining until your exam date.
- **Hours per Week Slider**: Estimates total study hours and generates a structured 4-phase milestone roadmap.
- **Adaptive Prioritization**: Automatically prioritizes the learner's actual lowest-scoring topic into Phase 1 review!
- **Interactive Checklists**: Persisted milestone tasks to track progress leading up to exam day.

### 4. 🤖 Support: AI Study Buddy ("JazaCloud")
- **Everyday African Analogies**: Explains complex cloud architecture with relatable local examples (M-Pesa high availability and elasticity, Matatu fleets as VM Scale Sets, Kariakoo/Gikomba market stalls as IaaS/PaaS/SaaS).
- **Multilingual Support**: Supports English, Kiswahili, Sheng (Nairobi youth slang), and French.
- **Powered by Gemini AI**: Integrates `@google/genai` (`gemini-3.8-flash`) with resilient offline fallback analogies.

### 5. 📊 Progress: Exam Readiness Tracker & Supabase DB
- **Accurate Mathematical Scoring**: Accuracy calculated as `(correct ÷ answered) * 100` with meaningful `"Not enough data"` empty states.
- **Verifiable Readiness Certificate**: Generates a verified completion certificate with credential ID when achieving $\ge 70\%$.
- **Supabase Cloud Sync & RLS**: Real database sync for `profiles`, `study_progress`, `quiz_attempts`, `study_plans`, and `flashcard_reviews` with strict Row Level Security.
- **Self-Check Diagnostic Runner**: Built-in test suite verifying accuracy mathematics, duplicate answer guards, and boundary checks.

---


## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React icons
- **Database / Cloud**: Supabase (`@supabase/supabase-js`) with PostgreSQL and Row Level Security
- **Local Persistence**: Browser `localStorage` API

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js (version 18 or newer)
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/cloudready-az900.git
cd cloudready-az900

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Contents of `.env`:
```env
# Optional: Supabase credentials for cloud persistence
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```
*(If omitted, CloudReady automatically runs seamlessly in Local Browser Storage mode!)*

### 4. Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## 🗄️ Supabase Database Setup & SQL Script

To connect Supabase for cross-device synchronization:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** tab in the Supabase Dashboard.
3. Paste and run the setup script below:

```sql
-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

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

ALTER TABLE public.study_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own study progress"
  ON public.study_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own study progress"
  ON public.study_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own study progress"
  ON public.study_progress FOR UPDATE USING (auth.uid() = user_id);

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

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz attempts"
  ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own quiz attempts"
  ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
```

4. Retrieve your **Project URL** and **anon public key** from `Project Settings > API` and configure them in `.env` or in the **Progress & Database** tab directly within the app!

---

## 🌐 Free-Tier Deployment Options

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework preset: **Vite**.
5. (Optional) Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to Environment Variables.
6. Click **Deploy**.

### Deploying to Netlify
1. Connect your repository on [Netlify](https://netlify.com).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy!

### Deploying to Cloudflare Pages
1. Select **Pages > Connect to Git** in Cloudflare Dashboard.
2. Build preset: `Vite`.
3. Output directory: `dist`.

---

## ⚖️ Responsible Branding & Legal Disclaimer

> **CloudReady is an independent educational project. It is not affiliated with, endorsed by, or an official product of Microsoft. Microsoft Azure and AZ-900 are referenced for educational purposes.**

All questions are original scenario exercises written by community contributors to assist learners preparing for certification.

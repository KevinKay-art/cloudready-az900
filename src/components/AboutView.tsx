import React from 'react';
import {
  Sparkles,
  BookOpen,
  Target,
  Users,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Heart,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface AboutViewProps {
  onStartLearning: () => void;
  onStartQuiz: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartLearning, onStartQuiz }) => {
  const [activeSubTab, setActiveSubTab] = React.useState<'overview' | 'pitch'>('overview');
  const [activeSlide, setActiveSlide] = React.useState<number>(0);

  const PITCH_SLIDES = [
    {
      step: 'Slide 1 / 5',
      badge: '20% Judging Weight · Problem Understanding',
      title: 'The Learner Pain Point: Cloud Jargon & Passive Memorization',
      tagline: '“Studying for AZ-900 felt like memorizing an encyclopedic phonebook without practical intuition.”',
      bullets: [
        'Overwhelming terminology: Beginners struggle to distinguish similar concepts (Scalability vs Elasticity, Availability Zones vs Region Pairs, Authentication vs Authorization).',
        'Passive practice test dumps: Traditional quiz banks give letter scores without explaining WHY wrong answers are wrong or analyzing distractors.',
        'No contextual relevance: Generic cloud examples do not resonate with local African contexts (e.g. M-Pesa, regional payment gateways, power reliability).',
        'Study anxiety & exam unreadiness: Learners do not know when they are truly ready for the $99 exam.',
      ],
      learnerQuote: '“I answered 50 questions online, but I couldn’t explain how an Availability Zone actually works in plain English.”',
    },
    {
      step: 'Slide 2 / 5',
      badge: '25% Judging Weight · Solution & Product Demo',
      title: 'CloudReady: The 5-in-1 Smart Exam Prep Ecosystem',
      tagline: 'Built directly from our learning journey to solve all 5 Hackathon Problem Statements.',
      bullets: [
        '1. 📝 Smart Quiz Builder: 36 original scenario questions with real-time distractor analysis explaining why each wrong option was tempting.',
        '2. 🧠 Flashcard Coach: Spaced-repetition deck with 3D flip animation, focusing strictly on cards flagged as difficult.',
        '3. 📅 Personal Study Planner: Calculates study hours to exam date and dynamically puts weakest topics first.',
        '4. 🤖 AI Study Buddy: JazaCloud assistant explains abstract cloud concepts in Swahili, Sheng, or plain English using matatu & M-Pesa analogies.',
        '5. 📊 Exam Readiness Tracker: Genuine mastery calculation, zero fake metrics, and optional Supabase cloud sync with Row Level Security.',
      ],
      learnerQuote: '“Everything a beginner needs to pass AZ-900 on the first attempt, in one cohesive tool.”',
    },
    {
      step: 'Slide 3 / 5',
      badge: '15% Judging Weight · Target Users',
      title: 'Target Audience: Empowering the Next 1 Million Developers',
      tagline: 'Tailored for beginners, self-taught developers, and career changers across Africa and globally.',
      bullets: [
        'Beginners & University Students: Demystifies cloud fundamentals before starting complex cloud architectures.',
        'Self-Taught Developers & Bootcamp Grads: Bridges the gap between coding apps and deploying them reliably to Azure.',
        'Career Changers: Transitioning into IT/Cloud operations with relatable, plain-language business analogies.',
        'Study Circles & Dev Clubs: Open-source, freely shareable, and adaptable for local university developer clubs.',
      ],
      learnerQuote: '“Lowers the barrier of entry so anyone can understand cloud architecture without prior enterprise IT experience.”',
    },
    {
      step: 'Slide 4 / 5',
      badge: '15% Judging Weight · Technical Creativity & Vibes',
      title: 'Architecture: Rapid Prototyping with Real Engineering Rigor',
      tagline: 'Clean React 19 + TypeScript frontend with zero fake data and enterprise-grade security.',
      bullets: [
        'Deterministic Math: Accuracy and weakest-topic detection follow strict mathematical rules with edge case checks (handled in unit tests).',
        'Real Supabase Database & RLS: Generates copyable SQL schemas with Row Level Security to protect personal study records.',
        'Local-First Offline Fallback: Fully functional in low-connectivity environments with localStorage persistence.',
        'Ethical & Unofficial Branding: 100% original questions, zero copyrighted dumps, and full compliance with Microsoft trademark guidelines.',
      ],
      learnerQuote: '“Built with vibe coding speed, engineered with production code standards.”',
    },
    {
      step: 'Slide 5 / 5',
      badge: '20% Judging Weight · Scalability & Impact',
      title: 'Future Impact: From AZ-900 to Multi-Cloud Certification Mastery',
      tagline: 'The modular blueprint can easily expand to other entry-level certifications.',
      bullets: [
        'AI-900 & DP-900 Expansion: Modular topic/question schema allows adding Azure AI Fundamentals and Data Fundamentals in days.',
        'Multi-Cloud Tracks: Expanding to AWS Certified Cloud Practitioner (CLF-C02) and Google Cloud Digital Leader.',
        'Community Contribution: Enable certified learners to author, review, and vote on new practice scenarios and local analogies.',
        'Direct Certification Impact: Helping 1,000+ developers in our cohort earn their first Microsoft credential in 2026.',
      ],
      learnerQuote: '“Transforming passive consumers of documentation into confident, certified cloud builders.”',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Sub-navigation tabs: Overview vs Pitch Deck */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Project Overview & Non-Affiliation
        </button>
        <button
          onClick={() => setActiveSubTab('pitch')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'pitch'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>🎤 Hackathon Pitch Deck (Judges Guide)</span>
        </button>
      </div>

      {activeSubTab === 'pitch' ? (
        /* Interactive Hackathon Pitch Deck */
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
              <span className="font-mono text-sky-400 font-bold uppercase tracking-wider">
                {PITCH_SLIDES[activeSlide].step}
              </span>
              <span className="bg-sky-950 text-sky-300 border border-sky-800 px-2.5 py-1 rounded-full font-semibold text-[11px]">
                {PITCH_SLIDES[activeSlide].badge}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
              {PITCH_SLIDES[activeSlide].title}
            </h2>
            <p className="text-sm text-sky-200 italic mb-6">
              {PITCH_SLIDES[activeSlide].tagline}
            </p>

            <div className="space-y-3 bg-slate-800/80 p-5 rounded-xl border border-slate-700/80">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Key Pitch Talking Points:
              </div>
              {PITCH_SLIDES[activeSlide].bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3.5 bg-slate-800/40 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-2 italic">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{PITCH_SLIDES[activeSlide].learnerQuote}</span>
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
              <button
                disabled={activeSlide === 0}
                onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 rounded-lg text-white transition-colors cursor-pointer"
              >
                ← Previous Slide
              </button>

              <div className="flex items-center gap-1.5">
                {PITCH_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      activeSlide === idx ? 'bg-sky-400 w-6' : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={activeSlide === PITCH_SLIDES.length - 1}
                onClick={() => setActiveSlide((prev) => Math.min(PITCH_SLIDES.length - 1, prev + 1))}
                className="px-3.5 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:hover:bg-sky-600 rounded-lg text-white transition-colors cursor-pointer"
              >
                Next Slide →
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Overview View */
        <>
          {/* Title & Hackathon Banner */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600">
              <span>Interactive Cloud Study Companion</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              About CloudReady
            </h1>

            <blockquote className="border-l-2 border-sky-500 pl-4 py-1 text-base sm:text-lg font-medium text-slate-700 italic">
              &ldquo;Building Smarter Exam Prep Tools from Our Own Learning Journey.&rdquo;
            </blockquote>

            <p className="text-sm text-slate-600 leading-relaxed">
              CloudReady is an interactive study and exam-preparation web application. It was created out of a simple observation: preparing for cloud certification exams is too often bogged down by dense jargon, confusing walls of text, and rote memorization with no practical analogies.
            </p>
          </section>


      {/* The 4 Core Pillars: Problem, Solution, Learning Value, Community Value */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: The Problem */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>01. The Problem</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Cloud Terminology Overwhelm for Beginners
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Beginners, self-taught developers, and career changers frequently get stuck trying to distinguish between closely related concepts—like Scalability vs. Elasticity, Availability Zones vs. Region Pairs, or Authentication vs. Authorization. Without clear analogies, studying feels abstract and intimidating.
          </p>
        </div>

        {/* Pillar 2: The Solution */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>02. The Solution</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Bite-Sized Analogies & Instant Feedback
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            CloudReady decomposes the official Microsoft Azure Fundamentals syllabus into 12 digestable modules. Each topic provides a plain-English explanation, a real-world everyday scenario, key glossary definitions, a &ldquo;Common Misconception&rdquo; trap warning, and instant practice questions.
          </p>
        </div>

        {/* Pillar 3: Learning Value */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
            <Target className="w-4 h-4 text-sky-600" />
            <span>03. The Learning Value</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Turning Mistakes into Mastery
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instead of simply stating whether an answer is right or wrong, CloudReady explains <em>why</em> the correct option fits the scenario and analyzes <em>why</em> each distractor choice is less appropriate. The progress engine pinpoints your weakest topic and recommends targeted revision.
          </p>
        </div>

        {/* Pillar 4: Community Value */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
            <Users className="w-4 h-4 text-sky-600" />
            <span>04. The Community Value</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">
            A Free, Reusable Resource for All
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By distilling real exam preparation notes and hurdles into an open, community-friendly tool, CloudReady accelerates the path to cloud literacy for thousands of aspiring engineers and builders.
          </p>
        </div>
      </section>

      {/* Target Users */}
      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
        <h3 className="text-base font-bold text-slate-900">Who CloudReady is Built For</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span><strong>Beginners</strong> taking their first steps into cloud computing and Microsoft Azure.</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span><strong>AZ-900 Candidates</strong> seeking original scenario practice before exam day.</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span><strong>Self-Taught Devs & Career Changers</strong> needing practical intuition rather than heavy theory.</span>
          </div>
          <div className="flex items-start gap-2 bg-white p-3 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <span><strong>Study Groups & Communities</strong> collaborating on cloud certifications together.</span>
          </div>
        </div>
      </section>

      {/* Alignment with all 5 Hackathon Challenges */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          How CloudReady Solves All 5 Hackathon Challenges
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-sky-700">1. 📝 Practice & Assessment: Smart Quiz Builder</span>
            <p className="mt-1 text-slate-600">
              36 original scenario questions with instant answer feedback and option-by-option distractor analysis explaining exactly why distractors are incorrect.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-emerald-700">2. 🧠 Memory & Revision: Flashcard Coach</span>
            <p className="mt-1 text-slate-600">
              Interactive 3D flip card coach with spaced-repetition tracking (&ldquo;Mastered&rdquo; vs &ldquo;Still Learning&rdquo;) and a focus mode filtering down to your most difficult concepts.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-blue-700">3. 📅 Planning: Personal Study Planner</span>
            <p className="mt-1 text-slate-600">
              Calculates daily study hours based on your target exam date and automatically prioritizes your lowest-scoring topic into your milestone schedule.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-purple-700">4. 🤖 Support: AI Study Buddy (African Real-World Context)</span>
            <p className="mt-1 text-slate-600">
              JazaCloud AI assistant powered by Gemini explains abstract Azure services using everyday African analogies (M-Pesa, matatus, solar mini-grids) with support for English, Swahili, and Sheng.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-indigo-700">5. 📊 Progress: Exam Readiness Tracker</span>
            <p className="mt-1 text-slate-600">
              Real-time accuracy calculations, topic-level mastery breakdown, verifiable readiness certificates, and optional Supabase cloud persistence with Row Level Security.
            </p>
          </div>
        </div>
      </section>

      {/* Mandatory Responsible Branding & Legal Disclaimer */}
      <section className="bg-slate-100 rounded-2xl p-6 border border-slate-300 space-y-3 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4 text-slate-600" />
          <span>Independent Educational Project & Non-Affiliation Disclaimer</span>
        </div>
        <p className="leading-relaxed font-medium text-slate-800">
          &ldquo;CloudReady is an independent educational project. It is not affiliated with, endorsed by, or an official product of Microsoft. Microsoft Azure and AZ-900 are referenced for educational purposes.&rdquo;
        </p>
        <p className="leading-relaxed text-slate-600">
          All practice questions included in CloudReady are original educational exercises written to reinforce conceptual understanding. None of the materials reproduce actual, leaked, recalled, or copyrighted Microsoft certification exam questions.
        </p>
      </section>

      {/* CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onStartLearning}
          className="px-5 py-2.5 text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-xl transition-colors cursor-pointer"
        >
          Explore the Study Syllabus
        </button>
          <button
            onClick={onStartQuiz}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Take a Practice Quiz
          </button>
        </div>
      </>
    )}
  </div>
);
};


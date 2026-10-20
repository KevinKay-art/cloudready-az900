import React from 'react';
import {
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Compass,
  RotateCcw,
  Sparkles,
  HelpCircle,
  PlayCircle,
  Layers,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { EXAM_DOMAINS } from '../data/domains';
import { STUDY_TOPICS } from '../data/topics';
import {
  OverallStats,
  TopicProgress,
  DomainId,
} from '../types';
import { formatAccuracy } from '../services/storage';

interface DashboardProps {
  stats: OverallStats;
  progressMap: Record<string, TopicProgress>;
  lastStudiedTopicId: string | null;
  onStartLearning: () => void;
  onSelectTopic: (topicId: string) => void;
  onStartQuiz: (options?: { topicId?: string; domainId?: DomainId; count?: number }) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  progressMap,
  lastStudiedTopicId,
  onStartLearning,
  onSelectTopic,
  onStartQuiz,
  onNavigateToTab,
}) => {
  const lastStudiedTopic = lastStudiedTopicId
    ? STUDY_TOPICS.find((t) => t.id === lastStudiedTopicId)
    : null;

  // Compute domain breakdown
  const domainStats = EXAM_DOMAINS.map((domain) => {
    const domainTopics = STUDY_TOPICS.filter((t) => t.domainId === domain.id);
    let answered = 0;
    let correct = 0;
    let studiedCount = 0;

    for (const t of domainTopics) {
      const p = progressMap[t.id];
      if (p && p.questionsAnswered > 0) {
        answered += p.questionsAnswered;
        correct += p.questionsCorrect;
        studiedCount += 1;
      }
    }

    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : null;
    const topicCoveragePct = Math.round((studiedCount / domainTopics.length) * 100);

    return {
      domain,
      topicsCount: domainTopics.length,
      studiedCount,
      answered,
      correct,
      accuracy,
      topicCoveragePct,
    };
  });

  const isNewUser = stats.totalAnswered === 0;

  return (
    <div className="space-y-8">
      {/* Hero Banner with Clean Navy & Azure Visual Identity */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Cloud<span className="text-sky-400">Ready</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 font-normal mb-6 leading-relaxed">
            Your Azure Fundamentals learning companion. Learn core cloud concepts with plain-English analogies, test your understanding with original scenario questions, and discover exactly what to revise next.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartLearning}
              className="px-5 py-3 text-sm font-semibold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Start Learning</span>
            </button>

            <button
              onClick={() => onStartQuiz({ count: 10 })}
              className="px-5 py-3 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-sky-400" />
              <span>Take 10-Question Diagnostic</span>
            </button>

            {lastStudiedTopic && (
              <button
                onClick={() => onSelectTopic(lastStudiedTopic.id)}
                className="px-4 py-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>Resume: {lastStudiedTopic.title}</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtle geometric Azure-inspired grid backdrop */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
            <defs>
              <pattern id="azure-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#azure-grid)" />
          </svg>
        </div>
      </section>

      {/* KPI Cards Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Answered */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Questions Answered</span>
            <HelpCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {stats.totalAnswered}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {isNewUser ? 'Ready to begin your first quiz' : `${stats.totalCorrect} correct answers`}
          </div>
        </div>

        {/* Metric 2: Overall Accuracy */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Overall Accuracy</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {formatAccuracy(stats.accuracy)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.accuracy === null
              ? 'Answer questions to calculate'
              : stats.accuracy >= 70
              ? 'On track for AZ-900 benchmark (70%)'
              : 'Keep practicing to reach 70% passing bar'}
          </div>
        </div>

        {/* Metric 3: Weakest Topic (Requires >= 3 answered) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Weakest Topic</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          {stats.weakestTopic ? (
            <div>
              <div className="text-sm font-bold text-slate-900 line-clamp-1" title={stats.weakestTopic.topicTitle}>
                {stats.weakestTopic.topicTitle}
              </div>
              <div className="text-xs text-amber-700 font-semibold tabular-nums mt-1">
                {stats.weakestTopic.accuracy}% accuracy ({stats.weakestTopic.answered} answered)
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-slate-700">Not enough data</div>
              <div className="text-xs text-slate-500 mt-1">Requires at least 3 answered questions</div>
            </div>
          )}
        </div>

        {/* Metric 4: Recommended Next Topic */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="text-xs font-medium text-slate-500 mb-1 flex items-center justify-between">
            <span>Recommended Next</span>
            <Compass className="w-4 h-4 text-sky-600" />
          </div>
          {stats.recommendedTopic ? (
            <div>
              <div className="text-sm font-bold text-slate-900 line-clamp-1" title={stats.recommendedTopic.topicTitle}>
                {stats.recommendedTopic.topicTitle}
              </div>
              <button
                onClick={() => stats.recommendedTopic && onSelectTopic(stats.recommendedTopic.topicId)}
                className="text-xs text-sky-600 hover:text-sky-800 font-medium inline-flex items-center gap-1 mt-1 cursor-pointer"
              >
                <span>Study topic now</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-slate-700">All Topics Covered</div>
              <div className="text-xs text-slate-500 mt-1">Take a mixed mock exam to maintain mastery</div>
            </div>
          )}
        </div>
      </section>

      {/* Domain Readiness Cards */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Official AZ-900 Exam Domains</h2>
            <p className="text-sm text-slate-500">
              Exam weights and your current preparation readiness across the 3 core syllabus domains.
            </p>
          </div>
          <button
            onClick={() => onStartQuiz({ count: 25 })}
            className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>Take Full Mixed Exam (25 Questions)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {domainStats.map(({ domain, topicsCount, studiedCount, answered, accuracy, topicCoveragePct }) => {
            const domainIcon =
              domain.id === 'domain_1' ? (
                <Layers className="w-5 h-5 text-sky-600" />
              ) : domain.id === 'domain_2' ? (
                <Server className="w-5 h-5 text-blue-600" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              );

            return (
              <div
                key={domain.id}
                className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">{domainIcon}</div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                      Weight: {domain.weight}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{domain.title}</h3>
                  <p className="text-xs text-slate-600 mb-4 line-clamp-2">{domain.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Topics explored:</span>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {studiedCount} / {topicsCount} ({topicCoveragePct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${topicCoveragePct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Domain Accuracy:</span>
                    <span className="font-bold text-slate-800 tabular-nums">
                      {accuracy === null ? 'Not enough data' : `${accuracy}% (${answered} answered)`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => onStartLearning()}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center transition-colors cursor-pointer"
                    >
                      Browse Lessons
                    </button>
                    <button
                      onClick={() => onStartQuiz({ domainId: domain.id, count: 8 })}
                      className="px-3 py-1.5 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg text-center transition-colors cursor-pointer"
                    >
                      Domain Quiz
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5 Hackathon Challenges Showcase */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
              Vibe Coding Hackathon · Challenge Solutions
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Built for Every Stage of Your AZ-900 Journey
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">5 Completed Challenge Tracks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {/* Challenge 1 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-sky-700 mb-1">📝 Practice & Assessment</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Smart Quiz Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                36 original practice questions with instant right/wrong feedback and option-by-option distractor analysis.
              </p>
            </div>
            <button
              onClick={() => onStartQuiz({ count: 10 })}
              className="mt-3 text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Take Quiz</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Challenge 2 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-700 mb-1">🧠 Memory & Revision</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Flashcard Coach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spaced repetition deck with 3D flip cards, exam traps, and focus modes for difficult concepts.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('flashcards')}
              className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Open Flashcards</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Challenge 3 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-blue-700 mb-1">📅 Study Planning</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Personal Study Planner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates a customized roadmap based on your exam date, weekly hours, and auto-prioritizes your weakest areas.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('planner')}
              className="mt-3 text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Study Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Challenge 4 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-purple-700 mb-1">🤖 AI Support & Community</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">JazaCloud Study Buddy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explains cloud architecture using relatable African context (M-Pesa, matatus, kiosks) in English, Swahili, and Sheng.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('studybuddy')}
              className="mt-3 text-xs font-bold text-purple-700 hover:text-purple-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Chat with AI Buddy</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Challenge 5 */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between sm:col-span-2 lg:col-span-2">
            <div>
              <div className="text-xs font-bold text-indigo-700 mb-1">📊 Progress & Readiness</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Readiness Tracker & Supabase DB</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live accuracy metrics, domain mastery breakdown, weakest topic detection, self-check test suite, and Supabase RLS cloud sync.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab('progress')}
              className="mt-3 text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Check Exam Readiness</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Community & Learning Philosophy Callout */}
      <section className="bg-sky-50/70 rounded-xl p-6 border border-sky-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-800">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>The CloudReady 3-Step Method</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Learn → Practise → Review</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Don’t just memorize exam answers. Read the plain-English concept analogies, test yourself with scenario questions, and turn every mistake into a targeted revision step.
          </p>
        </div>

        <button
          onClick={onStartLearning}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
        >
          Explore All 12 Study Topics
        </button>
      </section>
    </div>
  );
};

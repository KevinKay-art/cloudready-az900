import React, { useState } from 'react';
import {
  BarChart2,
  Database,
  Cloud,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  Calendar,
  Lock,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { STUDY_TOPICS } from '../data/topics';
import { EXAM_DOMAINS } from '../data/domains';
import { OverallStats, TopicProgress, QuizAttempt } from '../types';
import { formatAccuracy } from '../services/storage';
import { SUPABASE_SQL_SETUP } from '../services/schema';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
} from '../services/supabase';
import { runCloudReadySelfTests, TestResult } from '../utils/tests';

interface ProgressViewProps {
  stats: OverallStats;
  progressMap: Record<string, TopicProgress>;
  attempts: QuizAttempt[];
  onReviewTopic: (topicId: string) => void;
  onResetProgress: () => void;
  onStartQuiz: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  stats,
  progressMap,
  attempts,
  onReviewTopic,
  onResetProgress,
  onStartQuiz,
}) => {
  // Supabase State
  const initialCreds = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState<string>(initialCreds.url);
  const [supabaseKey, setSupabaseKey] = useState<string>(initialCreds.anonKey);
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    loading: boolean;
  }>({
    tested: false,
    success: false,
    message: '',
    loading: false,
  });

  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  // Diagnostics Unit Test State
  const [diagnosticResults, setDiagnosticResults] = useState<TestResult[] | null>(null);

  const handleTestSupabase = async () => {
    setTestStatus({ tested: false, success: false, message: '', loading: true });
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
    const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setTestStatus({
      tested: true,
      success: res.success,
      message: res.message,
      loading: false,
    });
  };

  const handleClearSupabase = () => {
    clearSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseKey('');
    setTestStatus({
      tested: false,
      success: false,
      message: 'Cleared Supabase configuration. Using local browser persistence.',
      loading: false,
    });
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SETUP);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleRunDiagnostics = () => {
    const results = runCloudReadySelfTests();
    setDiagnosticResults(results);
  };

  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes('your-project-id') &&
      !supabaseKey.includes('your-anon-public-key')
  );

  return (
    <div className="space-y-8">
      {/* Page Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Study Progress & Data Integrity
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Real performance records, topic mastery breakdown, Supabase database connectivity, and verification diagnostics.
          </p>
        </div>

        {/* Database Status Tag */}
        <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shrink-0">
          <div
            className={`w-3 h-3 rounded-full ${
              isSupabaseConfigured && testStatus.success ? 'bg-emerald-500' : 'bg-sky-500'
            }`}
          />
          <div className="text-xs">
            <span className="text-slate-500 font-medium">Storage Engine: </span>
            <span className="font-bold text-slate-900">
              {isSupabaseConfigured && testStatus.success ? 'Supabase Cloud DB' : 'Local Browser Storage'}
            </span>
          </div>
        </div>
      </div>

      {/* Database Integration & Supabase Setup Panel */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-sky-600" />
            <h2 className="text-base font-bold text-slate-900">
              Supabase Database & Row Level Security (RLS)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSqlModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>View SQL Setup Script</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          CloudReady is architected with a decoupled storage layer. In local mode, progress is saved in your browser’s <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-xs">localStorage</code> without any external requirements. To sync progress cross-device or test real Supabase connectivity, configure your project credentials below.
        </p>

        {/* Credentials Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supabase Anon Public Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
          </div>
        </div>

        {/* Test Connection Button & Result */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSupabase}
              disabled={testStatus.loading}
              className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {testStatus.loading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Database className="w-3.5 h-3.5" />
              )}
              <span>{testStatus.loading ? 'Testing...' : 'Test & Save Connection'}</span>
            </button>

            {isSupabaseConfigured && (
              <button
                onClick={handleClearSupabase}
                className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Disconnect & Use Local Storage
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>RLS isolates each learner’s records</span>
          </div>
        </div>

        {testStatus.tested && (
          <div
            className={`p-3 rounded-lg text-xs flex items-start gap-2 border ${
              testStatus.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {testStatus.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-bold">{testStatus.success ? 'Success' : 'Connection Notice'}</div>
              <div>{testStatus.message}</div>
            </div>
          </div>
        )}
      </section>

      {/* Topic by Topic Mastery Breakdown */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Topic Mastery Breakdown</h2>
          <span className="text-xs text-slate-500">12 Syllabus Topics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-semibold">Topic Title</th>
                <th className="pb-3 font-semibold">Domain</th>
                <th className="pb-3 font-semibold text-center">Answered</th>
                <th className="pb-3 font-semibold text-center">Correct</th>
                <th className="pb-3 font-semibold text-right">Accuracy</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STUDY_TOPICS.map((topic) => {
                const p = progressMap[topic.id];
                const answered = p?.questionsAnswered || 0;
                const correct = p?.questionsCorrect || 0;
                const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : null;
                const domain = EXAM_DOMAINS.find((d) => d.id === topic.domainId);

                return (
                  <tr key={topic.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-slate-900 pr-2">{topic.title}</td>
                    <td className="py-3 text-slate-500">{domain?.shortTitle}</td>
                    <td className="py-3 text-center tabular-nums text-slate-700">{answered}</td>
                    <td className="py-3 text-center tabular-nums text-emerald-700 font-medium">
                      {correct}
                    </td>
                    <td className="py-3 text-right tabular-nums font-bold text-slate-900">
                      {formatAccuracy(accuracy)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onReviewTopic(topic.id)}
                        className="text-xs text-sky-600 hover:text-sky-800 font-semibold cursor-pointer"
                      >
                        Study
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quiz Attempts History */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Recent Quiz History</h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {attempts.length} {attempts.length === 1 ? 'attempt' : 'attempts'} logged
          </span>
        </div>

        {attempts.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 text-sm">No quizzes completed yet</p>
            <p className="mt-1">Complete a practice quiz to view attempt timestamps and score tracking.</p>
            <button
              onClick={onStartQuiz}
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg cursor-pointer"
            >
              Start First Quiz
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {attempts.map((att) => (
              <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{att.topicTitle}</div>
                  <div className="text-slate-500 mt-0.5">
                    {new Date(att.completedAt).toLocaleString()} · {att.correctAnswers} of{' '}
                    {att.totalQuestions} questions correct
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-lg font-bold tabular-nums ${
                    att.accuracy >= 70
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {att.accuracy}%
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Self-Check Diagnostics Unit Tests Suite */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Scoring Logic & Data Quality Self-Tests
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify accuracy calculations, duplicate prevention, and score constraints.
            </p>
          </div>

          <button
            onClick={handleRunDiagnostics}
            className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Test Suite</span>
          </button>
        </div>

        {diagnosticResults && (
          <div className="space-y-2.5 pt-2 animate-in fade-in duration-150">
            {diagnosticResults.map((t, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs"
              >
                {t.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{t.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                      {t.category}
                    </span>
                  </div>
                  <div className="text-slate-600 mt-0.5">{t.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Progress Reset Button */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset your local study progress and history?')) {
              onResetProgress();
            }
          }}
          className="text-xs text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Study History</span>
        </button>
      </div>

      {/* SQL Setup Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm sm:text-base">Supabase SQL Schema & RLS Setup</h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600">
              <p>
                To enable real multi-user persistence and cross-device sync, create a free project at{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 underline font-medium"
                >
                  supabase.com
                </a>
                , open the <strong>SQL Editor</strong>, and run the following script:
              </p>

              <div className="relative">
                <button
                  onClick={handleCopySql}
                  className="absolute right-3 top-3 px-2.5 py-1 text-[11px] font-bold bg-slate-800 text-white hover:bg-slate-700 rounded transition-colors flex items-center gap-1 shadow-xs cursor-pointer z-10"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                </button>
                <pre className="bg-slate-950 text-slate-200 p-4 rounded-xl overflow-x-auto text-[11px] font-mono leading-relaxed border border-slate-800 max-h-72">
                  {SUPABASE_SQL_SETUP}
                </pre>
              </div>

              <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 text-[11px] text-sky-900 space-y-1">
                <div className="font-bold">What this SQL sets up:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  <li><code className="font-mono">profiles</code> table with foreign key to <code className="font-mono">auth.users</code></li>
                  <li><code className="font-mono">study_progress</code> with unique constraint on <code className="font-mono">(user_id, topic_id)</code></li>
                  <li><code className="font-mono">quiz_attempts</code> recording accuracy and question scores</li>
                  <li>Strict Row Level Security (RLS) policies guaranteeing learners cannot access other learners&apos; records</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

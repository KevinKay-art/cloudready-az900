import React, { useState } from 'react';
import {
  Play,
  Layers,
  Server,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Timer,
  AlertCircle,
  Bookmark,
} from 'lucide-react';
import { EXAM_DOMAINS } from '../data/domains';
import { STUDY_TOPICS } from '../data/topics';
import { PRACTICE_QUESTIONS } from '../data/questions';
import { Question } from '../types';
import { getAllMissedQuestionIds, getBookmarkedQuestionIds } from '../services/storage';

interface QuizLauncherProps {
  onLaunch: (
    questions: Question[],
    title: string,
    topicId?: string,
    isTimed?: boolean,
    durationMinutes?: number
  ) => void;
  onBrowseLessons: () => void;
}

export const QuizLauncher: React.FC<QuizLauncherProps> = ({ onLaunch, onBrowseLessons }) => {
  const [selectedMode, setSelectedMode] = useState<string>('mixed-10');
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);

  const missedIds = getAllMissedQuestionIds();
  const bookmarkedIds = getBookmarkedQuestionIds();

  const missedQuestions = PRACTICE_QUESTIONS.filter((q) => missedIds.includes(q.id));
  const bookmarkedQuestions = PRACTICE_QUESTIONS.filter((q) => bookmarkedIds.includes(q.id));

  const handleLaunch = () => {
    if (selectedMode === 'missed') {
      onLaunch(
        missedQuestions,
        'Targeted Mistakes Practice Drill',
        'missed',
        isTimed,
        durationMinutes
      );
    } else if (selectedMode === 'bookmarked') {
      onLaunch(
        bookmarkedQuestions,
        'Flagged Questions Review',
        'bookmarked',
        isTimed,
        durationMinutes
      );
    } else if (selectedMode === 'mixed-10') {
      const shuffled = [...PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10);
      onLaunch(
        selected,
        'Mixed 10-Question Diagnostic Exam',
        'mixed',
        isTimed,
        durationMinutes
      );
    } else if (selectedMode === 'mixed-25') {
      const shuffled = [...PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 25);
      onLaunch(
        selected,
        'Full 25-Question Mixed Practice Exam',
        'mixed',
        isTimed,
        durationMinutes
      );
    } else if (selectedMode.startsWith('domain_')) {
      const dom = EXAM_DOMAINS.find((d) => d.id === selectedMode);
      const domainQs = PRACTICE_QUESTIONS.filter((q) => q.domainId === selectedMode);
      onLaunch(
        domainQs,
        `${dom?.title || 'Domain'} Practice Quiz`,
        selectedMode,
        isTimed,
        durationMinutes
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Configure Your Practice Quiz
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Choose between a quick diagnostic, a full timed AZ-900 mock exam, or a targeted review of your past mistakes.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Select Quiz Mode
        </h2>

        {/* Options */}
        <div className="space-y-2.5">
          {/* Targeted Mistakes Mode (Conditional) */}
          {missedQuestions.length > 0 && (
            <label
              onClick={() => setSelectedMode('missed')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedMode === 'missed'
                  ? 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="quiz-mode"
                  checked={selectedMode === 'missed'}
                  onChange={() => setSelectedMode('missed')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Practice Past Missed Questions</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Drill only questions you answered incorrectly until you achieve 100% mastery.
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                {missedQuestions.length} Questions
              </span>
            </label>
          )}

          {/* Bookmarked Questions Mode (Conditional) */}
          {bookmarkedQuestions.length > 0 && (
            <label
              onClick={() => setSelectedMode('bookmarked')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedMode === 'bookmarked'
                  ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="quiz-mode"
                  checked={selectedMode === 'bookmarked'}
                  onChange={() => setSelectedMode('bookmarked')}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-amber-600 fill-current" />
                    <span>Flagged & Saved Questions</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Revisit items you previously flagged for deeper study.
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                {bookmarkedQuestions.length} Questions
              </span>
            </label>
          )}

          {/* 10-Question Diagnostic */}
          <label
            onClick={() => setSelectedMode('mixed-10')}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedMode === 'mixed-10'
                ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="quiz-mode"
                checked={selectedMode === 'mixed-10'}
                onChange={() => setSelectedMode('mixed-10')}
                className="text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">10-Question Quick Diagnostic</div>
                <div className="text-xs text-slate-500">
                  Balanced mix from all 3 exam domains · Estimated time: 8-10 mins
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              10 Questions
            </span>
          </label>

          {/* 25-Question Full Practice Exam */}
          <label
            onClick={() => setSelectedMode('mixed-25')}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedMode === 'mixed-25'
                ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="quiz-mode"
                checked={selectedMode === 'mixed-25'}
                onChange={() => setSelectedMode('mixed-25')}
                className="text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">25-Question Comprehensive Mock Exam</div>
                <div className="text-xs text-slate-500">
                  Full practice simulating the AZ-900 exam domain weighting
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
              25 Questions
            </span>
          </label>

          {/* Domain 1 */}
          <label
            onClick={() => setSelectedMode('domain_1')}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedMode === 'domain_1'
                ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="quiz-mode"
                checked={selectedMode === 'domain_1'}
                onChange={() => setSelectedMode('domain_1')}
                className="text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">Domain 1: Cloud Concepts</div>
                <div className="text-xs text-slate-500">
                  Cloud benefits, public/private/hybrid, IaaS/PaaS/SaaS, CapEx/OpEx (12 questions)
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              12 Questions
            </span>
          </label>

          {/* Domain 2 */}
          <label
            onClick={() => setSelectedMode('domain_2')}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedMode === 'domain_2'
                ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="quiz-mode"
                checked={selectedMode === 'domain_2'}
                onChange={() => setSelectedMode('domain_2')}
                className="text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">Domain 2: Azure Architecture & Services</div>
                <div className="text-xs text-slate-500">
                  Regions, Availability Zones, VMs, Storage, VNets, Microsoft Entra ID (14 questions)
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              14 Questions
            </span>
          </label>

          {/* Domain 3 */}
          <label
            onClick={() => setSelectedMode('domain_3')}
            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedMode === 'domain_3'
                ? 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="quiz-mode"
                checked={selectedMode === 'domain_3'}
                onChange={() => setSelectedMode('domain_3')}
                className="text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-bold text-slate-900">Domain 3: Management & Governance</div>
                <div className="text-xs text-slate-500">
                  Cost Management, Pricing/TCO Calculators, Azure Policy, Locks, Monitor (10 questions)
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              10 Questions
            </span>
          </label>
        </div>

        {/* Timed Exam Settings */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-sky-600" />
              <div>
                <span className="text-xs font-bold text-slate-900">Enable Exam Countdown Timer</span>
                <p className="text-[11px] text-slate-500">
                  Simulate real testing room pressure with an active timer.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isTimed}
              onChange={(e) => setIsTimed(e.target.checked)}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500 cursor-pointer"
            />
          </label>

          {isTimed && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Timer Duration:</span>
              <div className="flex items-center gap-1">
                {[15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer ${
                      durationMinutes === mins
                        ? 'bg-sky-600 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onBrowseLessons}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study syllabus first</span>
          </button>

          <button
            onClick={handleLaunch}
            className="px-6 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Practice Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};

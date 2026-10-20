import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { STUDY_TOPICS } from '../data/topics';
import { OverallStats, TopicProgress } from '../types';

interface StudyPlannerProps {
  stats: OverallStats;
  progressMap: Record<string, TopicProgress>;
  onSelectTopic: (topicId: string) => void;
  onStartQuiz: (options?: any) => void;
}

const STORAGE_KEY_PLANNER = 'cloudready_study_planner_config_v1';
const STORAGE_KEY_COMPLETED_TASKS = 'cloudready_planner_completed_tasks_v1';

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  stats,
  progressMap,
  onSelectTopic,
  onStartQuiz,
}) => {
  // Config state
  const [examDate, setExamDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANNER);
      if (saved) return JSON.parse(saved).examDate;
    } catch {}
    // Default to 14 days from now
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const [hoursPerWeek, setHoursPerWeek] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLANNER);
      if (saved) return JSON.parse(saved).hoursPerWeek;
    } catch {}
    return 6;
  });

  const [learnerLevel, setLearnerLevel] = useState<'beginner' | 'intermediate' | 'refresher'>('beginner');

  // Checkbox state for completed milestones
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COMPLETED_TASKS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY_PLANNER,
      JSON.stringify({ examDate, hoursPerWeek, learnerLevel })
    );
  }, [examDate, hoursPerWeek, learnerLevel]);

  const toggleTask = (taskId: string) => {
    const updated = completedTaskIds.includes(taskId)
      ? completedTaskIds.filter((id) => id !== taskId)
      : [...completedTaskIds, taskId];
    setCompletedTaskIds(updated);
    localStorage.setItem(STORAGE_KEY_COMPLETED_TASKS, JSON.stringify(updated));
  };

  // Compute days until exam
  const today = new Date();
  const target = new Date(examDate);
  const diffTime = target.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const weeksRemaining = Math.max(1, Math.ceil(daysRemaining / 7));
  const totalPlannedHours = Math.round((daysRemaining / 7) * hoursPerWeek);

  // Generate personalized study milestones
  // If user has a weakest topic, prioritize it into Phase 1!
  const weakTopicId = stats.weakestTopic?.topicId;

  const milestones = [
    {
      id: 'phase-1',
      title: 'Phase 1: Foundations & Core Concepts',
      duration: 'Days 1 to 4',
      description: 'Master Cloud Benefits, Deployment Models, and CapEx vs OpEx.',
      recommendedTopics: ['cloud-benefits', 'cloud-models', 'service-models-shared-responsibility', 'cloud-economics'],
      suggestedAction: 'Take 10-Question Diagnostic Quiz',
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Azure Geography, Compute & Storage',
      duration: 'Days 5 to 9',
      description: 'Deep dive into Regions, Availability Zones, VMs, and Blob Redundancy (LRS, ZRS, GRS).',
      recommendedTopics: ['azure-geography', 'resource-hierarchy', 'azure-compute-services', 'azure-storage'],
      suggestedAction: 'Practice Architecture & Services Domain Quiz',
    },
    {
      id: 'phase-3',
      title: 'Phase 3: Identity, Governance & Cost Tools',
      duration: 'Days 10 to 12',
      description: 'Microsoft Entra ID, Conditional Access, Azure Policy, Locks, and Cost Management.',
      recommendedTopics: ['azure-identity', 'azure-networking', 'cost-management', 'governance-monitoring'],
      suggestedAction: 'Practice Management & Governance Domain Quiz',
    },
    {
      id: 'phase-4',
      title: 'Phase 4: Full Timed Practice Exam & Weak Areas',
      duration: 'Final 48 Hours',
      description: 'Simulate the full 25-question AZ-900 exam with 30-min timer and drill any missed items.',
      recommendedTopics: weakTopicId ? [weakTopicId] : ['cloud-benefits', 'azure-identity'],
      suggestedAction: 'Take 25-Question Comprehensive Timed Exam',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
          <Calendar className="w-4 h-4" />
          <span>Challenge: Personal Study Planner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Tailored AZ-900 Study Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Set your exam date and study commitment. We dynamically structure your preparation schedule and prioritize your weak areas.
        </p>
      </div>

      {/* Target Parameters Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Exam Timeline & Available Hours
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Target Exam Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>

          {/* Available Study Hours */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Study Time / Week ({hoursPerWeek} hrs)
            </label>
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseInt(e.target.value, 10))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>2 hrs</span>
              <span>10 hrs</span>
              <span>20 hrs</span>
            </div>
          </div>

          {/* Background Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Knowledge Level
            </label>
            <select
              value={learnerLevel}
              onChange={(e) => setLearnerLevel(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium cursor-pointer"
            >
              <option value="beginner">Complete Beginner</option>
              <option value="intermediate">Some IT / Cloud Experience</option>
              <option value="refresher">Final Exam Refresher</option>
            </select>
          </div>
        </div>

        {/* Readiness Countdown Strip */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-xl font-extrabold text-slate-900 tabular-nums">{daysRemaining}</div>
            <div className="text-[11px] text-slate-500">Days to Exam</div>
          </div>
          <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200">
            <div className="text-xl font-extrabold text-sky-800 tabular-nums">~{totalPlannedHours} hrs</div>
            <div className="text-[11px] text-sky-700">Total Study Time</div>
          </div>
          <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-200">
            <div className="text-xl font-extrabold text-indigo-800 tabular-nums">
              {stats.accuracy !== null ? `${stats.accuracy}%` : 'Diagnostic'}
            </div>
            <div className="text-[11px] text-indigo-700">Current Accuracy</div>
          </div>
        </div>

        {/* Weak Area Prioritization Callout */}
        {stats.weakestTopic && (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Prioritizing Weak Area: </span>
              Your current lowest scoring topic is <strong>{stats.weakestTopic.topicTitle}</strong> ({stats.weakestTopic.accuracy}%). It has been added to your revision milestone targets!
            </div>
          </div>
        )}
      </div>

      {/* Structured Roadmap Milestones */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Your Structured Milestones</h2>

        <div className="space-y-3">
          {milestones.map((m, idx) => {
            const isCompleted = completedTaskIds.includes(m.id);

            return (
              <div
                key={m.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted ? 'bg-slate-50/60 border-slate-200 opacity-80' : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {m.duration}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-slate-700">{m.title}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {m.description}
                    </p>

                    {/* Topic quick links */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {m.recommendedTopics.map((topicId) => {
                        const t = STUDY_TOPICS.find((item) => item.id === topicId);
                        if (!t) return null;
                        const p = progressMap[t.id];
                        const isDone = p && p.questionsAnswered > 0;

                        return (
                          <button
                            key={t.id}
                            onClick={() => onSelectTopic(t.id)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border flex items-center gap-1 cursor-pointer transition-colors ${
                              isDone
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span>{t.title}</span>
                            {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Task complete toggle */}
                  <button
                    onClick={() => toggleTask(m.id)}
                    className={`p-2 rounded-xl border text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer ${
                      isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white border-slate-300 text-slate-500 hover:border-sky-500'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{isCompleted ? 'Done' : 'Mark Done'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

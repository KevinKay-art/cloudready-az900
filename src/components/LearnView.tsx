import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Lightbulb,
  AlertOctagon,
  CheckCircle,
  HelpCircle,
  Play,
  Layers,
  Server,
  ShieldCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { STUDY_TOPICS } from '../data/topics';
import { EXAM_DOMAINS } from '../data/domains';
import { StudyTopic, TopicProgress, DomainId } from '../types';
import { Visualizers } from './Visualizers';

interface LearnViewProps {
  progressMap: Record<string, TopicProgress>;
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
  onStartTopicQuiz: (topicId: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  progressMap,
  selectedTopicId,
  onSelectTopic,
  onStartTopicQuiz,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'lessons' | 'visualizers'>('lessons');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('all');

  const activeTopic = selectedTopicId
    ? STUDY_TOPICS.find((t) => t.id === selectedTopicId) || null
    : null;

  const filteredTopics = STUDY_TOPICS.filter((t) => {
    if (selectedDomainFilter === 'all') return true;
    return t.domainId === selectedDomainFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top View Selector: Syllabus Modules vs Interactive Architecture Models */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-xl w-fit">
        <button
          onClick={() => setActiveSubTab('lessons')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'lessons'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          12 Core Syllabus Modules
        </button>
        <button
          onClick={() => setActiveSubTab('visualizers')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'visualizers'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-sky-600" />
          <span>Interactive Architectural Visualizers</span>
        </button>
      </div>

      {activeSubTab === 'visualizers' ? (
        <Visualizers />
      ) : (
        <>
          {/* Header and Instructional Model Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
                Instructional Sequence: Learn → Practise → Review
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                AZ-900 Study Syllabus
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl">
                12 core cloud topics structured according to the latest Microsoft Azure Fundamentals exam domains. Study the concepts, practical analogies, and exam traps before testing your knowledge.
              </p>
            </div>

            {/* Domain Filter Segmented Control */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedDomainFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  selectedDomainFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Topics ({STUDY_TOPICS.length})
              </button>
              {EXAM_DOMAINS.map((domain) => (
                <button
                  key={domain.id}
              onClick={() => setSelectedDomainFilter(domain.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedDomainFilter === domain.id
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {domain.shortTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTopics.map((topic) => {
          const progress = progressMap[topic.id];
          const hasStudied = progress && progress.questionsAnswered > 0;
          const accuracy = hasStudied
            ? Math.round((progress.questionsCorrect / progress.questionsAnswered) * 100)
            : null;

          const domain = EXAM_DOMAINS.find((d) => d.id === topic.domainId);

          return (
            <div
              key={topic.id}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-medium text-sky-700">{domain?.shortTitle}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{topic.readingTimeMinutes} min read</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-sky-700 transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {topic.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Progress:</span>
                  {hasStudied ? (
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {progress.questionsCorrect}/{progress.questionsAnswered} correct ({accuracy}%)
                    </span>
                  ) : (
                    <span className="text-slate-400">Not attempted yet</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectTopic(topic.id)}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg text-center transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Lesson</span>
                  </button>

                  <button
                    onClick={() => onStartTopicQuiz(topic.id)}
                    className="px-3 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg text-center transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Practice (Quiz)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  )}

  {/* Full Lesson Reader Modal */}
      {activeTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-sky-400 mb-0.5">
                  {EXAM_DOMAINS.find((d) => d.id === activeTopic.domainId)?.title}
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">{activeTopic.title}</h2>
              </div>
              <button
                onClick={() => onSelectTopic(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close reader"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
              {/* 1. Core Explanation */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  01. Plain-English Concept Explanation
                </h4>
                <div className="space-y-2.5">
                  {activeTopic.fullExplanation.map((para, i) => (
                    <p key={i} className="text-slate-800 text-sm sm:text-base leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* 2. Real-World Practical Analogy */}
              <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-900 uppercase tracking-wider mb-1.5">
                  <Lightbulb className="w-4 h-4 text-sky-600" />
                  <span>Real-World Scenario & Analogy</span>
                </div>
                <p className="text-sky-950 text-sm leading-relaxed">{activeTopic.realWorldExample}</p>
              </div>

              {/* 3. Important Terms */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  02. Key Terminology Glossary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeTopic.keyTerms.map((term, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs mb-0.5">{term.term}</div>
                      <div className="text-xs text-slate-600 leading-snug">{term.definition}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Common Misconception (Trap Alert) */}
              <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                  <AlertOctagon className="w-4 h-4 text-amber-600" />
                  <span>Common Exam Misconception & Trap</span>
                </div>
                <div className="space-y-1.5 text-xs text-amber-950">
                  <p>
                    <span className="font-bold text-amber-800">The Trap:</span>{' '}
                    {activeTopic.commonMisconception.trap}
                  </p>
                  <p>
                    <span className="font-bold text-emerald-800">The Reality:</span>{' '}
                    {activeTopic.commonMisconception.reality}
                  </p>
                </div>
              </div>

              {/* 5. Short Recap Points */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  03. Quick Exam Memory Recap
                </h4>
                <ul className="space-y-1.5">
                  {activeTopic.recapPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Sticky Footer Action */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4 shrink-0">
              <button
                onClick={() => onSelectTopic(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Close Lesson
              </button>

              <button
                onClick={() => {
                  const id = activeTopic.id;
                  onSelectTopic(null);
                  onStartTopicQuiz(id);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Test Your Understanding (3 Practice Questions)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

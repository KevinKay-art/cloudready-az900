import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Award,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
} from 'lucide-react';
import { QuizAttempt, Question } from '../types';
import { STUDY_TOPICS } from '../data/topics';
import { PRACTICE_QUESTIONS } from '../data/questions';

interface QuizResultsProps {
  attempt: QuizAttempt;
  onRetake: () => void;
  onPracticeMissed?: (questions: Question[]) => void;
  onReviewTopic: (topicId: string) => void;
  onGoToDashboard: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  attempt,
  onRetake,
  onPracticeMissed,
  onReviewTopic,
  onGoToDashboard,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState<boolean>(false);

  const incorrectAnswers = attempt.answers.filter((a) => !a.isCorrect);
  const correctCount = attempt.correctAnswers;
  const incorrectCount = attempt.totalQuestions - correctCount;
  const isPassing = attempt.accuracy >= 70; // 70% standard AZ-900 benchmark

  const missedQuestionObjects = PRACTICE_QUESTIONS.filter((q) =>
    incorrectAnswers.some((a) => a.questionId === q.id)
  );

  // Identify topics of missed questions for targeted revision suggestions
  const missedTopicIds = Array.from(new Set(incorrectAnswers.map((a) => a.topicId)));
  const revisionTopics = STUDY_TOPICS.filter((t) => missedTopicIds.includes(t.id));

  const toggleExpand = (id: string) => {
    setExpandedQuestionId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score Overview Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center">
        <div
          className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
            isPassing ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          <Award className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
          {isPassing ? 'Exam Ready! Great Score.' : 'Keep Practicing!'}
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          {isPassing
            ? `You scored ${attempt.accuracy}%, comfortably clearing the 70% Microsoft AZ-900 benchmark.`
            : `You scored ${attempt.accuracy}%. Drill your missed questions below to reach the 70% passing threshold.`}
        </p>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2 pb-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {attempt.accuracy}%
            </div>
            <div className="text-xs text-slate-500 font-medium">Final Score</div>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
            <div className="text-2xl font-bold text-emerald-800 tabular-nums">{correctCount}</div>
            <div className="text-xs text-emerald-700 font-medium">Correct</div>
          </div>

          <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200">
            <div className="text-2xl font-bold text-rose-800 tabular-nums">{incorrectCount}</div>
            <div className="text-xs text-rose-700 font-medium">Incorrect</div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
          {missedQuestionObjects.length > 0 && onPracticeMissed && (
            <button
              onClick={() => onPracticeMissed(missedQuestionObjects)}
              className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice {missedQuestionObjects.length} Missed Questions</span>
            </button>
          )}

          {isPassing && (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-4 py-2.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Readiness Certificate</span>
            </button>
          )}

          <button
            onClick={onRetake}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Quiz</span>
          </button>

          <button
            onClick={onGoToDashboard}
            className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Readiness Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
            <div className="border-4 border-sky-600/30 rounded-xl p-6 text-center space-y-4 bg-linear-to-b from-sky-50/50 to-white">
              <div className="w-12 h-12 bg-sky-600 text-white rounded-xl mx-auto flex items-center justify-center shadow-md">
                <Award className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold uppercase tracking-widest text-sky-700">
                #1MillionDevs Movement · CloudReady
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                AZ-900 Exam Readiness Certificate
              </h2>

              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                This validates successful completion of the AZ-900 Practice Examination with an overall passing score exceeding the 700/1000 benchmark.
              </p>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 inline-block w-full text-xs">
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="text-slate-400">Score Achieved:</span>
                    <div className="text-lg font-bold text-emerald-700 tabular-nums">{attempt.accuracy}%</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Date Completed:</span>
                    <div className="font-semibold text-slate-800">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Credential ID: CR-AZ900-{attempt.id.slice(0, 8).toUpperCase()} · Educational Verification
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Print / Save PDF
              </button>

              <button
                onClick={() => setShowCertificate(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Revision Topics Section */}
      {revisionTopics.length > 0 && (
        <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <h2 className="text-base font-bold text-amber-950">
              Suggested Revision Topics ({revisionTopics.length})
            </h2>
          </div>
          <p className="text-xs text-amber-900">
            Based on your answers, reviewing these specific lessons will help you close conceptual gaps before the real AZ-900 exam:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {revisionTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{topic.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{topic.shortDescription}</p>
                </div>
                <button
                  onClick={() => onReviewTopic(topic.id)}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 mt-3 self-start cursor-pointer"
                >
                  <span>Review lesson</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question by Question Detailed Breakdown */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Detailed Answer Review</h2>

        <div className="space-y-3">
          {attempt.answers.map((record, index) => {
            const questionData = PRACTICE_QUESTIONS.find((q) => q.id === record.questionId);
            if (!questionData) return null;

            const isExpanded = expandedQuestionId === record.questionId;
            const topicData = STUDY_TOPICS.find((t) => t.id === record.topicId);

            return (
              <div
                key={record.questionId}
                className={`bg-white rounded-xl border transition-all ${
                  record.isCorrect ? 'border-slate-200' : 'border-rose-200'
                }`}
              >
                {/* Accordion header */}
                <button
                  onClick={() => toggleExpand(record.questionId)}
                  className="w-full p-4 text-left flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {record.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                        <span>Question {index + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>{topicData?.title}</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {questionData.question}
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 text-xs space-y-4 text-slate-700 animate-in fade-in duration-150">
                    <p className="text-slate-900 font-medium text-sm leading-relaxed">
                      {questionData.question}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2">
                      {questionData.options.map((opt) => {
                        const isLearnerPick = record.selectedOption === opt.id;
                        const isCorrectOpt = questionData.correctOption === opt.id;

                        let badge = null;
                        let itemClass = 'border-slate-200 bg-slate-50 text-slate-600';

                        if (isCorrectOpt) {
                          itemClass = 'border-emerald-300 bg-emerald-50/60 text-emerald-950 font-medium';
                          badge = (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Correct Answer
                            </span>
                          );
                        } else if (isLearnerPick && !isCorrectOpt) {
                          itemClass = 'border-rose-300 bg-rose-50/60 text-rose-950';
                          badge = (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                              Your Choice
                            </span>
                          );
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${itemClass}`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-bold">{opt.id}.</span>
                              <span>{opt.text}</span>
                            </div>
                            {badge}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="font-bold text-slate-900 mb-1">Explanation:</div>
                      <p className="leading-relaxed text-slate-700">{questionData.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

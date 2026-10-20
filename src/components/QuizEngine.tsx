import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  AlertCircle,
  Award,
  Timer,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Question, OptionId, QuestionAnswerRecord, QuizAttempt } from '../types';
import { STUDY_TOPICS } from '../data/topics';
import { EXAM_DOMAINS } from '../data/domains';
import {
  isQuestionBookmarked,
  toggleBookmarkQuestionId,
} from '../services/storage';

interface QuizEngineProps {
  questions: Question[];
  quizTitle: string;
  topicId?: string;
  isTimed?: boolean;
  durationMinutes?: number;
  onComplete: (attempt: QuizAttempt) => void;
  onCancel: () => void;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  questions,
  quizTitle,
  topicId,
  isTimed = false,
  durationMinutes = 30,
  onComplete,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<OptionId | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [answersRecord, setAnswersRecord] = useState<QuestionAnswerRecord[]>([]);

  // Duplicate protection set tracking questions scored in this session
  const [processedQuestionIds, setProcessedQuestionIds] = useState<Set<string>>(new Set());

  // Question Navigator Drawer state
  const [showNavGrid, setShowNavGrid] = useState<boolean>(false);

  // Bookmarking state for current question
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  // Timer state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    isTimed ? durationMinutes * 60 : 0
  );

  useEffect(() => {
    if (!isTimed) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto submit
          finalizeQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimed, answersRecord]);

  const currentQ = questions[currentIndex];
  const domain = EXAM_DOMAINS.find((d) => d.id === currentQ?.domainId);
  const topic = STUDY_TOPICS.find((t) => t.id === currentQ?.topicId);

  useEffect(() => {
    if (currentQ) {
      setBookmarked(isQuestionBookmarked(currentQ.id));
    }
  }, [currentIndex, currentQ]);

  const handleToggleBookmark = () => {
    if (!currentQ) return;
    const res = toggleBookmarkQuestionId(currentQ.id);
    setBookmarked(res);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-lg mx-auto">
        <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">No Questions Available</h2>
        <p className="text-sm text-slate-600 mb-6">
          There are currently no practice questions available for this selection.
        </p>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleSelectOption = (optId: OptionId) => {
    if (hasSubmitted) return;
    setSelectedOption(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || hasSubmitted) return;

    if (processedQuestionIds.has(currentQ.id)) {
      return;
    }

    const isCorrect = selectedOption === currentQ.correctOption;
    const answerRecord: QuestionAnswerRecord = {
      questionId: currentQ.id,
      selectedOption,
      correctOption: currentQ.correctOption,
      isCorrect,
      topicId: currentQ.topicId,
      domainId: currentQ.domainId,
    };

    setProcessedQuestionIds((prev) => new Set(prev).add(currentQ.id));
    setAnswersRecord((prev) => [...prev, answerRecord]);
    setHasSubmitted(true);
  };

  const finalizeQuiz = () => {
    const correctCount = answersRecord.filter((a) => a.isCorrect).length;
    const totalCount = questions.length;
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 1000) / 10 : 0;

    const timeSpent = isTimed ? durationMinutes * 60 - secondsRemaining : undefined;

    const finalAttempt: QuizAttempt = {
      id: crypto.randomUUID ? crypto.randomUUID() : `attempt-${Date.now()}`,
      topicId: topicId || 'mixed',
      topicTitle: quizTitle,
      totalQuestions: totalCount,
      correctAnswers: correctCount,
      accuracy,
      completedAt: new Date().toISOString(),
      timeSpentSeconds: timeSpent,
      isTimed,
      answers: answersRecord,
    };

    onComplete(finalAttempt);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
    } else {
      finalizeQuiz();
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Progress & Quit Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {quizTitle}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-sm font-bold text-slate-900">
              Question <span className="tabular-nums">{currentIndex + 1}</span> of{' '}
              <span className="tabular-nums">{questions.length}</span>
            </span>

            {/* Grid view toggle */}
            <button
              onClick={() => setShowNavGrid((v) => !v)}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-0.5 cursor-pointer bg-sky-50 px-2 py-0.5 rounded"
            >
              <span>Question List</span>
              {showNavGrid ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Real-time Timer Badge */}
          {isTimed && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tabular-nums ${
                secondsRemaining < 300
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          )}

          {/* Bookmark Question Button */}
          <button
            onClick={handleToggleBookmark}
            title={bookmarked ? 'Bookmarked' : 'Bookmark this question'}
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current text-amber-500' : ''}`} />
            <span className="hidden sm:inline">{bookmarked ? 'Flagged' : 'Flag'}</span>
          </button>

          <button
            onClick={onCancel}
            className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Question Navigator Drawer / Grid */}
      {showNavGrid && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-700">Question Navigator:</span>
            <span>Click any number to jump</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => {
              const isAnswered = answersRecord.some((a) => a.questionId === q.id);
              const isCurrent = idx === currentIndex;
              const isFlagged = isQuestionBookmarked(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setSelectedOption(null);
                    setHasSubmitted(answersRecord.some((a) => a.questionId === q.id));
                    setShowNavGrid(false);
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-sky-600 text-white ring-2 ring-sky-600/30'
                      : isAnswered
                      ? 'bg-slate-200 text-slate-800'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-sky-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Context metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-sky-700">{domain?.shortTitle}</span>
          <span aria-hidden="true">·</span>
          <span>{topic?.title || currentQ?.subtopic}</span>
          <span aria-hidden="true">·</span>
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
            {currentQ?.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {currentQ?.question}
        </h3>

        {/* Options List (A, B, C, D) */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((option) => {
            const isSelected = selectedOption === option.id;
            const isCorrect = option.id === currentQ.correctOption;

            let optionStyle =
              'border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-slate-50';

            if (!hasSubmitted) {
              if (isSelected) {
                optionStyle = 'border-sky-600 bg-sky-50/70 text-sky-950 ring-2 ring-sky-600/20';
              }
            } else {
              // Feedback mode
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium ring-2 ring-emerald-500/20';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-red-400 bg-red-50/80 text-red-950 ring-2 ring-red-400/20';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={hasSubmitted}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${optionStyle}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                    !hasSubmitted
                      ? isSelected
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                      : isCorrect
                      ? 'bg-emerald-600 text-white'
                      : isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {option.id}
                </div>

                <div className="text-sm leading-relaxed pt-0.5 flex-1">{option.text}</div>

                {hasSubmitted && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasSubmitted && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Controls & Immediate Feedback Section */}
        {!hasSubmitted ? (
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-500">
              {selectedOption ? 'Choice selected. Click to submit.' : 'Choose one answer above.'}
            </span>
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm ${
                selectedOption
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="space-y-5 pt-4 border-t border-slate-200 animate-in fade-in duration-200">
            {/* Answer status alert */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                selectedOption === currentQ.correctOption
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : 'bg-red-50/90 border-red-200 text-red-950'
              }`}
            >
              {selectedOption === currentQ.correctOption ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-bold text-sm">
                  {selectedOption === currentQ.correctOption ? 'Correct!' : 'Incorrect'}
                </div>
                <div className="text-xs mt-1 leading-relaxed">{currentQ.explanation}</div>
              </div>
            </div>

            {/* Why other options were incorrect (Distractor breakdown) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Option Breakdown & Distractor Analysis:
              </div>
              <div className="space-y-1.5 text-xs text-slate-700">
                {currentQ.options.map((opt) => (
                  <div key={opt.id} className="flex items-start gap-2">
                    <span className="font-bold text-slate-900 shrink-0">{opt.id}:</span>
                    <span className="text-slate-600">{currentQ.distractorExplanations[opt.id]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next question button */}
            <div className="flex items-center justify-end">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isLastQuestion ? 'View Final Results' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LearnView } from './components/LearnView';
import { QuizEngine } from './components/QuizEngine';
import { QuizResults } from './components/QuizResults';
import { QuizLauncher } from './components/QuizLauncher';
import { ProgressView } from './components/ProgressView';
import { AboutView } from './components/AboutView';
import { FlashcardCoach } from './components/FlashcardCoach';
import { StudyPlanner } from './components/StudyPlanner';
import { AIStudyBuddy } from './components/AIStudyBuddy';
import {
  getAllTopicProgress,
  getAllQuizAttempts,
  getOverallStats,
  getLastStudiedTopicId,
  saveQuizAttempt,
  resetLocalProgress,
} from './services/storage';
import { STUDY_TOPICS } from './data/topics';
import { PRACTICE_QUESTIONS } from './data/questions';
import { EXAM_DOMAINS } from './data/domains';
import {
  OverallStats,
  TopicProgress,
  QuizAttempt,
  Question,
  DomainId,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Application Data States
  const [stats, setStats] = useState<OverallStats>(getOverallStats());
  const [progressMap, setProgressMap] = useState<Record<string, TopicProgress>>(getAllTopicProgress());
  const [attempts, setAttempts] = useState<QuizAttempt[]>(getAllQuizAttempts());
  const [lastStudiedTopicId, setLastStudiedTopicIdState] = useState<string | null>(getLastStudiedTopicId());

  // Learn Mode Reader State
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<{
    questions: Question[];
    title: string;
    topicId?: string;
    isTimed?: boolean;
    durationMinutes?: number;
  } | null>(null);

  // Current Quiz Results State
  const [currentResultAttempt, setCurrentResultAttempt] = useState<QuizAttempt | null>(null);

  // Sync state helper
  const refreshStorageData = () => {
    setStats(getOverallStats());
    setProgressMap(getAllTopicProgress());
    setAttempts(getAllQuizAttempts());
    setLastStudiedTopicIdState(getLastStudiedTopicId());
  };

  // Launch Quiz Helper
  const handleStartQuiz = (options?: {
    topicId?: string;
    domainId?: DomainId;
    count?: number;
    isTimed?: boolean;
    durationMinutes?: number;
  }) => {
    setCurrentResultAttempt(null);
    setActiveTab('quiz');

    if (!options) {
      // Show quiz launcher selector
      setActiveQuiz(null);
      return;
    }

    if (options.topicId) {
      const topic = STUDY_TOPICS.find((t) => t.id === options.topicId);
      const topicQuestions = PRACTICE_QUESTIONS.filter((q) => q.topicId === options.topicId);
      setActiveQuiz({
        questions: topicQuestions,
        title: `${topic?.title || 'Topic'} Knowledge Check`,
        topicId: options.topicId,
        isTimed: options.isTimed,
        durationMinutes: options.durationMinutes,
      });
    } else if (options.domainId) {
      const dom = EXAM_DOMAINS.find((d) => d.id === options.domainId);
      const domainQuestions = PRACTICE_QUESTIONS.filter((q) => q.domainId === options.domainId);
      const count = options.count || domainQuestions.length;
      const shuffled = [...domainQuestions].sort(() => 0.5 - Math.random()).slice(0, count);

      setActiveQuiz({
        questions: shuffled,
        title: `${dom?.shortTitle || 'Domain'} Practice Quiz`,
        topicId: options.domainId,
        isTimed: options.isTimed,
        durationMinutes: options.durationMinutes,
      });
    } else if (options.count) {
      const count = options.count;
      const shuffled = [...PRACTICE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, count);
      setActiveQuiz({
        questions: shuffled,
        title: count <= 10 ? '10-Question Diagnostic Quiz' : 'Full 25-Question Practice Exam',
        topicId: 'mixed',
        isTimed: options.isTimed,
        durationMinutes: options.durationMinutes,
      });
    }
  };

  // Handle quiz completion
  const handleQuizComplete = (attempt: QuizAttempt) => {
    saveQuizAttempt(attempt);
    refreshStorageData();
    setActiveQuiz(null);
    setCurrentResultAttempt(attempt);
  };

  // Handle reset progress
  const handleResetProgress = () => {
    resetLocalProgress();
    refreshStorageData();
    setCurrentResultAttempt(null);
    setActiveQuiz(null);
  };

  // Select topic to open in Learn Reader
  const handleSelectTopicInLearn = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('learn');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 3-Zone Header */}
      <Header
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          // If navigating away from quiz, keep or reset cleanly
          if (tab !== 'quiz') {
            setActiveQuiz(null);
            setCurrentResultAttempt(null);
          }
        }}
        onStartQuiz={() => handleStartQuiz({ count: 10 })}
      />

      {/* Main Viewport Container (1440px max baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            progressMap={progressMap}
            lastStudiedTopicId={lastStudiedTopicId}
            onStartLearning={() => {
              setActiveTab('learn');
              setSelectedTopicId(null);
            }}
            onSelectTopic={handleSelectTopicInLearn}
            onStartQuiz={handleStartQuiz}
            onNavigateToTab={(tab) => setActiveTab(tab as NavTab)}
          />
        )}

        {/* TAB 2: LEARN */}
        {activeTab === 'learn' && (
          <LearnView
            progressMap={progressMap}
            selectedTopicId={selectedTopicId}
            onSelectTopic={setSelectedTopicId}
            onStartTopicQuiz={(topicId) => handleStartQuiz({ topicId })}
          />
        )}

        {/* TAB: FLASHCARD COACH */}
        {activeTab === 'flashcards' && <FlashcardCoach />}

        {/* TAB: PERSONAL STUDY PLANNER */}
        {activeTab === 'planner' && (
          <StudyPlanner
            stats={stats}
            progressMap={progressMap}
            onSelectTopic={handleSelectTopicInLearn}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {/* TAB: AI STUDY BUDDY */}
        {activeTab === 'studybuddy' && <AIStudyBuddy />}

        {/* TAB 3: PRACTICE QUIZ */}
        {activeTab === 'quiz' && (
          <div>
            {currentResultAttempt ? (
              <QuizResults
                attempt={currentResultAttempt}
                onRetake={() => {
                  const retryQuestions = PRACTICE_QUESTIONS.filter((q) =>
                    currentResultAttempt.answers.some((a) => a.questionId === q.id)
                  );
                  setCurrentResultAttempt(null);
                  setActiveQuiz({
                    questions: retryQuestions.length > 0 ? retryQuestions : PRACTICE_QUESTIONS.slice(0, 10),
                    title: `Retake: ${currentResultAttempt.topicTitle}`,
                    topicId: currentResultAttempt.topicId,
                  });
                }}
                onPracticeMissed={(missedQuestions) => {
                  setCurrentResultAttempt(null);
                  setActiveQuiz({
                    questions: missedQuestions,
                    title: 'Targeted Mistakes Practice Drill',
                    topicId: 'missed',
                  });
                }}
                onReviewTopic={(topicId) => {
                  setCurrentResultAttempt(null);
                  handleSelectTopicInLearn(topicId);
                }}
                onGoToDashboard={() => {
                  setCurrentResultAttempt(null);
                  setActiveTab('dashboard');
                }}
              />
            ) : activeQuiz ? (
              <QuizEngine
                questions={activeQuiz.questions}
                quizTitle={activeQuiz.title}
                topicId={activeQuiz.topicId}
                isTimed={activeQuiz.isTimed}
                durationMinutes={activeQuiz.durationMinutes}
                onComplete={handleQuizComplete}
                onCancel={() => {
                  setActiveQuiz(null);
                  setActiveTab('dashboard');
                }}
              />
            ) : (
              <QuizLauncher
                onLaunch={(questions, title, topicId, isTimed, durationMinutes) => {
                  setActiveQuiz({
                    questions,
                    title,
                    topicId,
                    isTimed,
                    durationMinutes,
                  });
                }}
                onBrowseLessons={() => {
                  setActiveTab('learn');
                }}
              />
            )}
          </div>
        )}

        {/* TAB 4: PROGRESS & DATABASE */}
        {activeTab === 'progress' && (
          <ProgressView
            stats={stats}
            progressMap={progressMap}
            attempts={attempts}
            onReviewTopic={handleSelectTopicInLearn}
            onResetProgress={handleResetProgress}
            onStartQuiz={() => handleStartQuiz({ count: 10 })}
          />
        )}

        {/* TAB 5: ABOUT & PROJECT */}
        {activeTab === 'about' && (
          <AboutView
            onStartLearning={() => {
              setActiveTab('learn');
            }}
            onStartQuiz={() => handleStartQuiz({ count: 10 })}
          />
        )}
      </main>

      {/* Clean, Restrained Footer with Responsible Branding */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-bold text-slate-900">
              CloudReady — AZ-900 Exam Preparation
            </div>
            <p className="text-[11px] text-slate-400 max-w-xl">
              Independent community project for the Vibe Coding Hackathon: AZ-900 Edition (#1MillionDevs). Not affiliated with or endorsed by Microsoft.
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <button
              onClick={() => {
                setActiveTab('learn');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Syllabus
            </button>
            <button
              onClick={() => {
                setActiveTab('progress');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              SQL Schema
            </button>
            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-900 cursor-pointer"
            >
              Disclaimer
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

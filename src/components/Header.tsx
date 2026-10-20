import React from 'react';
import { Cloud, BookOpen, CheckCircle2, BarChart2, Info, Play, Brain, Calendar, Bot } from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'learn'
  | 'flashcards'
  | 'planner'
  | 'studybuddy'
  | 'quiz'
  | 'progress'
  | 'about';

interface HeaderProps {
  activeTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  onStartQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onNavigate, onStartQuiz }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single text element wordmark with icon) */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-sky-700 transition-colors">
            <Cloud className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Cloud<span className="text-sky-600">Ready</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'dashboard'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('learn')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'learn'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            Learn Topics
          </button>
          <button
            onClick={() => onNavigate('flashcards')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'flashcards'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-sky-600" />
            <span>Flashcards</span>
          </button>
          <button
            onClick={() => onNavigate('planner')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'planner'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Study Planner</span>
          </button>
          <button
            onClick={() => onNavigate('studybuddy')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 flex items-center gap-1 ${
              activeTab === 'studybuddy'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-sky-600" />
            <span>AI Study Buddy</span>
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'quiz'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            Practice Quiz
          </button>
          <button
            onClick={() => onNavigate('progress')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'progress'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            Progress & DB
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'about'
                ? 'text-sky-700 font-bold border-b-2 border-sky-600'
                : 'hover:text-slate-900'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartQuiz}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Practice Quiz</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Sub-bar */}
      <div className="lg:hidden flex items-center justify-around overflow-x-auto border-t border-slate-100 py-2 px-2 bg-slate-50/90 text-[11px] font-medium text-slate-600">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'dashboard' ? 'text-sky-600 font-bold' : ''}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => onNavigate('learn')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'learn' ? 'text-sky-600 font-bold' : ''}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Learn</span>
        </button>
        <button
          onClick={() => onNavigate('flashcards')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'flashcards' ? 'text-sky-600 font-bold' : ''}`}
        >
          <Brain className="w-4 h-4" />
          <span>Flashcards</span>
        </button>
        <button
          onClick={() => onNavigate('planner')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'planner' ? 'text-sky-600 font-bold' : ''}`}
        >
          <Calendar className="w-4 h-4" />
          <span>Planner</span>
        </button>
        <button
          onClick={() => onNavigate('studybuddy')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'studybuddy' ? 'text-sky-600 font-bold' : ''}`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Buddy</span>
        </button>
        <button
          onClick={() => onNavigate('quiz')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'quiz' ? 'text-sky-600 font-bold' : ''}`}
        >
          <Play className="w-4 h-4" />
          <span>Quiz</span>
        </button>
        <button
          onClick={() => onNavigate('progress')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'progress' ? 'text-sky-600 font-bold' : ''}`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Progress</span>
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 ${activeTab === 'about' ? 'text-sky-600 font-bold' : ''}`}
        >
          <Info className="w-4 h-4" />
          <span>About</span>
        </button>
      </div>
    </header>
  );
};

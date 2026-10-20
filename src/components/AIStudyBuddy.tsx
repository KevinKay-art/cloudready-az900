import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Languages,
  Bot,
  User,
  Lightbulb,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Globe,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  provider?: string;
  language?: string;
}

export const AIStudyBuddy: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Habari! I am JazaCloud, your AI Azure Study Buddy. I explain AZ-900 cloud concepts simply using relatable African analogies (like M-Pesa, matatus, local solar grids, and market stalls). You can ask me in English, Swahili, Sheng, or French!',
      provider: 'JazaCloud AI',
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'sw' | 'sheng' | 'fr'>('en');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const samplePrompts = [
    {
      title: 'IaaS vs PaaS vs SaaS',
      prompt: 'Explain IaaS, PaaS, and SaaS using a market stall or kiosk analogy.',
    },
    {
      title: 'M-Pesa & Elasticity',
      prompt: 'How does cloud elasticity relate to M-Pesa handling payday transaction surges?',
    },
    {
      title: 'Availability Zones',
      prompt: 'Why do we need Availability Zones? Give an example using Nairobi data centers.',
    },
    {
      title: 'CapEx vs OpEx',
      prompt: 'Explain CapEx vs OpEx using solar home systems and monthly electricity bills.',
    },
  ];

  const handleSend = async (questionToSend?: string) => {
    const q = questionToSend || inputQuestion;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/study-buddy/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.trim(),
          language: selectedLanguage,
        }),
      });

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'Pole sana! I could not generate an answer right now. Please try again.',
        provider: data.provider || 'Gemini 3.8 Flash',
        language: selectedLanguage,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Notice: Could not reach backend server. Please verify your connection.',
          provider: 'Offline Engine',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600">
          <Bot className="w-4 h-4" />
          <span>Challenge: AI Study Buddy (African Real-World Context)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          JazaCloud AI Coach
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Simplifying abstract Azure concepts with real-world African analogies and multilingual explanations.
        </p>
      </div>

      {/* Language Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Globe className="w-4 h-4 text-sky-600" />
          <span>Select Explanation Language:</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {[
            { id: 'en', label: 'English (African Context)' },
            { id: 'sw', label: 'Kiswahili' },
            { id: 'sheng', label: 'Sheng (Nairobi)' },
            { id: 'fr', label: 'Français' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedLanguage === lang.id
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Suggested Analogies:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.prompt)}
              className="p-2.5 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-xl text-left transition-all cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-900">{p.title}</div>
              <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">Click to ask</div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[460px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
          {messages.map((m) => {
            const isBot = m.sender === 'assistant';

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isBot ? 'bg-sky-600 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 space-y-2 ${
                    isBot
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-sky-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">{m.text}</p>

                  {isBot && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[10px] text-slate-400">
                      <span>{m.provider || 'JazaCloud AI'}</span>
                      <button
                        onClick={() => copyText(m.id, m.text)}
                        className="hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-600" />
              <span>JazaCloud is formulating an explanation with African examples...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputQuestion}
            onChange={(e) => setInputQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about AZ-900 (e.g., 'What is Azure Arc in simple terms?')..."
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuestion.trim() || isLoading}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};

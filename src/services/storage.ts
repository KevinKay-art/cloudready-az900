import {
  OverallStats,
  QuizAttempt,
  TopicProgress,
  QuestionAnswerRecord,
} from '../types';
import { STUDY_TOPICS } from '../data/topics';
import { getSupabaseClient, getCurrentSupabaseUser } from './supabase';

const STORAGE_KEY_PROGRESS = 'cloudready_topic_progress_v1';
const STORAGE_KEY_ATTEMPTS = 'cloudready_quiz_attempts_v1';
const STORAGE_KEY_LAST_TOPIC = 'cloudready_last_studied_topic_v1';

// Calculate Accuracy Helper: (correct / answered) * 100
export function calculateAccuracy(correct: number, answered: number): number | null {
  if (!answered || answered <= 0) return null;
  const pct = (correct / answered) * 100;
  return Math.round(pct * 10) / 10; // 1 decimal place
}

export function formatAccuracy(accuracy: number | null): string {
  if (accuracy === null || isNaN(accuracy)) {
    return 'Not enough data';
  }
  return `${accuracy}%`;
}

// 1. Topic Progress In-Memory & LocalStorage
export function getAllTopicProgress(): Record<string, TopicProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read topic progress from localStorage', e);
    return {};
  }
}

export function saveAllTopicProgress(data: Record<string, TopicProgress>): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save topic progress to localStorage', e);
  }
}

// 2. Quiz Attempts History
export function getAllQuizAttempts(): QuizAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read quiz attempts from localStorage', e);
    return [];
  }
}

export function saveQuizAttempt(attempt: QuizAttempt): void {
  try {
    const current = getAllQuizAttempts();
    const updated = [attempt, ...current];
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(updated));

    // Also update topic progress for all questions in this attempt
    const progressMap = getAllTopicProgress();
    const processedQuestionIds = new Set<string>();

    for (const ans of attempt.answers) {
      if (processedQuestionIds.has(ans.questionId)) {
        continue; // duplicate safety guard
      }
      processedQuestionIds.add(ans.questionId);

      const topicId = ans.topicId;
      const prev = progressMap[topicId] || {
        topicId,
        questionsAnswered: 0,
        questionsCorrect: 0,
        lastStudiedAt: new Date().toISOString(),
      };

      prev.questionsAnswered += 1;
      if (ans.isCorrect) {
        prev.questionsCorrect += 1;
      }
      prev.lastStudiedAt = new Date().toISOString();
      progressMap[topicId] = prev;
    }

    saveAllTopicProgress(progressMap);

    // Save as last studied topic
    if (attempt.topicId && attempt.topicId !== 'mixed' && !attempt.topicId.startsWith('domain_')) {
      setLastStudiedTopicId(attempt.topicId);
    }

    // Try cloud sync if Supabase is connected
    syncAttemptToSupabase(attempt).catch((err) => {
      console.warn('Supabase background attempt sync warning:', err);
    });
  } catch (e) {
    console.error('Failed to save quiz attempt', e);
  }
}

// 3. Record Single Question Answer (during topic quizzes)
export function recordSingleAnswer(ans: QuestionAnswerRecord): void {
  const progressMap = getAllTopicProgress();
  const prev = progressMap[ans.topicId] || {
    topicId: ans.topicId,
    questionsAnswered: 0,
    questionsCorrect: 0,
    lastStudiedAt: new Date().toISOString(),
  };

  prev.questionsAnswered += 1;
  if (ans.isCorrect) {
    prev.questionsCorrect += 1;
  }
  prev.lastStudiedAt = new Date().toISOString();
  progressMap[ans.topicId] = prev;

  saveAllTopicProgress(progressMap);
  setLastStudiedTopicId(ans.topicId);

  // Sync to Supabase in background
  syncTopicProgressToSupabase(prev).catch((err) => {
    console.warn('Supabase progress sync warning:', err);
  });
}

// 4. Resume Studying Tracker
export function getLastStudiedTopicId(): string | null {
  return localStorage.getItem(STORAGE_KEY_LAST_TOPIC);
}

export function setLastStudiedTopicId(topicId: string): void {
  localStorage.setItem(STORAGE_KEY_LAST_TOPIC, topicId);
}

// 5. Aggregate Dashboard Stats
export function getOverallStats(): OverallStats {
  const progressMap = getAllTopicProgress();
  const attempts = getAllQuizAttempts();

  let totalAnswered = 0;
  let totalCorrect = 0;

  let weakestCandidate: {
    topicId: string;
    topicTitle: string;
    accuracy: number;
    answered: number;
  } | null = null;

  let minAccuracy = 101;

  for (const topic of STUDY_TOPICS) {
    const p = progressMap[topic.id];
    if (p && p.questionsAnswered > 0) {
      totalAnswered += p.questionsAnswered;
      totalCorrect += p.questionsCorrect;

      // Weakest topic criterion: at least 3 questions answered
      const topicAcc = (p.questionsCorrect / p.questionsAnswered) * 100;
      if (p.questionsAnswered >= 3 && topicAcc < minAccuracy) {
        minAccuracy = topicAcc;
        weakestCandidate = {
          topicId: topic.id,
          topicTitle: topic.title,
          accuracy: Math.round(topicAcc * 10) / 10,
          answered: p.questionsAnswered,
        };
      }
    }
  }

  const overallAccuracy = calculateAccuracy(totalCorrect, totalAnswered);

  // Recommended next topic:
  // If weakest topic exists with accuracy < 75%, recommend revising it!
  // Otherwise recommend an unstudied topic, or the next sequential topic!
  let recommendedTopic: OverallStats['recommendedTopic'] = null;

  if (weakestCandidate && weakestCandidate.accuracy < 75) {
    recommendedTopic = {
      topicId: weakestCandidate.topicId,
      topicTitle: weakestCandidate.topicTitle,
      reason: `Accuracy is currently ${weakestCandidate.accuracy}%. Strengthen your score with another pass.`,
    };
  } else {
    // Find first unstudied topic
    const unstudied = STUDY_TOPICS.find((t) => !progressMap[t.id] || progressMap[t.id].questionsAnswered === 0);
    if (unstudied) {
      recommendedTopic = {
        topicId: unstudied.id,
        topicTitle: unstudied.title,
        reason: 'You have not answered practice questions on this topic yet.',
      };
    } else if (STUDY_TOPICS.length > 0) {
      // All studied; pick the one with lowest accuracy regardless of threshold
      let lowestAcc = 101;
      let lowestTopic = STUDY_TOPICS[0];
      for (const t of STUDY_TOPICS) {
        const p = progressMap[t.id];
        const acc = p && p.questionsAnswered > 0 ? (p.questionsCorrect / p.questionsAnswered) * 100 : 0;
        if (acc < lowestAcc) {
          lowestAcc = acc;
          lowestTopic = t;
        }
      }
      recommendedTopic = {
        topicId: lowestTopic.id,
        topicTitle: lowestTopic.title,
        reason: `Great progress! Review this topic to boost overall mastery.`,
      };
    }
  }

  return {
    totalAnswered,
    totalCorrect,
    accuracy: overallAccuracy,
    quizzesCompleted: attempts.length,
    weakestTopic: weakestCandidate,
    recommendedTopic,
  };
}

// 6. Reset all progress
export function resetLocalProgress(): void {
  localStorage.removeItem(STORAGE_KEY_PROGRESS);
  localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
  localStorage.removeItem(STORAGE_KEY_LAST_TOPIC);
}

// 7. Supabase Synchronizers
async function syncAttemptToSupabase(attempt: QuizAttempt): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  const user = await getCurrentSupabaseUser();
  if (!user) return;

  await client.from('quiz_attempts').insert({
    user_id: user.id,
    topic_id: attempt.topicId,
    topic_title: attempt.topicTitle,
    total_questions: attempt.totalQuestions,
    correct_answers: attempt.correctAnswers,
    accuracy: attempt.accuracy,
    completed_at: attempt.completedAt,
  });
}

async function syncTopicProgressToSupabase(progress: TopicProgress): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;
  const user = await getCurrentSupabaseUser();
  if (!user) return;

  await client.from('study_progress').upsert(
    {
      user_id: user.id,
      topic_id: progress.topicId,
      questions_answered: progress.questionsAnswered,
      questions_correct: progress.questionsCorrect,
      updated_at: progress.lastStudiedAt,
    },
    { onConflict: 'user_id,topic_id' }
  );
}

// 8. Bookmarking Functionality
const STORAGE_KEY_BOOKMARKS = 'cloudready_bookmarked_questions_v1';

export function getBookmarkedQuestionIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function toggleBookmarkQuestionId(questionId: string): boolean {
  try {
    const current = getBookmarkedQuestionIds();
    const set = new Set(current);
    let bookmarked = false;
    if (set.has(questionId)) {
      set.delete(questionId);
      bookmarked = false;
    } else {
      set.add(questionId);
      bookmarked = true;
    }
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(Array.from(set)));
    return bookmarked;
  } catch {
    return false;
  }
}

export function isQuestionBookmarked(questionId: string): boolean {
  const list = getBookmarkedQuestionIds();
  return list.includes(questionId);
}

// 9. Missed Questions Extractor across attempts
export function getAllMissedQuestionIds(): string[] {
  const attempts = getAllQuizAttempts();
  const missedSet = new Set<string>();
  const correctSet = new Set<string>();

  // Process attempts from oldest to newest
  const sorted = [...attempts].reverse();
  for (const att of sorted) {
    for (const ans of att.answers) {
      if (ans.isCorrect) {
        correctSet.add(ans.questionId);
        missedSet.delete(ans.questionId); // Mastered on later try!
      } else {
        missedSet.add(ans.questionId);
      }
    }
  }

  return Array.from(missedSet);
}


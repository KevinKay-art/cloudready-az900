export type DomainId = 'domain_1' | 'domain_2' | 'domain_3';

export interface ExamDomain {
  id: DomainId;
  code: string;
  title: string;
  shortTitle: string;
  weight: string;
  approxPercentage: number;
  description: string;
  color: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface StudyTopic {
  id: string;
  domainId: DomainId;
  title: string;
  shortDescription: string;
  fullExplanation: string[];
  realWorldExample: string;
  keyTerms: KeyTerm[];
  commonMisconception: {
    trap: string;
    reality: string;
  };
  recapPoints: string[];
  readingTimeMinutes: number;
  iconName: string;
}

export type OptionId = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  id: OptionId;
  text: string;
}

export interface Question {
  id: string;
  topicId: string;
  domainId: DomainId;
  question: string;
  options: QuestionOption[];
  correctOption: OptionId;
  explanation: string;
  distractorExplanations: Record<OptionId, string>;
  difficulty: 'Beginner' | 'Intermediate';
  subtopic: string;
}

export interface QuestionAnswerRecord {
  questionId: string;
  selectedOption: OptionId;
  correctOption: OptionId;
  isCorrect: boolean;
  topicId: string;
  domainId: DomainId;
}

export interface QuizAttempt {
  id: string;
  topicId: string; // topic id or 'mixed' or 'domain_1' etc
  topicTitle: string;
  domainId?: DomainId | 'all';
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  completedAt: string; // ISO string
  timeSpentSeconds?: number;
  isTimed?: boolean;
  answers: QuestionAnswerRecord[];
}

export interface TopicProgress {
  topicId: string;
  questionsAnswered: number;
  questionsCorrect: number;
  lastStudiedAt: string;
}

export interface OverallStats {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number | null; // null if 0 answered
  quizzesCompleted: number;
  weakestTopic: {
    topicId: string;
    topicTitle: string;
    accuracy: number;
    answered: number;
  } | null;
  recommendedTopic: {
    topicId: string;
    topicTitle: string;
    reason: string;
  } | null;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
  lastSyncAt: string | null;
}

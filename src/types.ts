export type TopicColor = 'red' | 'blue' | 'gold'
export type LessonSection = 'main' | 'past' | 'followup'
export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface VocabularyCard {
  id: string
  luxembourgish: string
  russian: string
  lodId: string
  lodAudioUrl: string
  lodCachedAudioUrl: string
  exampleLux?: string
  exampleRu?: string
}

export interface VocabularyContext {
  sentenceLux: string
  sentenceRu: string
  answer: string
}

export interface SentenceItem {
  id: string
  questionLux: string
  questionRu: string
  answerLux: string
  answerRu: string
  section: LessonSection
  kind?: 'verified' | 'analogue'
}

export interface Topic {
  id: string
  titleLux: string
  titleRu: string
  eyebrow: string
  color: TopicColor
  icon: 'home' | 'languages' | 'housing' | 'media' | 'leisure' | 'sport' | 'gift' | 'cooking'
  vocabulary: VocabularyCard[]
  sentences: SentenceItem[]
}

export interface CardReview {
  dueAt: number
  intervalDays: number
  ease: number
  repetitions: number
  lapses: number
  lastRating?: Rating
}

export interface DailyActivity {
  date: string
  words: number
  sentences: number
  exam: number
  grammar: number
}

export interface GrammarLessonProgress {
  attempts: number
  bestScore: number
  lastScore: number
  completedAt: number
  dueAt: number
  intervalDays: number
}

export interface GrammarSession {
  lessonId: string
  exerciseIndex: number
  firstTryCorrect: number
}

export interface SentenceDeck {
  order: string[]
  cursor: number
  cycle: number
}

export interface ProgressState {
  reviews: Record<string, CardReview>
  sentenceAttempts: Record<string, { correct: number; total: number }>
  sentenceDecks: Record<string, SentenceDeck>
  sentenceTopic: string
  examRatings: Record<string, 'hard' | 'good' | 'easy'>
  grammarLessons: Record<string, GrammarLessonProgress>
  grammarSession?: GrammarSession
  activity: DailyActivity[]
}

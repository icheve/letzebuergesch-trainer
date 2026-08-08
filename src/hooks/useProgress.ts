import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DailyActivity, GrammarSession, ProgressState, Rating, SentenceDeck } from '../types'
import { nextGrammarProgress } from '../utils/grammar'
import { scheduleReview } from '../utils/srs'

const STORAGE_KEY = 'letzebuergesch-28-progress-v1'
const EMPTY: ProgressState = {
  reviews: {},
  sentenceAttempts: {},
  sentenceDecks: {},
  sentenceTopic: 'all',
  examRatings: {},
  grammarLessons: {},
  activity: [],
}

function localDate(date = new Date()) {
  return date.toLocaleDateString('sv-SE')
}

function loadProgress(): ProgressState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return EMPTY
    const parsed = JSON.parse(saved)
    return {
      ...EMPTY,
      ...parsed,
      sentenceDecks: parsed.sentenceDecks ?? {},
      sentenceTopic: parsed.sentenceTopic ?? 'all',
      grammarLessons: parsed.grammarLessons ?? {},
      grammarSession: parsed.grammarSession,
      activity: (parsed.activity ?? []).map((day: DailyActivity) => ({ ...day, grammar: day.grammar ?? 0 })),
    }
  } catch {
    return EMPTY
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const addActivity = useCallback((field: keyof Omit<DailyActivity, 'date'>) => {
    setProgress((current) => {
      const date = localDate()
      const existing = current.activity.find((day) => day.date === date)
      const activity = existing
        ? current.activity.map((day) => day.date === date ? { ...day, [field]: day[field] + 1 } : day)
        : [...current.activity, { date, words: 0, sentences: 0, exam: 0, grammar: 0, [field]: 1 }].slice(-180)
      return { ...current, activity }
    })
  }, [])

  const reviewCard = useCallback((cardId: string, rating: Rating) => {
    setProgress((current) => ({
      ...current,
      reviews: { ...current.reviews, [cardId]: scheduleReview(current.reviews[cardId], rating) },
    }))
    addActivity('words')
  }, [addActivity])

  const recordSentence = useCallback((sentenceId: string, correct: boolean) => {
    setProgress((current) => {
      const previous = current.sentenceAttempts[sentenceId] ?? { correct: 0, total: 0 }
      return {
        ...current,
        sentenceAttempts: {
          ...current.sentenceAttempts,
          [sentenceId]: { total: previous.total + 1, correct: previous.correct + (correct ? 1 : 0) },
        },
      }
    })
    addActivity('sentences')
  }, [addActivity])

  const saveSentenceDeck = useCallback((key: string, deck: SentenceDeck) => {
    setProgress((current) => ({
      ...current,
      sentenceDecks: { ...current.sentenceDecks, [key]: deck },
    }))
  }, [])

  const selectSentenceTopic = useCallback((topic: string) => {
    setProgress((current) => ({ ...current, sentenceTopic: topic }))
  }, [])

  const rateExam = useCallback((sentenceId: string, rating: 'hard' | 'good' | 'easy') => {
    setProgress((current) => ({
      ...current,
      examRatings: { ...current.examRatings, [sentenceId]: rating },
    }))
    addActivity('grammar')
  }, [addActivity])

  const saveGrammarSession = useCallback((session?: GrammarSession) => {
    setProgress((current) => ({ ...current, grammarSession: session }))
  }, [])

  const completeGrammarLesson = useCallback((lessonId: string, score: number) => {
    setProgress((current) => ({
      ...current,
      grammarSession: undefined,
      grammarLessons: {
        ...current.grammarLessons,
        [lessonId]: nextGrammarProgress(current.grammarLessons[lessonId], score),
      },
    }))
    addActivity('grammar')
  }, [addActivity])

  const resetProgress = useCallback(() => {
    setProgress(EMPTY)
  }, [])

  const today = useMemo(() => progress.activity.find((day) => day.date === localDate()) ?? {
    date: localDate(), words: 0, sentences: 0, exam: 0, grammar: 0,
  }, [progress.activity])

  return {
    progress,
    today,
    reviewCard,
    recordSentence,
    saveSentenceDeck,
    selectSentenceTopic,
    rateExam,
    saveGrammarSession,
    completeGrammarLesson,
    resetProgress,
  }
}

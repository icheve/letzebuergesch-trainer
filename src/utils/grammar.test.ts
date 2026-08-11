import { describe, expect, it } from 'vitest'
import type { GrammarExercise } from '../data/grammarLessons'
import {
  firstGrammarError,
  firstSpeechError,
  grammarAnswerCorrect,
  grammarProgressLabel,
  nextGrammarProgress,
  normalizeGrammarAnswer,
  normalizeSpeechAnswer,
  speechAnswerCorrect,
} from './grammar'

const exercise: GrammarExercise = {
  id: 'test',
  kind: 'translate',
  promptRu: 'Тест',
  answerLux: 'Ech ginn an d’Stad.',
  explanation: 'Тест',
}

describe('grammar practice', () => {
  it('normalizes apostrophes, case, spaces and punctuation', () => {
    expect(normalizeGrammarAnswer("  ECH ginn an d'Stad! ")).toBe('ech ginn an d’stad')
    expect(grammarAnswerCorrect(exercise, "ech ginn an d'stad")).toBe(true)
  })

  it('points to the first incorrect token', () => {
    expect(firstGrammarError('Ech ginn d’Stad', exercise.answerLux)).toBe('Позиция 3: «d’stad» → «an».')
    expect(firstGrammarError('Ech ginn an', exercise.answerLux)).toBe('Добавьте «d’stad» в позицию 4.')
  })

  it('checks a speech transcript without penalizing punctuation or apostrophe style', () => {
    expect(normalizeSpeechAnswer(" ECH ginn an d' Stad! ")).toBe('ech ginn an d stad')
    expect(speechAnswerCorrect(exercise, 'ech ginn an d Stad')).toBe(true)
    expect(speechAnswerCorrect(exercise, 'ech ginn an Stad')).toBe(false)
    expect(firstSpeechError('ech ginn an Stad', exercise.answerLux)).toBe(
      'Позиция 4: распознано «stad», ожидается «d».',
    )
  })

  it('schedules stronger lessons farther into the future', () => {
    const now = 1_000
    const first = nextGrammarProgress(undefined, 5, now)
    const second = nextGrammarProgress(first, 5, now)
    expect(first.intervalDays).toBe(7)
    expect(second.intervalDays).toBe(14)
    expect(grammarProgressLabel(first, now)).toBe('Освоено')
    expect(grammarProgressLabel(first, first.dueAt)).toBe('Пора повторить')
  })
})

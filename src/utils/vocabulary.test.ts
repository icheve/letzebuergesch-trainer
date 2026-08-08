import { describe, expect, it } from 'vitest'
import type { VocabularyCard, VocabularyContext } from '../types'
import {
  clozeVocabularySentence,
  isVocabularyAnswerCorrect,
  normalizeVocabularyAnswer,
  vocabularyHint,
  vocabularyMode,
} from './vocabulary'

const card: VocabularyCard & VocabularyContext = {
  id: 'homeland-heemecht',
  luxembourgish: 'd’Heemecht',
  russian: 'родина',
  lodId: 'HEEMECHT1',
  lodAudioUrl: 'https://lod.lu/uploads/AAC/heemecht1.m4a',
  sentenceLux: 'Meng Heemecht ass Russland.',
  sentenceRu: 'Моя родина — Россия.',
  answer: 'Heemecht',
}

describe('active vocabulary practice', () => {
  it('normalizes apostrophes, case and surrounding punctuation', () => {
    expect(normalizeVocabularyAnswer("  D'heemecht. ")).toBe('d’heemecht')
  })

  it('requires the article in production but accepts the headword in listening', () => {
    expect(isVocabularyAnswerCorrect(card, 'production', 'Heemecht')).toBe(false)
    expect(isVocabularyAnswerCorrect(card, 'production', "d'Heemecht")).toBe(true)
    expect(isVocabularyAnswerCorrect(card, 'listening', 'Heemecht')).toBe(true)
  })

  it('checks the contextual form and builds a cloze sentence', () => {
    expect(isVocabularyAnswerCorrect(card, 'cloze', 'Heemecht')).toBe(true)
    expect(clozeVocabularySentence(card)).toBe('Meng ___ ass Russland.')
  })

  it('keeps the noun article visible in a production hint', () => {
    expect(vocabularyHint(card, 'production')).toBe('Начало ответа: d’H…')
    expect(vocabularyHint({ ...card, luxembourgish: 'den Numm' }, 'production'))
      .toBe('Начало ответа: den N…')
  })

  it('rotates production, context and listening across successful reviews', () => {
    const review = { dueAt: 0, intervalDays: 1, ease: 2.5, repetitions: 1, lapses: 0 }
    expect(vocabularyMode(undefined)).toBe('production')
    expect(vocabularyMode(review)).toBe('cloze')
    expect(vocabularyMode({ ...review, repetitions: 2 })).toBe('listening')
    expect(vocabularyMode({ ...review, repetitions: 3 })).toBe('production')
  })
})

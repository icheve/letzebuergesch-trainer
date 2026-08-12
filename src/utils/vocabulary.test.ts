import { describe, expect, it } from 'vitest'
import type { VocabularyCard, VocabularyContext } from '../types'
import {
  clozeVocabularySentence,
  expectedVocabularyChoice,
  isVocabularyChoiceCorrect,
  normalizeVocabularyAnswer,
  vocabularyChoices,
  vocabularyMode,
} from './vocabulary'

const card: VocabularyCard & VocabularyContext = {
  id: 'homeland-heemecht',
  luxembourgish: 'd’Heemecht',
  russian: 'родина',
  lodId: 'HEEMECHT1',
  lodAudioUrl: 'https://lod.lu/uploads/AAC/heemecht1.m4a',
  lodCachedAudioUrl: './audio/lod/heemecht1.m4a',
  sentenceLux: 'Meng Heemecht ass Russland.',
  sentenceRu: 'Моя родина — Россия.',
  answer: 'Heemecht',
}

const pool = [
  card,
  { ...card, id: 'word-2', luxembourgish: 'séier', russian: 'быстро', answer: 'séier' },
  { ...card, id: 'word-3', luxembourgish: 'haut', russian: 'сегодня', answer: 'haut' },
  { ...card, id: 'word-4', luxembourgish: 'muer', russian: 'завтра', answer: 'muer' },
  { ...card, id: 'word-5', luxembourgish: 'riichtaus', russian: 'прямо', answer: 'riichtaus' },
]

describe('active vocabulary practice', () => {
  it('normalizes apostrophes, case and surrounding punctuation', () => {
    expect(normalizeVocabularyAnswer("  D'heemecht. ")).toBe('d’heemecht')
  })

  it('checks meaning and contextual choices without typed spelling', () => {
    expect(expectedVocabularyChoice(card, 'meaning')).toBe('родина')
    expect(isVocabularyChoiceCorrect(card, 'meaning', 'Родина')).toBe(true)
    expect(isVocabularyChoiceCorrect(card, 'meaning', 'сегодня')).toBe(false)
    expect(isVocabularyChoiceCorrect(card, 'cloze', 'Heemecht')).toBe(true)
  })

  it('builds a cloze sentence regardless of answer capitalization', () => {
    expect(clozeVocabularySentence(card)).toBe('Meng ___ ass Russland.')
    expect(clozeVocabularySentence({ ...card, sentenceLux: 'Muer hunn ech Zäit.', answer: 'muer' }))
      .toBe('___ hunn ech Zäit.')
  })

  it('provides four stable choices including the correct answer', () => {
    const first = vocabularyChoices(card, 'meaning', pool)
    expect(first).toHaveLength(4)
    expect(first).toContain('родина')
    expect(new Set(first).size).toBe(4)
    expect(vocabularyChoices(card, 'meaning', pool)).toEqual(first)
  })

  it('rotates meaning, context and LOD listening across reviews', () => {
    const review = { dueAt: 0, intervalDays: 1, ease: 2.5, repetitions: 1, lapses: 0 }
    expect(vocabularyMode(undefined)).toBe('meaning')
    expect(vocabularyMode(review)).toBe('cloze')
    expect(vocabularyMode({ ...review, repetitions: 2 })).toBe('listening')
    expect(vocabularyMode({ ...review, repetitions: 3 })).toBe('meaning')
  })
})

import type { CardReview, VocabularyCard, VocabularyContext } from '../types'

export type VocabularyMode = 'production' | 'cloze' | 'listening'

type PracticeCard = VocabularyCard & VocabularyContext

export function normalizeVocabularyAnswer(value: string) {
  return value
    .normalize('NFC')
    .trim()
    .replace(/[‘'ʼ´`]/g, '’')
    .replace(/\s+/g, ' ')
    .replace(/^d\s*’\s*/i, 'd’')
    .replace(/[.!?]+$/g, '')
    .toLocaleLowerCase('lb-LU')
}

export function dictionaryHeadword(value: string) {
  return value.replace(/^(d’|d'|de |den )/i, '')
}

export function vocabularyMode(review: CardReview | undefined): VocabularyMode {
  if (!review || review.repetitions === 0) return 'production'
  return (['production', 'cloze', 'listening'] as const)[review.repetitions % 3]
}

export function expectedVocabularyAnswers(card: PracticeCard, mode: VocabularyMode) {
  if (mode === 'cloze') return [card.answer]
  if (mode === 'listening') return [dictionaryHeadword(card.luxembourgish), card.luxembourgish]
  return [card.luxembourgish]
}

export function isVocabularyAnswerCorrect(card: PracticeCard, mode: VocabularyMode, answer: string) {
  const normalized = normalizeVocabularyAnswer(answer)
  return expectedVocabularyAnswers(card, mode)
    .some((expected) => normalizeVocabularyAnswer(expected) === normalized)
}

export function clozeVocabularySentence(card: PracticeCard) {
  return card.sentenceLux.replace(card.answer, '___')
}

export function vocabularyHint(card: PracticeCard, mode: VocabularyMode) {
  if (mode === 'listening') return `Значение: ${card.russian}`
  const answer = expectedVocabularyAnswers(card, mode)[0]
  const articleAndFirstLetter = answer.match(/^(d’|de |den )(.?)/i)
  const visible = articleAndFirstLetter
    ? `${articleAndFirstLetter[1]}${articleAndFirstLetter[2]}`
    : answer.slice(0, 1)
  return `Начало ответа: ${visible}…`
}

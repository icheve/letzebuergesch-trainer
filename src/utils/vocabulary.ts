import type { CardReview, VocabularyCard, VocabularyContext } from '../types'

export type VocabularyMode = 'meaning' | 'cloze' | 'listening'
export type PracticeVocabularyCard = VocabularyCard & VocabularyContext

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

export function vocabularyMode(review: CardReview | undefined): VocabularyMode {
  if (!review || review.repetitions === 0) return 'meaning'
  return (['meaning', 'cloze', 'listening'] as const)[review.repetitions % 3]
}

export function expectedVocabularyChoice(card: PracticeVocabularyCard, mode: VocabularyMode) {
  return mode === 'cloze' ? card.answer : card.russian
}

export function isVocabularyChoiceCorrect(card: PracticeVocabularyCard, mode: VocabularyMode, choice: string) {
  return normalizeVocabularyAnswer(choice) === normalizeVocabularyAnswer(expectedVocabularyChoice(card, mode))
}

export function clozeVocabularySentence(card: PracticeVocabularyCard) {
  const index = card.sentenceLux.toLocaleLowerCase('lb-LU')
    .indexOf(card.answer.toLocaleLowerCase('lb-LU'))
  if (index < 0) return card.sentenceLux
  return `${card.sentenceLux.slice(0, index)}___${card.sentenceLux.slice(index + card.answer.length)}`
}

function stableHash(value: string) {
  let hash = 2166136261
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function stableOrder(values: string[], seed: string) {
  return [...values].sort((left, right) => {
    const difference = stableHash(`${seed}:${left}`) - stableHash(`${seed}:${right}`)
    return difference || left.localeCompare(right, 'lb-LU')
  })
}

export function vocabularyChoices(
  card: PracticeVocabularyCard,
  mode: VocabularyMode,
  pool: PracticeVocabularyCard[],
) {
  const expected = expectedVocabularyChoice(card, mode)
  const seen = new Set([normalizeVocabularyAnswer(expected)])
  const candidates = pool.flatMap((candidate) => {
    const value = mode === 'cloze' ? candidate.answer : candidate.russian
    const normalized = normalizeVocabularyAnswer(value)
    if (!value.trim() || seen.has(normalized)) return []
    seen.add(normalized)
    return [value]
  })
  const distractors = stableOrder(candidates, `${card.id}:${mode}:distractors`).slice(0, 3)
  return stableOrder([expected, ...distractors], `${card.id}:${mode}:choices`)
}

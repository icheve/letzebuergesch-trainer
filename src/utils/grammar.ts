import type { GrammarExercise } from '../data/grammarLessons'
import type { GrammarLessonProgress } from '../types'

export function normalizeGrammarAnswer(value: string) {
  return value
    .normalize('NFC')
    .trim()
    .replace(/[‘'ʼ´`]/g, '’')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .replace(/[.!?]+$/g, '')
    .toLocaleLowerCase('lb-LU')
}

export function grammarAnswerCorrect(exercise: GrammarExercise, answer: string) {
  const accepted = [exercise.answerLux, ...(exercise.acceptedAnswers ?? [])]
  const normalized = normalizeGrammarAnswer(answer)
  return accepted.some((item) => normalizeGrammarAnswer(item) === normalized)
}

export function firstGrammarError(answer: string, expected: string) {
  const actualTokens = normalizeGrammarAnswer(answer).split(' ').filter(Boolean)
  const expectedTokens = normalizeGrammarAnswer(expected).split(' ').filter(Boolean)
  const length = Math.max(actualTokens.length, expectedTokens.length)

  for (let index = 0; index < length; index += 1) {
    if (actualTokens[index] === expectedTokens[index]) continue
    if (!actualTokens[index]) return `Добавьте «${expectedTokens[index]}» в позицию ${index + 1}.`
    if (!expectedTokens[index]) return `Уберите лишнее «${actualTokens[index]}» в позиции ${index + 1}.`
    return `Позиция ${index + 1}: «${actualTokens[index]}» → «${expectedTokens[index]}».`
  }

  return ''
}

export function nextGrammarProgress(
  previous: GrammarLessonProgress | undefined,
  score: number,
  now = Date.now(),
): GrammarLessonProgress {
  const baseInterval = score === 5 ? 7 : score >= 4 ? 3 : 1
  const intervalDays = previous && score >= 4
    ? Math.min(30, Math.max(baseInterval, previous.intervalDays * 2))
    : baseInterval

  return {
    attempts: (previous?.attempts ?? 0) + 1,
    bestScore: Math.max(previous?.bestScore ?? 0, score),
    lastScore: score,
    completedAt: now,
    dueAt: now + intervalDays * 86_400_000,
    intervalDays,
  }
}

export function grammarProgressLabel(progress: GrammarLessonProgress | undefined, now = Date.now()) {
  if (!progress) return 'Новый урок'
  if (progress.dueAt <= now) return 'Пора повторить'
  if (progress.bestScore >= 4) return 'Освоено'
  return 'Нужно закрепить'
}

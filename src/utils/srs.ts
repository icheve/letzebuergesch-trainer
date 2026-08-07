import type { CardReview, Rating } from '../types'

const DAY = 24 * 60 * 60 * 1000

export const newReview = (now = Date.now()): CardReview => ({
  dueAt: now,
  intervalDays: 0,
  ease: 2.5,
  repetitions: 0,
  lapses: 0,
})

export function scheduleReview(current: CardReview | undefined, rating: Rating, now = Date.now()): CardReview {
  const card = current ?? newReview(now)
  let intervalDays = card.intervalDays
  let ease = card.ease
  let repetitions = card.repetitions
  let lapses = card.lapses
  let dueAt = now

  if (rating === 'again') {
    intervalDays = 0
    ease = Math.max(1.3, ease - 0.2)
    repetitions = 0
    lapses += 1
    dueAt = now + 10 * 60 * 1000
  } else if (rating === 'hard') {
    intervalDays = Math.max(1, Math.round((intervalDays || 1) * 1.2))
    ease = Math.max(1.3, ease - 0.15)
    repetitions += 1
    dueAt = now + intervalDays * DAY
  } else if (rating === 'good') {
    intervalDays = repetitions === 0 ? 2 : Math.max(2, Math.round(intervalDays * ease))
    repetitions += 1
    dueAt = now + intervalDays * DAY
  } else {
    intervalDays = repetitions === 0 ? 4 : Math.max(4, Math.round(intervalDays * ease * 1.3))
    ease += 0.15
    repetitions += 1
    dueAt = now + intervalDays * DAY
  }

  return { dueAt, intervalDays, ease, repetitions, lapses, lastRating: rating }
}

export function isDue(review: CardReview | undefined, now = Date.now()) {
  return !review || review.dueAt <= now
}

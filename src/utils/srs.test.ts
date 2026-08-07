import { describe, expect, it } from 'vitest'
import { newReview, scheduleReview } from './srs'

describe('scheduleReview', () => {
  const now = new Date('2026-08-07T12:00:00Z').getTime()

  it('schedules a new good card in two days', () => {
    const result = scheduleReview(undefined, 'good', now)
    expect(result.intervalDays).toBe(2)
    expect(result.repetitions).toBe(1)
  })

  it('resets a forgotten card and records a lapse', () => {
    const learned = { ...newReview(now), intervalDays: 8, repetitions: 3 }
    const result = scheduleReview(learned, 'again', now)
    expect(result.intervalDays).toBe(0)
    expect(result.repetitions).toBe(0)
    expect(result.lapses).toBe(1)
  })
})

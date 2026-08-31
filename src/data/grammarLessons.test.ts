import { describe, expect, it } from 'vitest'
import { grammarLessonById, grammarLessons } from './grammarLessons'

describe('grammar course content', () => {
  it('contains seventeen complete lessons with five varied exercises each', () => {
    expect(grammarLessons).toHaveLength(17)
    expect(grammarLessons.every((lesson) => lesson.exercises.length === 5)).toBe(true)
    expect(grammarLessons.every((lesson) => new Set(lesson.exercises.map((item) => item.kind)).size === 5)).toBe(true)
  })

  it('uses unique lesson and exercise IDs', () => {
    const lessonIds = grammarLessons.map((lesson) => lesson.id)
    const exerciseIds = grammarLessons.flatMap((lesson) => lesson.exercises.map((exercise) => exercise.id))
    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    expect(new Set(exerciseIds).size).toBe(exerciseIds.length)
  })

  it('spirals only through rules introduced in earlier lessons', () => {
    for (const lesson of grammarLessons) {
      for (const previousId of lesson.revisits) {
        expect(grammarLessonById[previousId]).toBeDefined()
        expect(grammarLessonById[previousId].number).toBeLessThan(lesson.number)
      }
      if (lesson.number > 1) expect(lesson.recap).toBeDefined()
    }
  })

  it('provides complete solutions and explanations', () => {
    for (const exercise of grammarLessons.flatMap((lesson) => lesson.exercises)) {
      expect(exercise.answerLux.trim().length).toBeGreaterThan(0)
      expect(exercise.explanation.trim().length).toBeGreaterThan(0)
      if (exercise.kind === 'choice') expect(exercise.options).toContain(exercise.answerLux)
    }
  })
})

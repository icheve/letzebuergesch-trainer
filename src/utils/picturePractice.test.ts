import { describe, expect, it } from 'vitest'
import { pictureExercises } from '../data/pictureExercises'
import { detectedPictureParts, formatCountdown, pictureCoverage } from './picturePractice'

describe('picture practice', () => {
  it('detects structural parts and the final phrase', () => {
    const parts = detectedPictureParts(
      'D’Bild ass dobausse gemaach ginn. Op der Foto gesinn ech e Park. Am Hannergrond si Beem. Ech gesinn fënnef Leit. Si maache Sport. D’Fra huet e gielen T-Shirt un. D’Atmosphär ass frou. Ech fannen d’Foto flott. Ech maache selwer och gär Sport. Dat ass alles.',
      pictureExercises[0],
    )
    expect(parts.size).toBe(10)
    expect(pictureCoverage(parts)).toBe(100)
  })

  it('formats the exam timer', () => {
    expect(formatCountdown(120)).toBe('2:00')
    expect(formatCountdown(29)).toBe('0:29')
  })
})

import { pictureClosing, pictureSteps, type PictureExercise } from '../data/pictureExercises'

export function normalizePictureAnswer(value: string) {
  return value
    .normalize('NFC')
    .replace(/[‘'ʼ´`]/g, '’')
    .replace(/[^\p{L}\p{N}’]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('lb-LU')
}

export function detectedPictureParts(text: string, exercise: PictureExercise) {
  const normalized = normalizePictureAnswer(text)
  if (!normalized) return new Set<string>()

  const detected = new Set<string>()
  for (const step of pictureSteps) {
    if (step.keywords.some((keyword) => normalized.includes(normalizePictureAnswer(keyword)))) {
      detected.add(step.id)
    }
  }
  if (pictureClosing.keywords.some((keyword) => normalized.includes(normalizePictureAnswer(keyword)))) {
    detected.add(pictureClosing.id)
  }

  if (exercise.sceneKeywords.some((keyword) => normalized.includes(normalizePictureAnswer(keyword)))) {
    detected.add('place')
  }
  return detected
}

export function pictureCoverage(parts: Set<string>) {
  return Math.round(parts.size / (pictureSteps.length + 1) * 100)
}

export function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

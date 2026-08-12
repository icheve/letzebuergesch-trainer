export const normalizeAnswer = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .toLocaleLowerCase('lb-LU')

export function splitIntoTiles(sentence: string) {
  return sentence.trim().split(/\s+/)
}

export function shuffle<T>(items: T[], random = Math.random) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1))
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
  }
  return copy
}

let activeRecording: HTMLAudioElement | null = null

async function playAudioUrl(url: string) {
  activeRecording?.pause()

  const recording = new Audio(url)
  activeRecording = recording
  recording.addEventListener('ended', () => {
    if (activeRecording === recording) activeRecording = null
  }, { once: true })

  try {
    await recording.play()
    return true
  } catch {
    if (activeRecording === recording) activeRecording = null
    return false
  }
}

export async function playRecordedAudio(url: string, fallbackUrl?: string) {
  const started = await playAudioUrl(url)
  if (started || !fallbackUrl || fallbackUrl === url) return started
  return playAudioUrl(fallbackUrl)
}

export const normalizeAnswer = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?;:])/g, '$1')
    .toLocaleLowerCase('lb-LU')

export function splitIntoTiles(sentence: string) {
  return sentence.trim().split(/\s+/)
}

export function shuffle<T>(items: T[]) {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
  }
  return copy
}

export function speakLuxembourgish(text: string, rate = 0.82) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices()
  utterance.voice = voices.find((voice) => voice.lang.toLowerCase().startsWith('lb')) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('de')) ?? null
  utterance.lang = utterance.voice?.lang ?? 'lb-LU'
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
  return true
}

let activeRecording: HTMLAudioElement | null = null

export async function playRecordedAudio(url: string) {
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

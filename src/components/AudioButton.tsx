import { useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { playRecordedAudio } from '../utils/text'

export function AudioButton({
  text,
  audioUrl,
  label = 'Озвучка LOD.lu',
}: {
  text: string
  audioUrl?: string
  label?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!audioUrl) {
    return (
      <button
        type="button"
        className="audio-button"
        disabled
        aria-label={`Для «${text}» нет официальной записи LOD.lu`}
        title="Браузерный синтез речи отключён: в проекте используется только официальная озвучка LOD.lu"
      >
        <VolumeX size={18} />
        <span>LOD-аудио пока нет</span>
      </button>
    )
  }

  const play = async () => {
    setFailed(false)
    const started = await playRecordedAudio(audioUrl)
    if (!started) setFailed(true)
  }

  return (
    <button type="button" className="audio-button" onClick={play} aria-label={`${label}: ${text}`} title="Студийная запись Lëtzebuerger Online Dictionnaire">
      <Volume2 size={18} />
      <span>{failed ? 'Аудио недоступно' : label}</span>
    </button>
  )
}

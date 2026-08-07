import { useState } from 'react'
import { Volume2 } from 'lucide-react'
import { playRecordedAudio, speakLuxembourgish } from '../utils/text'

export function AudioButton({
  text,
  audioUrl,
  label = audioUrl ? 'Озвучка LOD.lu' : 'Синтез речи',
}: {
  text: string
  audioUrl?: string
  label?: string
}) {
  const [failed, setFailed] = useState(false)

  const play = async () => {
    setFailed(false)
    const started = audioUrl ? await playRecordedAudio(audioUrl) : speakLuxembourgish(text)
    if (!started) setFailed(true)
  }

  return (
    <button type="button" className="audio-button" onClick={play} aria-label={label} title={audioUrl ? 'Студийная запись Lëtzebuerger Online Dictionnaire' : 'Голосовой движок телефона или браузера'}>
      <Volume2 size={18} />
      <span>{failed ? 'Аудио недоступно' : label}</span>
    </button>
  )
}

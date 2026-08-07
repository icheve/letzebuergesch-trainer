import { Volume2 } from 'lucide-react'
import { speakLuxembourgish } from '../utils/text'

export function AudioButton({ text, label = 'Прослушать' }: { text: string; label?: string }) {
  return (
    <button type="button" className="audio-button" onClick={() => speakLuxembourgish(text)} aria-label={label}>
      <Volume2 size={18} />
      <span>{label}</span>
    </button>
  )
}

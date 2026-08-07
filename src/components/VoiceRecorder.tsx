import { useEffect, useRef, useState } from 'react'
import { CircleStop, Mic, Trash2 } from 'lucide-react'

export function VoiceRecorder() {
  const recorder = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>()
  const [error, setError] = useState('')

  useEffect(() => () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    stream.current?.getTracks().forEach((track) => track.stop())
  }, [audioUrl])

  const start = async () => {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia || !('MediaRecorder' in window)) {
      setError('Запись голоса не поддерживается этим браузером.')
      return
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunks.current = []
      recorder.current = new MediaRecorder(stream.current)
      recorder.current.addEventListener('dataavailable', (event) => chunks.current.push(event.data))
      recorder.current.addEventListener('stop', () => {
        const blob = new Blob(chunks.current, { type: recorder.current?.mimeType || 'audio/webm' })
        if (audioUrl) URL.revokeObjectURL(audioUrl)
        setAudioUrl(URL.createObjectURL(blob))
        stream.current?.getTracks().forEach((track) => track.stop())
      })
      recorder.current.start()
      setRecording(true)
    } catch {
      setError('Разрешите приложению доступ к микрофону.')
    }
  }

  const stop = () => {
    recorder.current?.stop()
    setRecording(false)
  }

  const clear = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(undefined)
  }

  return (
    <div className="voice-recorder">
      {!recording && !audioUrl && (
        <button type="button" className="record-button" onClick={start}><Mic size={18} /> Записать свой ответ</button>
      )}
      {recording && (
        <button type="button" className="record-button recording" onClick={stop}><CircleStop size={18} /> Остановить запись</button>
      )}
      {audioUrl && (
        <div className="recording-result">
          <audio src={audioUrl} controls aria-label="Запись вашего ответа" />
          <button type="button" onClick={clear} aria-label="Удалить запись"><Trash2 size={18} /></button>
        </div>
      )}
      {error && <p className="record-error">{error}</p>}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { Captions, CircleStop, Mic, Trash2 } from 'lucide-react'

interface SpeechRecognitionAlternativeLike {
  transcript: string
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean
  readonly length: number
  readonly [index: number]: SpeechRecognitionAlternativeLike
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number
  readonly results: ArrayLike<SpeechRecognitionResultLike>
}

interface SpeechRecognitionErrorEventLike {
  readonly error: string
}

interface SpeechRecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

interface VoiceRecorderProps {
  onTranscriptChange?: (transcript: string) => void
  onRecordingChange?: (recording: boolean) => void
}

function getSpeechRecognitionConstructor() {
  if (typeof window === 'undefined') return undefined
  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition
}

function recognitionErrorMessage(error: string) {
  if (error === 'not-allowed' || error === 'service-not-allowed') {
    return 'Браузер не разрешил распознавание речи.'
  }
  if (error === 'language-not-supported') {
    return 'Этот браузер пока не распознаёт люксембуржский язык (lb-LU).'
  }
  if (error === 'no-speech') return 'Речь не была распознана. Попробуйте записать ответ ещё раз.'
  if (error === 'network') return 'Сервис распознавания речи сейчас недоступен.'
  return 'Не удалось распознать речь. Запись всё равно можно прослушать и сравнить вручную.'
}

export function VoiceRecorder({ onTranscriptChange, onRecordingChange }: VoiceRecorderProps) {
  const recorder = useRef<MediaRecorder | null>(null)
  const recognition = useRef<SpeechRecognitionLike | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const chunks = useRef<Blob[]>([])
  const finalTranscript = useRef('')
  const audioUrlRef = useRef<string>()
  const onTranscriptChangeRef = useRef(onTranscriptChange)
  const onRecordingChangeRef = useRef(onRecordingChange)
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string>()
  const [transcript, setTranscript] = useState('')
  const [recognitionState, setRecognitionState] = useState<'idle' | 'listening' | 'done' | 'error'>(
    'idle',
  )
  const [recognitionError, setRecognitionError] = useState('')
  const [error, setError] = useState('')
  const [recognitionAvailable] = useState(() => Boolean(getSpeechRecognitionConstructor()))

  useEffect(() => {
    onTranscriptChangeRef.current = onTranscriptChange
    onRecordingChangeRef.current = onRecordingChange
  }, [onRecordingChange, onTranscriptChange])

  useEffect(() => {
    audioUrlRef.current = audioUrl
  }, [audioUrl])

  useEffect(() => () => {
    recognition.current?.abort()
    recognition.current = null
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    stream.current?.getTracks().forEach((track) => track.stop())
  }, [])

  const updateTranscript = (value: string) => {
    const normalized = value.replace(/\s+/g, ' ').trim()
    setTranscript(normalized)
    onTranscriptChangeRef.current?.(normalized)
  }

  const startRecognition = () => {
    const Recognition = getSpeechRecognitionConstructor()
    if (!Recognition) return

    const activeRecognition = new Recognition()
    recognition.current = activeRecognition
    finalTranscript.current = ''
    activeRecognition.lang = 'lb-LU'
    activeRecognition.continuous = true
    activeRecognition.interimResults = true
    activeRecognition.maxAlternatives = 1
    activeRecognition.onresult = (event) => {
      let interimTranscript = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const recognized = result[0]?.transcript ?? ''
        if (result.isFinal) finalTranscript.current = `${finalTranscript.current} ${recognized}`.trim()
        else interimTranscript = `${interimTranscript} ${recognized}`.trim()
      }
      updateTranscript(`${finalTranscript.current} ${interimTranscript}`)
    }
    activeRecognition.onerror = (event) => {
      if (event.error === 'aborted') return
      setRecognitionState('error')
      setRecognitionError(recognitionErrorMessage(event.error))
    }
    activeRecognition.onend = () => {
      if (recognition.current === activeRecognition) recognition.current = null
      setRecognitionState((current) => current === 'error' ? current : 'done')
    }

    try {
      activeRecognition.start()
      setRecognitionState('listening')
    } catch {
      recognition.current = null
      setRecognitionState('error')
      setRecognitionError('Не удалось запустить распознавание речи в этом браузере.')
    }
  }

  const start = async () => {
    setError('')
    setRecognitionError('')
    setRecognitionState('idle')
    updateTranscript('')
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    setAudioUrl(undefined)

    if (!navigator.mediaDevices?.getUserMedia || !('MediaRecorder' in window)) {
      setError('Запись голоса не поддерживается этим браузером.')
      return
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
      chunks.current = []
      const activeRecorder = new MediaRecorder(stream.current)
      recorder.current = activeRecorder
      activeRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) chunks.current.push(event.data)
      })
      activeRecorder.addEventListener('stop', () => {
        const blob = new Blob(chunks.current, { type: activeRecorder.mimeType || 'audio/webm' })
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
        const nextAudioUrl = URL.createObjectURL(blob)
        audioUrlRef.current = nextAudioUrl
        setAudioUrl(nextAudioUrl)
        stream.current?.getTracks().forEach((track) => track.stop())
        stream.current = null
        if (recorder.current === activeRecorder) recorder.current = null
      })
      activeRecorder.start()
      setRecording(true)
      onRecordingChangeRef.current?.(true)
      startRecognition()
    } catch {
      stream.current?.getTracks().forEach((track) => track.stop())
      stream.current = null
      setError('Разрешите приложению доступ к микрофону.')
      onRecordingChangeRef.current?.(false)
    }
  }

  const stop = () => {
    if (recorder.current?.state !== 'inactive') recorder.current?.stop()
    recognition.current?.stop()
    setRecording(false)
    onRecordingChangeRef.current?.(false)
  }

  const clear = () => {
    recognition.current?.abort()
    recognition.current = null
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current)
    audioUrlRef.current = undefined
    setAudioUrl(undefined)
    setRecognitionError('')
    setRecognitionState('idle')
    updateTranscript('')
  }

  return (
    <div className="voice-recorder">
      {!recording && !audioUrl && (
        <button type="button" className="record-button" onClick={start}><Mic size={18} /> Записать и распознать ответ</button>
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

      {recognitionAvailable ? (
        <div className={`speech-recognition-state ${recognitionState}`} aria-live="polite">
          <Captions size={17} aria-hidden="true" />
          <div>
            {recognitionState === 'listening' && !transcript && <p>Слушаю люксембуржскую речь…</p>}
            {transcript && <p><strong>Распознано:</strong> <span lang="lb">{transcript}</span></p>}
            {recognitionState === 'done' && !transcript && !recognitionError && (
              <p>Текст не распознан. Прослушайте запись и сравните ответ вручную.</p>
            )}
            {recognitionError && <p>{recognitionError}</p>}
          </div>
        </div>
      ) : (
        <div className="speech-recognition-state unsupported">
          <Captions size={17} aria-hidden="true" />
          <p>В этом браузере нет автоматического распознавания. Запись можно прослушать и сравнить вручную.</p>
        </div>
      )}
      {error && <p className="record-error">{error}</p>}
    </div>
  )
}

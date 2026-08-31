import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ListChecks,
  Mic2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react'
import {
  pictureClosing,
  pictureExercises,
  pictureSteps,
  type PictureExercise,
} from '../data/pictureExercises'
import type { PicturePracticeMode, PicturePracticeProgress } from '../types'
import { detectedPictureParts, formatCountdown, pictureCoverage } from '../utils/picturePractice'
import { VoiceRecorder } from './VoiceRecorder'

const modeMeta: Record<PicturePracticeMode, { title: string; text: string; icon: typeof Eye; badge: string }> = {
  guided: {
    title: 'С опорой',
    text: 'Идите по девяти шагам, используйте начала фраз и при необходимости открывайте образец.',
    icon: ListChecks,
    badge: 'Без таймера',
  },
  memory: {
    title: 'По памяти',
    text: 'Видна только фотография. На полный ответ даётся две минуты.',
    icon: Mic2,
    badge: '2 минуты',
  },
  exam: {
    title: 'Экзамен',
    text: '30 секунд на подготовку, затем две минуты на ответ и проверка структуры.',
    icon: ShieldCheck,
    badge: '30 сек + 2 мин',
  },
}

function fullSample(exercise: PictureExercise) {
  return [...exercise.sampleByStep, pictureClosing.phrase]
}

function PictureLibrary({
  progress,
  onOpen,
}: {
  progress: Record<string, PicturePracticeProgress>
  onOpen: (exercise: PictureExercise) => void
}) {
  const completed = pictureExercises.filter((exercise) => (progress[exercise.id]?.bestCoverage ?? 0) >= 80).length
  return (
    <>
      <section className="picture-intro-card">
        <span><ImageIcon size={25} /></span>
        <div>
          <p className="kicker">Экзаменационная задача</p>
          <h2>Описание картинки</h2>
          <p>Девять смысловых шагов, личная фраза и обязательное завершение <b lang="lb">Dat ass alles.</b></p>
        </div>
        <strong>{completed}/{pictureExercises.length}</strong>
      </section>

      <div className="picture-library-grid">
        {pictureExercises.map((exercise) => {
          const item = progress[exercise.id]
          return (
            <button type="button" className="picture-library-card" key={exercise.id} onClick={() => onOpen(exercise)}>
              <img src={exercise.imageUrl} alt={exercise.title} />
              <span className="picture-library-copy">
                <small>{exercise.subtitle}</small>
                <strong>{exercise.title}</strong>
                <span>{item ? `Лучший результат: ${item.bestCoverage}%` : 'Ещё не пройдено'}</span>
              </span>
              <ChevronRight size={20} />
            </button>
          )
        })}
      </div>
    </>
  )
}

function ModePicker({ exercise, progress, onBack, onChoose }: {
  exercise: PictureExercise
  progress?: PicturePracticeProgress
  onBack: () => void
  onChoose: (mode: PicturePracticeMode) => void
}) {
  return (
    <>
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={18} /> Ко всем картинкам</button>
      <section className="picture-mode-hero">
        <img src={exercise.imageUrl} alt={exercise.title} />
        <div><p className="kicker">Выберите тренировку</p><h2>{exercise.title}</h2><p>{exercise.subtitle}</p></div>
        {progress && <strong>Лучший результат: {progress.bestCoverage}%</strong>}
      </section>
      <div className="picture-mode-grid">
        {(Object.keys(modeMeta) as PicturePracticeMode[]).map((mode) => {
          const meta = modeMeta[mode]
          const Icon = meta.icon
          const completed = progress?.completedModes.includes(mode)
          return (
            <button type="button" key={mode} onClick={() => onChoose(mode)}>
              <span><Icon size={22} /></span>
              <div><small>{meta.badge}{completed ? ' · пройдено' : ''}</small><strong>{meta.title}</strong><p>{meta.text}</p></div>
              {completed ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
            </button>
          )
        })}
      </div>
    </>
  )
}

function GuidedPractice({
  exercise,
  notes,
  setNotes,
  transcript,
  setTranscript,
  onFinish,
  onBack,
}: {
  exercise: PictureExercise
  notes: string[]
  setNotes: (notes: string[]) => void
  transcript: string
  setTranscript: (value: string) => void
  onFinish: () => void
  onBack: () => void
}) {
  const [stepIndex, setStepIndex] = useState(0)
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const step = pictureSteps[stepIndex]

  const updateNote = (value: string) => {
    const next = [...notes]
    next[stepIndex] = value
    setNotes(next)
  }

  return (
    <>
      <div className="picture-practice-topbar">
        <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={18} /> К режимам</button>
        <strong>{stepIndex + 1} / {pictureSteps.length}</strong>
      </div>
      <img className="picture-practice-image" src={exercise.imageUrl} alt={exercise.title} />
      <div className="picture-step-strip" aria-label="Шаги описания">
        {pictureSteps.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={`${index === stepIndex ? 'active' : ''} ${notes[index]?.trim() ? 'done' : ''}`}
            onClick={() => setStepIndex(index)}
          >
            {notes[index]?.trim() ? <Check size={14} /> : item.number}
          </button>
        ))}
      </div>

      <section className="picture-guide-card">
        <p className="kicker">Шаг {step.number}</p>
        <h2>{step.title}</h2>
        <p>{step.prompt}</p>
        <div className="picture-starters">
          {step.starters.map((starter) => <button type="button" key={starter} onClick={() => updateNote(starter)} lang="lb">{starter}</button>)}
        </div>
        <label className="picture-note-field">
          <span>Ваша фраза</span>
          <textarea value={notes[stepIndex] ?? ''} onChange={(event) => updateNote(event.target.value)} lang="lb" placeholder="Составьте одну-две фразы…" />
        </label>
        <button
          type="button"
          className="picture-reveal-button"
          onClick={() => setRevealed((current) => {
            const next = new Set(current)
            if (next.has(stepIndex)) next.delete(stepIndex)
            else next.add(stepIndex)
            return next
          })}
        >
          {revealed.has(stepIndex) ? <EyeOff size={17} /> : <Eye size={17} />}
          {revealed.has(stepIndex) ? 'Скрыть образец' : 'Показать образец шага'}
        </button>
        {revealed.has(stepIndex) && <div className="picture-step-sample" lang="lb">{exercise.sampleByStep[stepIndex]}</div>}
        <div className="picture-guide-actions">
          <button type="button" className="secondary-button" disabled={stepIndex === 0} onClick={() => setStepIndex((value) => value - 1)}>Назад</button>
          {stepIndex < pictureSteps.length - 1 ? (
            <button type="button" className="primary-button" onClick={() => setStepIndex((value) => value + 1)}>Следующий шаг <ArrowRight size={17} /></button>
          ) : (
            <button type="button" className="primary-button" onClick={onFinish}>Проверить структуру <Check size={17} /></button>
          )}
        </div>
      </section>

      <section className="picture-full-recording">
        <div><strong>Полный устный ответ</strong><small>После девяти шагов попробуйте связать всё в один рассказ.</small></div>
        <VoiceRecorder onTranscriptChange={setTranscript} />
        {transcript && <p lang="lb">{transcript}</p>}
      </section>
    </>
  )
}

function TimedPractice({
  exercise,
  mode,
  transcript,
  setTranscript,
  onFinish,
  onBack,
}: {
  exercise: PictureExercise
  mode: 'memory' | 'exam'
  transcript: string
  setTranscript: (value: string) => void
  onFinish: () => void
  onBack: () => void
}) {
  const [stage, setStage] = useState<'ready' | 'prep' | 'answer'>('ready')
  const [seconds, setSeconds] = useState(mode === 'exam' ? 30 : 120)

  useEffect(() => {
    if (stage === 'ready') return
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1
        if (stage === 'prep') {
          setStage('answer')
          return 120
        }
        window.clearInterval(timer)
        window.setTimeout(onFinish, 0)
        return 0
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [onFinish, stage])

  const start = () => {
    if (mode === 'exam') {
      setStage('prep')
      setSeconds(30)
    } else {
      setStage('answer')
      setSeconds(120)
    }
  }

  return (
    <>
      <div className="picture-practice-topbar">
        <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={18} /> К режимам</button>
        <span className={`picture-timer ${stage}`}><Clock3 size={18} /> {stage === 'ready' ? modeMeta[mode].badge : formatCountdown(seconds)}</span>
      </div>
      <img className="picture-practice-image timed" src={exercise.imageUrl} alt={exercise.title} />

      {stage === 'ready' && (
        <section className="picture-timed-card ready">
          <span><Timer size={30} /></span>
          <h2>{modeMeta[mode].title}</h2>
          <p>{modeMeta[mode].text}</p>
          <button type="button" className="primary-button wide" onClick={start}>Начать <ArrowRight size={17} /></button>
        </section>
      )}

      {stage === 'prep' && (
        <section className="picture-timed-card prep">
          <p className="kicker">Подготовка</p>
          <h2>Продумайте первые три фразы</h2>
          <p>Где сделано фото? Что это за место? Что видно на переднем и заднем плане?</p>
          <strong>{formatCountdown(seconds)}</strong>
        </section>
      )}

      {stage === 'answer' && (
        <section className="picture-timed-card answer">
          <p className="kicker">Говорите по-люксембуржски</p>
          <div className="picture-answer-timer"><Mic2 size={22} /><strong>{formatCountdown(seconds)}</strong></div>
          <p>Старайтесь не останавливаться из-за одной ошибки. Закончите фразой <b lang="lb">Dat ass alles.</b></p>
          <VoiceRecorder onTranscriptChange={setTranscript} />
          {transcript && <p className="picture-live-transcript" lang="lb">{transcript}</p>}
          <button type="button" className="primary-button wide" onClick={onFinish}>Завершить раньше и проверить</button>
        </section>
      )}
    </>
  )
}

function PictureResult({
  exercise,
  mode,
  initialParts,
  onSave,
  onRetry,
}: {
  exercise: PictureExercise
  mode: PicturePracticeMode
  initialParts: Set<string>
  onSave: (parts: Set<string>) => void
  onRetry: () => void
}) {
  const [parts, setParts] = useState(initialParts)
  const [sampleVisible, setSampleVisible] = useState(false)
  const coverage = pictureCoverage(parts)
  const rows = [...pictureSteps.map((step) => ({ id: step.id, label: `${step.number}. ${step.title}` })), { id: pictureClosing.id, label: pictureClosing.phrase }]

  const toggle = (id: string) => setParts((current) => {
    const next = new Set(current)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  return (
    <section className="picture-result-card">
      <span className="picture-result-icon">{coverage >= 80 ? <CheckCircle2 size={34} /> : <Sparkles size={32} />}</span>
      <p className="kicker">Структура ответа</p>
      <h2>{coverage >= 80 ? 'Ответ хорошо покрывает картинку' : 'Отметьте, что было в Вашем ответе'}</h2>
      <div className="picture-result-score"><strong>{coverage}%</strong><span>{parts.size} из {rows.length} элементов</span></div>
      <p>Распознавание может пропустить правильную фразу. Нажмите на пункт, чтобы вручную исправить чек-лист перед сохранением.</p>
      <div className="picture-result-checklist">
        {rows.map((row) => (
          <button type="button" key={row.id} className={parts.has(row.id) ? 'done' : ''} onClick={() => toggle(row.id)}>
            {parts.has(row.id) ? <CheckCircle2 size={18} /> : <Circle size={18} />}<span>{row.label}</span>
          </button>
        ))}
      </div>
      <button type="button" className="picture-reveal-button wide" onClick={() => setSampleVisible((value) => !value)}>
        {sampleVisible ? <EyeOff size={17} /> : <Eye size={17} />}{sampleVisible ? 'Скрыть полный образец' : 'Сравнить с полным образцом'}
      </button>
      {sampleVisible && (
        <ol className="picture-full-sample" lang="lb">
          {fullSample(exercise).map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}
        </ol>
      )}
      <div className="picture-result-actions">
        <button type="button" className="secondary-button" onClick={onRetry}><RotateCcw size={17} /> Повторить</button>
        <button type="button" className="primary-button" onClick={() => onSave(parts)}>Сохранить результат <Check size={17} /></button>
      </div>
      <small>Режим: {modeMeta[mode].title}</small>
    </section>
  )
}

export function PictureTrainer({
  progress,
  onComplete,
}: {
  progress: Record<string, PicturePracticeProgress>
  onComplete: (pictureId: string, mode: PicturePracticeMode, coverage: number) => void
}) {
  const [exercise, setExercise] = useState<PictureExercise>()
  const [mode, setMode] = useState<PicturePracticeMode>()
  const [phase, setPhase] = useState<'practice' | 'result'>('practice')
  const [notes, setNotes] = useState<string[]>(() => Array(pictureSteps.length).fill(''))
  const [transcript, setTranscript] = useState('')
  const [detected, setDetected] = useState<Set<string>>(new Set())

  const combinedAnswer = useMemo(() => `${notes.join(' ')} ${transcript}`.trim(), [notes, transcript])

  const resetPractice = () => {
    setPhase('practice')
    setNotes(Array(pictureSteps.length).fill(''))
    setTranscript('')
    setDetected(new Set())
  }

  const chooseMode = (nextMode: PicturePracticeMode) => {
    setMode(nextMode)
    resetPractice()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const finish = () => {
    if (!exercise) return
    setDetected(detectedPictureParts(combinedAnswer, exercise))
    setPhase('result')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const save = (parts: Set<string>) => {
    if (!exercise || !mode) return
    onComplete(exercise.id, mode, pictureCoverage(parts))
    setMode(undefined)
    resetPractice()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (!exercise) return <PictureLibrary progress={progress} onOpen={setExercise} />
  if (!mode) return <ModePicker exercise={exercise} progress={progress[exercise.id]} onBack={() => setExercise(undefined)} onChoose={chooseMode} />
  if (phase === 'result') return <PictureResult exercise={exercise} mode={mode} initialParts={detected} onSave={save} onRetry={resetPractice} />
  if (mode === 'guided') {
    return (
      <GuidedPractice
        exercise={exercise}
        notes={notes}
        setNotes={setNotes}
        transcript={transcript}
        setTranscript={setTranscript}
        onFinish={finish}
        onBack={() => setMode(undefined)}
      />
    )
  }
  return (
    <TimedPractice
      exercise={exercise}
      mode={mode}
      transcript={transcript}
      setTranscript={setTranscript}
      onFinish={finish}
      onBack={() => setMode(undefined)}
    />
  )
}

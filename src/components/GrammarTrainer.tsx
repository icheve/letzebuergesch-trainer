import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Keyboard,
  ListChecks,
  MessageCircleQuestion,
  Mic,
  RefreshCw,
  Route,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react'
import {
  grammarBlocks,
  grammarLessonById,
  grammarLessons,
  type GrammarExercise,
  type GrammarExerciseKind,
  type GrammarLesson,
} from '../data/grammarLessons'
import type { GrammarSession, ProgressState } from '../types'
import {
  firstGrammarError,
  firstSpeechError,
  grammarAnswerCorrect,
  grammarProgressLabel,
  speechAnswerCorrect,
} from '../utils/grammar'
import { shuffle, splitIntoTiles } from '../utils/text'
import { AudioButton } from './AudioButton'
import { ExamTrainer } from './ExamTrainer'
import { VoiceRecorder } from './VoiceRecorder'

type ExerciseStatus = 'idle' | 'wrong' | 'correct' | 'revealed'
type LessonPhase = 'overview' | 'practice' | 'result'

const exerciseMeta: Record<GrammarExerciseKind, { label: string; instruction: string; icon: typeof Keyboard }> = {
  choice: { label: 'Распознавание', instruction: 'Выберите правильную фразу', icon: ListChecks },
  order: { label: 'Порядок слов', instruction: 'Соберите предложение', icon: Route },
  fill: { label: 'Форма слова', instruction: 'Заполните пропуск', icon: BookOpenCheck },
  translate: { label: 'Активный перевод', instruction: 'Напишите всю фразу', icon: Keyboard },
  speak: { label: 'Устная речь', instruction: 'Скажите ответ без подсказки', icon: Mic },
}

interface OrderTile {
  id: number
  text: string
}

function resultText(score: number) {
  if (score === 5) return 'Правило уверенно освоено'
  if (score === 4) return 'Хороший результат'
  return 'Правило стоит повторить ещё раз'
}

function LessonMap({
  progress,
  onOpen,
  onExam,
}: {
  progress: ProgressState
  onOpen: (lesson: GrammarLesson) => void
  onExam: () => void
}) {
  const now = Date.now()
  const mastered = grammarLessons.filter((lesson) => (progress.grammarLessons[lesson.id]?.bestScore ?? 0) >= 4).length
  const due = grammarLessons.filter((lesson) => {
    const item = progress.grammarLessons[lesson.id]
    return item && item.dueAt <= now
  }).length
  const nextLesson = grammarLessons.find((lesson) => {
    const item = progress.grammarLessons[lesson.id]
    return !item || item.dueAt <= now || item.bestScore < 4
  }) ?? grammarLessons[grammarLessons.length - 1]
  const nextProgress = progress.grammarLessons[nextLesson.id]
  const activeSession = progress.grammarSession && grammarLessonById[progress.grammarSession.lessonId]

  return (
    <main className="screen grammar-screen">
      <section className="screen-heading grammar-heading">
        <div>
          <p className="kicker">Путь от A1 к уверенной речи</p>
          <h1>Грамматика</h1>
        </div>
        <div className="mini-stat"><strong>{mastered}</strong><span>из {grammarLessons.length}</span></div>
      </section>

      <section className="grammar-continue-card">
        <div className="grammar-continue-top">
          <span className="grammar-course-icon"><Route size={22} /></span>
          <div>
            <p>{activeSession ? 'Продолжить с места остановки' : due ? `${due} урока пора повторить` : 'Рекомендуемый следующий шаг'}</p>
            <h2>{activeSession ? grammarLessonById[progress.grammarSession!.lessonId].title : nextLesson.title}</h2>
          </div>
        </div>
        <div className="grammar-overall-progress" aria-label={`Освоено ${mastered} из ${grammarLessons.length} уроков`}>
          <span style={{ width: `${mastered / grammarLessons.length * 100}%` }} />
        </div>
        <button type="button" className="primary-button wide" onClick={() => onOpen(activeSession || nextLesson)}>
          {activeSession ? `Продолжить · ${progress.grammarSession!.exerciseIndex + 1}/5` : nextProgress ? 'Повторить урок' : 'Начать урок'}
          <ArrowRight size={18} />
        </button>
      </section>

      <div className="grammar-roadmap">
        {grammarBlocks.map((block) => {
          const lessons = grammarLessons.filter((lesson) => lesson.block === block.id)
          const completed = lessons.filter((lesson) => (progress.grammarLessons[lesson.id]?.bestScore ?? 0) >= 4).length
          return (
            <section className="grammar-block" key={block.id}>
              <div className="grammar-block-heading">
                <div><span>Блок {block.id}</span><h2>{block.title}</h2><p>{block.subtitle}</p></div>
                <strong>{completed}/{lessons.length}</strong>
              </div>
              <div className="grammar-lesson-list">
                {lessons.map((lesson) => {
                  const lessonProgress = progress.grammarLessons[lesson.id]
                  const status = grammarProgressLabel(lessonProgress, now)
                  const masteredLesson = (lessonProgress?.bestScore ?? 0) >= 4 && lessonProgress!.dueAt > now
                  const dueLesson = Boolean(lessonProgress && lessonProgress.dueAt <= now)
                  return (
                    <button
                      type="button"
                      className={`grammar-lesson-row ${masteredLesson ? 'mastered' : ''} ${dueLesson ? 'due' : ''}`}
                      key={lesson.id}
                      onClick={() => onOpen(lesson)}
                    >
                      <span className="grammar-lesson-number">{masteredLesson ? <Check size={18} /> : lesson.number}</span>
                      <span className="grammar-lesson-copy">
                        <span><b>{lesson.level}</b>{status}</span>
                        <strong>{lesson.title}</strong>
                        <small>{lesson.subtitle}</small>
                      </span>
                      {lessonProgress && <span className="grammar-score">{lessonProgress.bestScore}/5</span>}
                      <ChevronRight size={19} />
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <section className="grammar-exam-card">
        <span className="grammar-exam-icon"><MessageCircleQuestion size={24} /></span>
        <div>
          <p className="kicker">Итоговое применение</p>
          <h2>Пробный устный экзамен</h2>
          <p>Ответы на персональные темы, запись голоса и самостоятельная оценка.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onExam}>
          Открыть <ArrowRight size={17} />
        </button>
      </section>
    </main>
  )
}

function LessonOverview({
  lesson,
  onBack,
  onStart,
}: {
  lesson: GrammarLesson
  onBack: () => void
  onStart: () => void
}) {
  const [recapAnswer, setRecapAnswer] = useState('')
  const [recapStatus, setRecapStatus] = useState<'idle' | 'wrong' | 'correct'>('idle')
  const canStart = !lesson.recap || recapStatus === 'correct'

  const checkRecap = () => {
    if (!lesson.recap || !recapAnswer) return
    setRecapStatus(recapAnswer === lesson.recap.answer ? 'correct' : 'wrong')
  }

  return (
    <main className="screen grammar-screen grammar-lesson-screen">
      <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={18} /> К карте</button>

      <section className="grammar-lesson-hero">
        <div className="grammar-lesson-badges"><span>Урок {lesson.number}</span><span>{lesson.level}</span><span>5 фраз</span></div>
        <h1>{lesson.title}</h1>
        <p>{lesson.subtitle}</p>
      </section>

      {lesson.revisits.length > 0 && (
        <section className="grammar-reminder-card">
          <div className="grammar-card-title"><RefreshCw size={19} /><div><strong>Уже знаем</strong><small>Эти конструкции снова встретятся в уроке</small></div></div>
          <div className="grammar-reminder-list">
            {lesson.revisits.map((id) => {
              const previous = grammarLessonById[id]
              return <span key={id}><b>{previous.title}</b>{previous.patterns[0]}</span>
            })}
          </div>
        </section>
      )}

      {lesson.recap && (
        <section className={`grammar-recap-card status-${recapStatus}`}>
          <p className="kicker">Активное напоминание</p>
          <h2>{lesson.recap.promptRu}</h2>
          <div className="grammar-choice-list compact">
            {lesson.recap.options.map((option) => (
              <button
                type="button"
                key={option}
                className={recapAnswer === option ? 'selected' : ''}
                onClick={() => { setRecapAnswer(option); setRecapStatus('idle') }}
              >
                {option}
              </button>
            ))}
          </div>
          {recapStatus === 'wrong' && <div className="grammar-inline-feedback error"><X size={17} /> Вспомните форму и попробуйте ещё раз.</div>}
          {recapStatus === 'correct' && <div className="grammar-inline-feedback success"><Check size={17} /> {lesson.recap.explanation}</div>}
          {recapStatus !== 'correct' && (
            <button type="button" className="secondary-button" disabled={!recapAnswer} onClick={checkRecap}>Проверить напоминание</button>
          )}
        </section>
      )}

      <section className="grammar-rule-card">
        <div className="grammar-card-title"><Sparkles size={20} /><div><strong>Новое правило</strong><small>Сначала смысл, затем формула</small></div></div>
        <p className="grammar-rule-text">{lesson.rule}</p>
        <div className="grammar-patterns">
          {lesson.patterns.map((pattern) => <code key={pattern}>{pattern}</code>)}
        </div>
        <div className="grammar-example-list">
          {lesson.examples.map((example) => (
            <div key={example.lux}>
              <span lang="lb">{example.lux}</span>
              <small>{example.ru}</small>
              <AudioButton text={example.lux} label="Прослушать пример" />
            </div>
          ))}
        </div>
      </section>

      <button type="button" className="primary-button wide grammar-start-button" onClick={onStart} disabled={!canStart}>
        {canStart ? 'Закрепить пятью фразами' : 'Сначала ответьте на напоминание'} <ArrowRight size={18} />
      </button>
    </main>
  )
}

function ExercisePractice({
  lesson,
  initialSession,
  onBack,
  onSaveSession,
  onComplete,
}: {
  lesson: GrammarLesson
  initialSession?: GrammarSession
  onBack: () => void
  onSaveSession: (session?: GrammarSession) => void
  onComplete: (score: number) => void
}) {
  const [index, setIndex] = useState(initialSession?.exerciseIndex ?? 0)
  const [score, setScore] = useState(initialSession?.firstTryCorrect ?? 0)
  const [answer, setAnswer] = useState('')
  const [status, setStatus] = useState<ExerciseStatus>('idle')
  const [hadError, setHadError] = useState(false)
  const [earnedPoint, setEarnedPoint] = useState(false)
  const [available, setAvailable] = useState<OrderTile[]>([])
  const [selected, setSelected] = useState<OrderTile[]>([])
  const [speechTranscript, setSpeechTranscript] = useState('')
  const [speechAttempt, setSpeechAttempt] = useState(0)
  const [speechRecording, setSpeechRecording] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const exercise = lesson.exercises[index]
  const meta = exerciseMeta[exercise.kind]
  const ExerciseIcon = meta.icon
  const solution = exercise.solutionLux ?? exercise.answerLux

  useEffect(() => {
    setAnswer('')
    setStatus('idle')
    setHadError(false)
    setEarnedPoint(false)
    setSpeechTranscript('')
    setSpeechAttempt(0)
    setSpeechRecording(false)
    if (exercise.kind === 'order') {
      const tiles = splitIntoTiles(exercise.answerLux).map((text, tileIndex) => ({ id: tileIndex, text }))
      setAvailable(shuffle(tiles))
      setSelected([])
    }
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [exercise.id, exercise.answerLux, exercise.kind])

  const currentAnswer = exercise.kind === 'order' ? selected.map((tile) => tile.text).join(' ') : answer

  const check = () => {
    if (!currentAnswer.trim()) return
    const correct = grammarAnswerCorrect(exercise, currentAnswer)
    if (!correct) {
      setStatus('wrong')
      setHadError(true)
      setEarnedPoint(false)
      return
    }
    setStatus('correct')
    setEarnedPoint(!hadError)
  }

  const chooseTile = (tile: OrderTile) => {
    if (status === 'correct') return
    setAvailable((items) => items.filter((item) => item.id !== tile.id))
    setSelected((items) => [...items, tile])
    setStatus('idle')
  }

  const removeTile = (tile: OrderTile) => {
    if (status === 'correct') return
    setSelected((items) => items.filter((item) => item.id !== tile.id))
    setAvailable((items) => [...items, tile])
    setStatus('idle')
  }

  const revealSpeech = () => setStatus('revealed')

  const rateSpeech = (successful: boolean) => {
    if (!successful) {
      setHadError(true)
      setEarnedPoint(false)
      setSpeechTranscript('')
      setSpeechAttempt((attempt) => attempt + 1)
      setSpeechRecording(false)
      setStatus('idle')
      return
    }
    setEarnedPoint(!hadError)
    setStatus('correct')
  }

  const acceptSpeechOverride = () => {
    setHadError(true)
    setEarnedPoint(false)
    setStatus('correct')
  }

  const next = () => {
    const nextScore = score + (earnedPoint ? 1 : 0)
    if (index === lesson.exercises.length - 1) {
      onComplete(nextScore)
      return
    }
    const nextIndex = index + 1
    setScore(nextScore)
    setIndex(nextIndex)
    onSaveSession({ lessonId: lesson.id, exerciseIndex: nextIndex, firstTryCorrect: nextScore })
  }

  const error = status === 'wrong' ? firstGrammarError(currentAnswer, exercise.answerLux) : ''
  const hasSpeechTranscript = speechTranscript.trim().length > 0
  const speechCorrect = hasSpeechTranscript ? speechAnswerCorrect(exercise, speechTranscript) : undefined
  const speechError = speechCorrect === false
    ? firstSpeechError(speechTranscript, exercise.answerLux)
    : ''

  return (
    <main className="screen grammar-screen grammar-practice-screen">
      <div className="grammar-practice-topbar">
        <button type="button" className="back-button" onClick={onBack}><ArrowLeft size={18} /> К уроку</button>
        <span>{index + 1} / {lesson.exercises.length}</span>
      </div>
      <div className="grammar-practice-progress"><span style={{ width: `${(index + 1) / lesson.exercises.length * 100}%` }} /></div>

      <article className={`grammar-exercise-card status-${status}`}>
        <div className="grammar-exercise-heading">
          <span><ExerciseIcon size={20} /></span>
          <div><strong>{meta.label}</strong><small>{meta.instruction}</small></div>
          <b>{lesson.title}</b>
        </div>

        <section className="grammar-exercise-prompt">
          <p className="prompt-label">Задание</p>
          <h2>{exercise.promptRu}</h2>
          {exercise.promptLux && <p className="grammar-cloze" lang="lb">{exercise.promptLux}</p>}
        </section>

        {exercise.kind === 'choice' && (
          <div className="grammar-choice-list">
            {exercise.options?.map((option) => (
              <button
                type="button"
                key={option}
                className={answer === option ? 'selected' : ''}
                disabled={status === 'correct'}
                onClick={() => { setAnswer(option); if (status !== 'correct') setStatus('idle') }}
              >
                <span>{answer === option ? <Check size={16} /> : null}</span>{option}
              </button>
            ))}
          </div>
        )}

        {exercise.kind === 'order' && (
          <>
            <div className="grammar-order-answer">
              {selected.length === 0 && <span>Нажимайте на слова в правильном порядке…</span>}
              {selected.map((tile) => <button type="button" key={tile.id} onClick={() => removeTile(tile)}>{tile.text}</button>)}
            </div>
            <div className="grammar-order-bank">
              {available.map((tile) => <button type="button" key={tile.id} onClick={() => chooseTile(tile)}>{tile.text}</button>)}
            </div>
          </>
        )}

        {(exercise.kind === 'fill' || exercise.kind === 'translate') && (
          <label className="grammar-input-label">
            <span>Ваш ответ</span>
            <input
              ref={inputRef}
              value={answer}
              disabled={status === 'correct'}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={exercise.kind === 'fill' ? 'Введите пропущенную форму…' : 'Введите фразу…'}
              onChange={(event) => { setAnswer(event.target.value); if (status !== 'correct') setStatus('idle') }}
              onKeyDown={(event) => { if (event.key === 'Enter') check() }}
            />
          </label>
        )}

        {exercise.kind === 'speak' && status !== 'correct' && (
          <div className="grammar-speaking-workspace">
            <VoiceRecorder
              key={`${exercise.id}-${speechAttempt}`}
              onTranscriptChange={setSpeechTranscript}
              onRecordingChange={setSpeechRecording}
            />
            {status === 'idle' && (
              <>
                <p>Скажите фразу без текста. Браузер попробует распознать люксембуржскую речь и проверить слова.</p>
                <button
                  type="button"
                  className="primary-button wide"
                  onClick={revealSpeech}
                  disabled={speechRecording}
                >
                  {speechRecording ? 'Сначала остановите запись' : 'Проверить и показать образец'}
                </button>
              </>
            )}

            {status === 'revealed' && (
              <section className="grammar-speech-reveal">
                <p className="prompt-label">Образец</p>
                <h3 lang="lb">{exercise.answerLux}</h3>
                <AudioButton text={exercise.answerLux} label="Прослушать образец" />

                {speechCorrect === true && (
                  <div className="grammar-speech-check success">
                    <CheckCircle2 size={19} />
                    <p><strong>Слова распознаны верно.</strong> Ответ совпадает с образцом.</p>
                  </div>
                )}
                {speechCorrect === false && (
                  <div className="grammar-speech-check error">
                    <CircleAlert size={19} />
                    <p><strong>Есть отличие.</strong> {speechError || 'Распознанный текст не совпадает с образцом.'}</p>
                  </div>
                )}
                {!hasSpeechTranscript && (
                  <div className="grammar-speech-check manual">
                    <Mic size={19} />
                    <p><strong>Автопроверка недоступна.</strong> Прослушайте запись и оцените ответ вручную.</p>
                  </div>
                )}

                <div className="grammar-speech-actions">
                  {speechCorrect === true && (
                    <button type="button" className="primary-button" onClick={() => rateSpeech(true)}>Засчитать ответ</button>
                  )}
                  {speechCorrect === false && (
                    <>
                      <button type="button" className="primary-button" onClick={() => rateSpeech(false)}>Записать ещё раз</button>
                      <button type="button" className="secondary-button" onClick={acceptSpeechOverride}>Распознано неточно — засчитать</button>
                    </>
                  )}
                  {!hasSpeechTranscript && (
                    <>
                      <button type="button" className="secondary-button" onClick={() => rateSpeech(false)}>Нужно повторить</button>
                      <button type="button" className="primary-button" onClick={() => rateSpeech(true)}>Получилось</button>
                    </>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {status === 'wrong' && (
          <section className="grammar-answer-feedback error">
            <div><CircleAlert size={20} /><strong>Пока неверно</strong></div>
            <p>{error || 'Ответ пока не совпадает с образцом.'}</p>
            <p>Правильный ответ: <b lang="lb">{exercise.answerLux}</b></p>
            <small>Исправьте ответ и проверьте ещё раз.</small>
          </section>
        )}

        {status === 'correct' && (
          <section className={`grammar-answer-feedback success ${hadError ? 'corrected' : ''}`}>
            <div><CheckCircle2 size={20} /><strong>{hadError ? 'Теперь правильно' : 'Правильно'}</strong></div>
            <h3 lang="lb">{solution}</h3>
            <p>{exercise.explanation}</p>
            <AudioButton text={solution} label="Прослушать фразу" />
          </section>
        )}

        {exercise.kind !== 'speak' && status !== 'correct' && (
          <div className="grammar-check-actions">
            <button
              type="button"
              className="primary-button"
              onClick={check}
              disabled={!currentAnswer.trim() || (exercise.kind === 'order' && available.length > 0)}
            >
              Проверить
            </button>
          </div>
        )}

        {status === 'correct' && (
          <button type="button" className="primary-button wide grammar-next-button" onClick={next}>
            {index === lesson.exercises.length - 1 ? 'Завершить урок' : 'Следующая фраза'} <ArrowRight size={18} />
          </button>
        )}
      </article>
    </main>
  )
}

function LessonResult({
  lesson,
  score,
  onRepeat,
  onMap,
  onNext,
}: {
  lesson: GrammarLesson
  score: number
  onRepeat: () => void
  onMap: () => void
  onNext?: () => void
}) {
  return (
    <main className="screen grammar-screen grammar-result-screen">
      <section className="grammar-result-card">
        <span className="grammar-result-icon">{score >= 4 ? <Trophy size={34} /> : <RefreshCw size={32} />}</span>
        <p className="kicker">Урок {lesson.number} завершён</p>
        <h1>{resultText(score)}</h1>
        <div className="grammar-result-score"><strong>{score}</strong><span>из 5<br />с первой попытки</span></div>
        <p>{score >= 4
          ? 'Правило вернётся в следующих уроках и в интервальном повторении.'
          : 'Все ошибки уже исправлены. Ещё один короткий проход сделает конструкцию увереннее.'}</p>
        <div className="grammar-result-rule">
          <span>Коротко</span>
          <code>{lesson.patterns[0]}</code>
        </div>
        <div className="grammar-result-actions">
          <button type="button" className="secondary-button" onClick={onRepeat}><RefreshCw size={17} /> Повторить</button>
          {onNext && <button type="button" className="primary-button" onClick={onNext}>Следующий урок <ArrowRight size={17} /></button>}
        </div>
        <button type="button" className="text-button centered" onClick={onMap}>Вернуться к карте</button>
      </section>
    </main>
  )
}

export function GrammarTrainer({
  progress,
  rateExam,
  saveGrammarSession,
  completeGrammarLesson,
}: {
  progress: ProgressState
  rateExam: (id: string, rating: 'hard' | 'good' | 'easy') => void
  saveGrammarSession: (session?: GrammarSession) => void
  completeGrammarLesson: (lessonId: string, score: number) => void
}) {
  const resumedLesson = progress.grammarSession ? grammarLessonById[progress.grammarSession.lessonId] : undefined
  const [lesson, setLesson] = useState<GrammarLesson | undefined>(resumedLesson)
  const [phase, setPhase] = useState<LessonPhase>(resumedLesson ? 'practice' : 'overview')
  const [resultScore, setResultScore] = useState(0)
  const [exam, setExam] = useState(false)

  const nextLesson = useMemo(() => lesson
    ? grammarLessons.find((item) => item.number === lesson.number + 1)
    : undefined, [lesson])

  const openLesson = (selected: GrammarLesson) => {
    const isResuming = progress.grammarSession?.lessonId === selected.id
    setLesson(selected)
    setPhase(isResuming ? 'practice' : 'overview')
    setExam(false)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const backToMap = () => {
    setLesson(undefined)
    setPhase('overview')
    saveGrammarSession(undefined)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const start = () => {
    if (!lesson) return
    saveGrammarSession({ lessonId: lesson.id, exerciseIndex: 0, firstTryCorrect: 0 })
    setPhase('practice')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const finish = (score: number) => {
    if (!lesson) return
    completeGrammarLesson(lesson.id, score)
    setResultScore(score)
    setPhase('result')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const repeat = () => {
    if (!lesson) return
    saveGrammarSession({ lessonId: lesson.id, exerciseIndex: 0, firstTryCorrect: 0 })
    setPhase('practice')
  }

  if (exam) {
    return (
      <div className="grammar-exam-view">
        <div className="grammar-exam-back"><button type="button" className="back-button" onClick={() => setExam(false)}><ArrowLeft size={18} /> К грамматике</button></div>
        <ExamTrainer progress={progress} rateExam={rateExam} />
      </div>
    )
  }

  if (!lesson) return <LessonMap progress={progress} onOpen={openLesson} onExam={() => setExam(true)} />
  if (phase === 'overview') return <LessonOverview lesson={lesson} onBack={backToMap} onStart={start} />
  if (phase === 'practice') {
    return (
      <ExercisePractice
        key={`${lesson.id}-${progress.grammarSession?.exerciseIndex ?? 0}`}
        lesson={lesson}
        initialSession={progress.grammarSession?.lessonId === lesson.id ? progress.grammarSession : undefined}
        onBack={() => setPhase('overview')}
        onSaveSession={saveGrammarSession}
        onComplete={finish}
      />
    )
  }
  return (
    <LessonResult
      lesson={lesson}
      score={resultScore}
      onRepeat={repeat}
      onMap={backToMap}
      onNext={nextLesson ? () => openLesson(nextLesson) : undefined}
    />
  )
}

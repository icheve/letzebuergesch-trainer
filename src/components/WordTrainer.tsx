import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  BookOpenCheck,
  Check,
  CircleX,
  ExternalLink,
  Headphones,
  Keyboard,
  Lightbulb,
} from 'lucide-react'
import { allVocabulary } from '../data/topics'
import type { ProgressState, Rating } from '../types'
import { isDue, scheduleReview } from '../utils/srs'
import {
  clozeVocabularySentence,
  expectedVocabularyAnswers,
  isVocabularyAnswerCorrect,
  vocabularyHint,
  vocabularyMode,
  type VocabularyMode,
} from '../utils/vocabulary'
import { AudioButton } from './AudioButton'
import { TopicFilter } from './TopicFilter'

const modeMeta: Record<VocabularyMode, {
  kicker: string
  instruction: string
  icon: typeof Keyboard
}> = {
  production: {
    kicker: 'Активное воспроизведение',
    instruction: 'Напишите словарную форму по-люксембуржски',
    icon: Keyboard,
  },
  cloze: {
    kicker: 'Слово в контексте',
    instruction: 'Вставьте пропущенную форму',
    icon: BookOpenCheck,
  },
  listening: {
    kicker: 'Аудирование LOD',
    instruction: 'Прослушайте и напишите основное слово',
    icon: Headphones,
  },
}

function intervalLabel(days: number, rating: Rating) {
  if (rating === 'again') return 'Вернём через 10 минут'
  const ending = days % 10 === 1 && days % 100 !== 11 ? 'день' :
    [2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100) ? 'дня' : 'дней'
  return `Следующее повторение через ${days} ${ending}`
}

export function WordTrainer({
  progress,
  reviewCard,
}: {
  progress: ProgressState
  reviewCard: (id: string, rating: Rating) => void
}) {
  const [topic, setTopic] = useState('all')
  const [completed, setCompleted] = useState(0)
  const [studying, setStudying] = useState(false)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [hintUsed, setHintUsed] = useState(false)
  const [hadError, setHadError] = useState(false)
  const [pendingRating, setPendingRating] = useState<Rating | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const cards = useMemo(() => {
    const filtered = allVocabulary.filter((card) => topic === 'all' || card.topicId === topic)
    const due = filtered.filter((card) => isDue(progress.reviews[card.id]))
    return due.length ? due : [...filtered].sort((left, right) =>
      (progress.reviews[left.id]?.dueAt ?? 0) - (progress.reviews[right.id]?.dueAt ?? 0),
    )
  }, [progress.reviews, topic])

  const current = cards[0]
  const review = current ? progress.reviews[current.id] : undefined
  const mode = vocabularyMode(review)
  const known = allVocabulary.filter((card) => (progress.reviews[card.id]?.repetitions ?? 0) > 0).length

  useEffect(() => {
    setCompleted(0)
  }, [topic])

  useEffect(() => {
    setStudying(Boolean(review))
    setAnswer('')
    setResult('idle')
    setHintUsed(false)
    setHadError(false)
    setPendingRating(null)
  }, [current?.id, review])

  useEffect(() => {
    if (studying && result === 'idle') inputRef.current?.focus()
  }, [result, studying])

  if (!current) {
    return <main className="screen"><div className="empty-state">В этой теме пока нет лексики.</div></main>
  }

  const expected = expectedVocabularyAnswers(current, mode)[0]
  const meta = modeMeta[mode]
  const ModeIcon = meta.icon

  const check = () => {
    if (!answer.trim()) return
    const correct = isVocabularyAnswerCorrect(current, mode, answer)
    if (!correct) {
      setResult('wrong')
      setHadError(true)
      setPendingRating('again')
      return
    }

    const rating: Rating = hadError ? 'again' : hintUsed ? 'hard' : 'good'
    setResult('correct')
    setPendingRating(rating)
  }

  const retry = () => {
    setAnswer('')
    setResult('idle')
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const next = () => {
    if (!pendingRating) return
    reviewCard(current.id, pendingRating)
    setCompleted((value) => value + 1)
  }

  const beginPractice = () => {
    setStudying(true)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <main className="screen trainer-screen vocabulary-screen">
      <section className="screen-heading">
        <div>
          <p className="kicker">Извлечение из памяти</p>
          <h1>Лексика</h1>
        </div>
        <div className="mini-stat"><strong>{known}</strong><span>изучено</span></div>
      </section>

      <TopicFilter value={topic} onChange={setTopic} />

      <div className="session-progress" aria-label={`Выполнено ${completed} упражнений`}>
        <span style={{ width: `${Math.min(100, completed * 10)}%` }} />
      </div>

      {!studying ? (
        <article className="vocabulary-study-card">
          <div className="flashcard-meta">
            <span>{current.topicTitle}</span>
            <span>Новое слово · знакомство</span>
          </div>
          <div className="vocabulary-study-main">
            <p className="prompt-label">Словарная форма</p>
            <h2 lang="lb">{current.luxembourgish}</h2>
            <p className="vocabulary-translation">{current.russian}</p>
            <div className="lod-audio-row">
              <AudioButton text={current.luxembourgish} audioUrl={current.lodAudioUrl} />
              <a href={`https://lod.lu/artikel/${current.lodId}`} target="_blank" rel="noreferrer">
                Статья в LOD <ExternalLink size={13} />
              </a>
            </div>
          </div>
          <div className="vocabulary-example">
            <strong>В персональном контексте</strong>
            <p lang="lb">{current.sentenceLux}</p>
            <small>{current.sentenceRu}</small>
          </div>
          <button type="button" className="primary-button wide" onClick={beginPractice}>
            Проверить себя <ArrowRight size={18} />
          </button>
        </article>
      ) : (
        <article className={`vocabulary-practice-card status-${result}`}>
          <div className="vocabulary-mode-heading">
            <span className="vocabulary-mode-icon"><ModeIcon size={19} /></span>
            <div><strong>{meta.kicker}</strong><small>{meta.instruction}</small></div>
            <span>{current.topicTitle}</span>
          </div>

          <div className="vocabulary-prompt">
            {mode === 'production' && (
              <>
                <p className="prompt-label">Переведите на люксембуржский</p>
                <h2>{current.russian}</h2>
                <small>Для существительных вводите артикль вместе со словом.</small>
              </>
            )}
            {mode === 'cloze' && (
              <>
                <p className="vocabulary-context-translation">{current.sentenceRu}</p>
                <p className="prompt-label">Заполните пропуск</p>
                <h2 lang="lb">{clozeVocabularySentence(current)}</h2>
              </>
            )}
            {mode === 'listening' && (
              <>
                <p className="prompt-label">Сначала слушайте, затем отвечайте</p>
                <AudioButton text={current.luxembourgish} audioUrl={current.lodAudioUrl} label="Воспроизвести LOD" />
                <small>Можно написать слово без артикля.</small>
              </>
            )}
          </div>

          <form className="vocabulary-answer-form" onSubmit={(event) => { event.preventDefault(); check() }}>
            <label htmlFor="vocabulary-answer">Ваш ответ</label>
            <input
              ref={inputRef}
              id="vocabulary-answer"
              value={answer}
              onChange={(event) => { setAnswer(event.target.value); if (result !== 'idle') setResult('idle') }}
              disabled={result === 'correct'}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="Введите ответ…"
              className={result === 'wrong' ? 'wrong' : result === 'correct' ? 'correct' : ''}
            />
            {hintUsed && result === 'idle' && <p className="vocabulary-hint"><Lightbulb size={15} /> {vocabularyHint(current, mode)}</p>}
          </form>

          {result === 'wrong' && (
            <section className="vocabulary-result wrong">
              <div className="vocabulary-result-title"><CircleX size={20} /><strong>Пока неверно</strong></div>
              <p>Правильный ответ: <b lang="lb">{expected}</b></p>
              {mode === 'cloze' && <p className="dictionary-form">Словарная форма: <b lang="lb">{current.luxembourgish}</b></p>}
              <div className="vocabulary-result-context">
                <span lang="lb">{current.sentenceLux}</span>
                <small>{current.sentenceRu}</small>
              </div>
              <button type="button" className="primary-button wide" onClick={retry}>Написать правильно ещё раз</button>
            </section>
          )}

          {result === 'correct' && pendingRating && (
            <section className="vocabulary-result correct">
              <div className="vocabulary-result-title"><Check size={20} /><strong>{hadError ? 'Теперь правильно' : 'Правильно'}</strong></div>
              <h3 lang="lb">{expected}</h3>
              {mode !== 'production' && <p className="dictionary-form">Словарная форма: <b lang="lb">{current.luxembourgish}</b></p>}
              <div className="vocabulary-result-context">
                <span lang="lb">{current.sentenceLux}</span>
                <small>{current.sentenceRu}</small>
              </div>
              <div className="lod-audio-row">
                <AudioButton text={current.luxembourgish} audioUrl={current.lodAudioUrl} />
                <a href={`https://lod.lu/artikel/${current.lodId}`} target="_blank" rel="noreferrer">
                  LOD <ExternalLink size={13} />
                </a>
              </div>
              <p className="next-interval">{intervalLabel(scheduleReview(review, pendingRating).intervalDays, pendingRating)}</p>
              <button type="button" className="primary-button wide" onClick={next}>
                Следующее упражнение <ArrowRight size={18} />
              </button>
            </section>
          )}

          {result === 'idle' && (
            <div className="vocabulary-actions">
              <button type="button" className="text-button" onClick={() => setHintUsed(true)} disabled={hintUsed}>
                <Lightbulb size={17} /> {hintUsed ? 'Подсказка открыта' : 'Подсказка'}
              </button>
              <button type="button" className="primary-button" onClick={check} disabled={!answer.trim()}>Проверить</button>
            </div>
          )}
        </article>
      )}
    </main>
  )
}

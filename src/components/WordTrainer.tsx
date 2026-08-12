import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  Check,
  CircleX,
  ExternalLink,
  Headphones,
} from 'lucide-react'
import { allVocabulary, vocabularyTopicOptions } from '../data/topics'
import type { ProgressState, Rating } from '../types'
import { isDue, scheduleReview } from '../utils/srs'
import {
  clozeVocabularySentence,
  expectedVocabularyChoice,
  isVocabularyChoiceCorrect,
  vocabularyChoices,
  vocabularyMode,
  type VocabularyMode,
} from '../utils/vocabulary'
import { AudioButton } from './AudioButton'
import { TopicFilter } from './TopicFilter'

const modeMeta: Record<VocabularyMode, {
  kicker: string
  instruction: string
  icon: typeof Brain
}> = {
  meaning: {
    kicker: 'Активное узнавание',
    instruction: 'Вспомните значение и выберите ответ',
    icon: Brain,
  },
  cloze: {
    kicker: 'Слово в контексте',
    instruction: 'Выберите слово для пропуска',
    icon: BookOpenCheck,
  },
  listening: {
    kicker: 'Аудирование LOD',
    instruction: 'Прослушайте и выберите значение',
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
  const [selectedChoice, setSelectedChoice] = useState('')
  const [result, setResult] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [hadError, setHadError] = useState(false)
  const [pendingRating, setPendingRating] = useState<Rating | null>(null)

  const vocabularyPool = useMemo(
    () => allVocabulary.filter((card) => topic === 'all' || card.topicId === topic),
    [topic],
  )

  const cards = useMemo(() => {
    const due = vocabularyPool.filter((card) => isDue(progress.reviews[card.id]))
    return due.length ? due : [...vocabularyPool].sort((left, right) =>
      (progress.reviews[left.id]?.dueAt ?? 0) - (progress.reviews[right.id]?.dueAt ?? 0),
    )
  }, [progress.reviews, vocabularyPool])

  const current = cards[0]
  const review = current ? progress.reviews[current.id] : undefined
  const mode = vocabularyMode(review)
  const choices = useMemo(
    () => current ? vocabularyChoices(current, mode, vocabularyPool) : [],
    [current, mode, vocabularyPool],
  )
  const known = allVocabulary.filter((card) => (progress.reviews[card.id]?.repetitions ?? 0) > 0).length

  useEffect(() => {
    setCompleted(0)
  }, [topic])

  useEffect(() => {
    setStudying(Boolean(review))
    setSelectedChoice('')
    setResult('idle')
    setHadError(false)
    setPendingRating(null)
  }, [current?.id, review])

  if (!current) {
    return <main className="screen"><div className="empty-state">В этой теме пока нет лексики.</div></main>
  }

  const expected = expectedVocabularyChoice(current, mode)
  const meta = modeMeta[mode]
  const ModeIcon = meta.icon

  const choose = (choice: string) => {
    if (result !== 'idle') return
    setSelectedChoice(choice)
    if (!isVocabularyChoiceCorrect(current, mode, choice)) {
      setResult('wrong')
      setHadError(true)
      setPendingRating('again')
      return
    }

    setResult('correct')
    setPendingRating(hadError ? 'again' : 'good')
  }

  const retry = () => {
    setSelectedChoice('')
    setResult('idle')
  }

  const revealAnswer = () => {
    setSelectedChoice('')
    setHadError(true)
    setPendingRating('again')
    setResult('wrong')
  }

  const next = () => {
    if (!pendingRating) return
    reviewCard(current.id, pendingRating)
    setCompleted((value) => value + 1)
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

      <TopicFilter value={topic} onChange={setTopic} options={vocabularyTopicOptions} />

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
              <AudioButton
                text={current.luxembourgish}
                audioUrl={current.lodCachedAudioUrl}
                fallbackAudioUrl={current.lodAudioUrl}
              />
              <a href={`https://lod.lu/artikel/${current.lodId}`} target="_blank" rel="noreferrer">
                Статья в LOD <ExternalLink size={13} />
              </a>
            </div>
          </div>
          <div className="vocabulary-example">
            <strong>В живом контексте</strong>
            <p lang="lb">{current.sentenceLux}</p>
            <small>{current.sentenceRu}</small>
          </div>
          <button type="button" className="primary-button wide" onClick={() => setStudying(true)}>
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
            {mode === 'meaning' && (
              <>
                <p className="prompt-label">Какое значение подходит?</p>
                <h2 lang="lb">{current.luxembourgish}</h2>
                <div className="lod-audio-row">
                  <AudioButton
                    text={current.luxembourgish}
                    audioUrl={current.lodCachedAudioUrl}
                    fallbackAudioUrl={current.lodAudioUrl}
                    label="Произношение LOD"
                  />
                </div>
              </>
            )}
            {mode === 'cloze' && (
              <>
                <p className="vocabulary-context-translation">{current.sentenceRu}</p>
                <p className="prompt-label">Какое слово пропущено?</p>
                <h2 lang="lb">{clozeVocabularySentence(current)}</h2>
              </>
            )}
            {mode === 'listening' && (
              <>
                <p className="prompt-label">Сначала слушайте, затем выбирайте</p>
                <div className="lod-audio-row">
                  <AudioButton
                    text={current.luxembourgish}
                    audioUrl={current.lodCachedAudioUrl}
                    fallbackAudioUrl={current.lodAudioUrl}
                    label="Воспроизвести LOD"
                  />
                </div>
                <small>Какое значение у услышанного слова?</small>
              </>
            )}
          </div>

          <div className="vocabulary-choice-grid" role="group" aria-label="Варианты ответа">
            {choices.map((choice) => {
              const isSelected = selectedChoice === choice
              const isCorrect = result !== 'idle' && choice === expected
              const isWrong = result === 'wrong' && isSelected && choice !== expected
              return (
                <button
                  type="button"
                  key={choice}
                  className={`${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${isSelected ? 'selected' : ''}`.trim()}
                  onClick={() => choose(choice)}
                  disabled={result !== 'idle'}
                  lang={mode === 'cloze' ? 'lb' : 'ru'}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          {result === 'wrong' && (
            <section className="vocabulary-result wrong">
              <div className="vocabulary-result-title"><CircleX size={20} /><strong>Пока неверно</strong></div>
              <p>Правильный ответ: <b lang={mode === 'cloze' ? 'lb' : 'ru'}>{expected}</b></p>
              <p className="dictionary-form">Словарная форма: <b lang="lb">{current.luxembourgish}</b></p>
              <div className="vocabulary-result-context">
                <span lang="lb">{current.sentenceLux}</span>
                <small>{current.sentenceRu}</small>
              </div>
              <button type="button" className="primary-button wide" onClick={retry}>Попробовать ещё раз</button>
            </section>
          )}

          {result === 'correct' && pendingRating && (
            <section className="vocabulary-result correct">
              <div className="vocabulary-result-title"><Check size={20} /><strong>{hadError ? 'Теперь правильно' : 'Правильно'}</strong></div>
              <h3 lang="lb">{current.luxembourgish}</h3>
              <p className="dictionary-form">{current.russian}</p>
              <div className="vocabulary-result-context">
                <span lang="lb">{current.sentenceLux}</span>
                <small>{current.sentenceRu}</small>
              </div>
              <div className="lod-audio-row">
                <AudioButton
                  text={current.luxembourgish}
                  audioUrl={current.lodCachedAudioUrl}
                  fallbackAudioUrl={current.lodAudioUrl}
                />
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
              <button type="button" className="text-button centered" onClick={revealAnswer}>
                Не помню — показать ответ
              </button>
            </div>
          )}
        </article>
      )}
    </main>
  )
}

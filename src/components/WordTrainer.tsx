import { useEffect, useMemo, useState } from 'react'
import { Check, ExternalLink, RotateCcw, Sparkles } from 'lucide-react'
import { allVocabulary } from '../data/topics'
import type { ProgressState, Rating } from '../types'
import { isDue, scheduleReview } from '../utils/srs'
import { AudioButton } from './AudioButton'
import { TopicFilter } from './TopicFilter'

const ratings: { id: Rating; label: string }[] = [
  { id: 'again', label: 'Не помню' },
  { id: 'hard', label: 'Сложно' },
  { id: 'good', label: 'Помню' },
  { id: 'easy', label: 'Легко' },
]

function intervalLabel(days: number, rating: Rating) {
  if (rating === 'again') return '10 мин'
  const ending = days % 10 === 1 && days % 100 !== 11 ? 'день' :
    [2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100) ? 'дня' : 'дней'
  return `${days} ${ending}`
}

export function WordTrainer({
  progress,
  reviewCard,
}: {
  progress: ProgressState
  reviewCard: (id: string, rating: Rating) => void
}) {
  const [topic, setTopic] = useState('all')
  const [revealed, setRevealed] = useState(false)
  const [position, setPosition] = useState(0)
  const [completed, setCompleted] = useState(0)

  const cards = useMemo(() => {
    const filtered = allVocabulary.filter((card) => topic === 'all' || card.topicId === topic)
    const due = filtered.filter((card) => isDue(progress.reviews[card.id]))
    return due.length ? due : [...filtered].sort((a, b) =>
      (progress.reviews[a.id]?.dueAt ?? 0) - (progress.reviews[b.id]?.dueAt ?? 0),
    )
  }, [progress.reviews, topic])

  useEffect(() => {
    setPosition(0)
    setCompleted(0)
    setRevealed(false)
  }, [topic])

  const current = cards[position % Math.max(cards.length, 1)]
  const known = Object.values(progress.reviews).filter((review) => review.repetitions > 0).length

  const rate = (rating: Rating) => {
    if (!current) return
    reviewCard(current.id, rating)
    setCompleted((value) => value + 1)
    setPosition(0)
    setRevealed(false)
  }

  if (!current) {
    return <main className="screen"><div className="empty-state">В этой теме пока нет карточек.</div></main>
  }

  return (
    <main className="screen trainer-screen">
      <section className="screen-heading">
        <div>
          <p className="kicker">Интервальные повторения</p>
          <h1>Слова</h1>
        </div>
        <div className="mini-stat"><strong>{known}</strong><span>изучено</span></div>
      </section>

      <TopicFilter value={topic} onChange={setTopic} />

      <div className="session-progress" aria-label={`Выполнено ${completed} карточек`}>
        <span style={{ width: `${Math.min(100, completed * 10)}%` }} />
      </div>

      <article className={`flashcard ${revealed ? 'revealed' : ''}`} onClick={() => !revealed && setRevealed(true)}>
        <div className="flashcard-meta">
          <span>{current.topicTitle}</span>
          <span>{progress.reviews[current.id] ? 'Повторение' : 'Новое слово'}</span>
        </div>
        <div className="flashcard-front">
          <p>Переведите на люксембуржский</p>
          <h2>{current.russian}</h2>
        </div>
        {revealed ? (
          <div className="flashcard-back">
            <div className="answer-mark"><Check size={18} /> Ответ</div>
            <h3>{current.luxembourgish}</h3>
            <div className="lod-audio-row">
              <AudioButton text={current.luxembourgish} audioUrl={current.lodAudioUrl} />
              <a
                href={`https://lod.lu/artikel/${current.lodId}`}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
              >
                Статья в LOD <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ) : (
          <button type="button" className="reveal-button" onClick={() => setRevealed(true)}>
            <Sparkles size={18} /> Показать ответ
          </button>
        )}
      </article>

      {revealed ? (
        <div className="rating-grid">
          {ratings.map((rating) => (
            <button type="button" key={rating.id} className={`rating-${rating.id}`} onClick={() => rate(rating.id)}>
              <strong>{rating.label}</strong>
              <span>{intervalLabel(scheduleReview(progress.reviews[current.id], rating.id).intervalDays, rating.id)}</span>
            </button>
          ))}
        </div>
      ) : (
        <p className="gesture-hint"><RotateCcw size={15} /> Сначала вспомните слово, затем откройте карточку</p>
      )}
    </main>
  )
}

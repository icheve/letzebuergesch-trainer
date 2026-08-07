import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Eye, EyeOff, MessageCircleQuestion, Sparkles } from 'lucide-react'
import { verifiedSentences } from '../data/topics'
import type { ProgressState } from '../types'
import { shuffle } from '../utils/text'
import { AudioButton } from './AudioButton'
import { TopicFilter } from './TopicFilter'
import { VoiceRecorder } from './VoiceRecorder'

export function ExamTrainer({
  progress,
  rateExam,
}: {
  progress: ProgressState
  rateExam: (id: string, rating: 'hard' | 'good' | 'easy') => void
}) {
  const [topic, setTopic] = useState('all')
  const [order, setOrder] = useState<string[]>([])
  const [position, setPosition] = useState(0)
  const [translation, setTranslation] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const items = useMemo(() => verifiedSentences.filter((item) => topic === 'all' || item.topicId === topic), [topic])

  useEffect(() => {
    setOrder(shuffle(items.map((item) => item.id)))
    setPosition(0)
    setTranslation(false)
    setRevealed(false)
  }, [items])

  const currentId = order[position % Math.max(order.length, 1)]
  const current = items.find((item) => item.id === currentId) ?? items[0]

  const next = (rating?: 'hard' | 'good' | 'easy') => {
    if (!current) return
    if (rating) rateExam(current.id, rating)
    setPosition((value) => (value + 1) % order.length)
    setTranslation(false)
    setRevealed(false)
  }

  if (!current) return <main className="screen"><div className="empty-state">В этой теме пока нет вопросов.</div></main>

  const previousRating = progress.examRatings[current.id]

  return (
    <main className="screen trainer-screen exam-screen">
      <section className="screen-heading">
        <div>
          <p className="kicker">Устная симуляция</p>
          <h1>Экзамен</h1>
        </div>
        <div className="counter-pill">{position + 1} / {order.length}</div>
      </section>

      <TopicFilter value={topic} onChange={setTopic} />

      <article className="exam-card">
        <div className="exam-card-top">
          <span className="question-badge"><MessageCircleQuestion size={16} /> Вопрос экзаменатора</span>
          {previousRating && <span className={`past-rating ${previousRating}`}>уже отвечали</span>}
        </div>
        <h2 lang="lb">{current.questionLux}</h2>
        {translation && <p className="question-translation">{current.questionRu}</p>}
        <div className="question-actions">
          <AudioButton text={current.questionLux} label="Слушать вопрос" />
          <button type="button" className="text-button" onClick={() => setTranslation((value) => !value)}>
            {translation ? <EyeOff size={17} /> : <Eye size={17} />} {translation ? 'Скрыть перевод' : 'Показать перевод'}
          </button>
        </div>
      </article>

      <VoiceRecorder />

      {!revealed ? (
        <div className="exam-before-answer">
          <p>Ответьте вслух. Затем сравните свою формулировку с образцом.</p>
          <button type="button" className="primary-button wide" onClick={() => setRevealed(true)}>
            <Sparkles size={18} /> Показать пример ответа
          </button>
          <button type="button" className="text-button centered" onClick={() => next()}>Пропустить <ArrowRight size={17} /></button>
        </div>
      ) : (
        <section className="sample-answer">
          <p className="prompt-label">Пример ответа</p>
          <h3 lang="lb">{current.answerLux}</h3>
          <p>{current.answerRu}</p>
          <AudioButton text={current.answerLux} label="Слушать ответ" />
          <div className="self-rating">
            <p>Как Вы ответили?</p>
            <div>
              <button type="button" onClick={() => next('hard')}>Было сложно</button>
              <button type="button" onClick={() => next('good')}>Нормально</button>
              <button type="button" onClick={() => next('easy')}>Уверенно</button>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

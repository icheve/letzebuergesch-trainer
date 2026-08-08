import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Clock3, Home, Languages, MapPin, MessageSquareText } from 'lucide-react'
import { analogueSentences, topics } from '../data/topics'
import type { ProgressState, Topic } from '../types'

const icons = { home: Home, languages: Languages, housing: MapPin }
const sources: Record<string, string> = {
  homeland: 'okHEEMECHTSLAND.pdf',
  languages: 'Sproochen.pdf',
  housing: 'Wunnuert (2).pdf',
}

function TopicCard({ topic, progress, expanded, onToggle }: {
  topic: Topic
  progress: ProgressState
  expanded: boolean
  onToggle: () => void
}) {
  const Icon = icons[topic.icon]
  const trained = topic.sentences.filter((item) => progress.sentenceAttempts[item.id] || progress.examRatings[item.id]).length
  const words = topic.vocabulary.filter((item) => progress.reviews[item.id]?.repetitions).length
  const percent = Math.round((trained + words) / (topic.sentences.length + topic.vocabulary.length) * 100)

  return (
    <article className={`topic-card topic-${topic.color} ${expanded ? 'expanded' : ''}`}>
      <button type="button" className="topic-card-main" onClick={onToggle} aria-expanded={expanded}>
        <span className="topic-card-icon"><Icon size={24} /></span>
        <span className="topic-card-copy">
          <small>{topic.eyebrow}</small>
          <strong>{topic.titleRu}</strong>
          <span>{topic.titleLux}</span>
        </span>
        <span className="topic-percent"><strong>{percent}%</strong>{expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
      </button>
      <div className="topic-meter"><span style={{ width: `${percent}%` }} /></div>
      {expanded && (
        <div className="topic-details">
          <div className="topic-stats">
            <span><BookOpen size={18} /><strong>{topic.vocabulary.length}</strong><small>лексем</small></span>
            <span><MessageSquareText size={18} /><strong>{topic.sentences.length}</strong><small>ответов</small></span>
            <span><Clock3 size={18} /><strong>{topic.sentences.filter((item) => item.section === 'past').length}</strong><small>в прошлом</small></span>
          </div>
          <div className="topic-section-list">
            <div><span>Основные вопросы</span><strong>{topic.sentences.filter((item) => item.section === 'main').length}</strong></div>
            <div><span>Прошедшее время</span><strong>{topic.sentences.filter((item) => item.section === 'past').length}</strong></div>
            <div><span>Уточнения экзаменатора</span><strong>{topic.sentences.filter((item) => item.section === 'followup').length}</strong></div>
          </div>
          <p className="source-note">Источник: <span>{sources[topic.id]}</span></p>
        </div>
      )}
    </article>
  )
}

export function TopicsPage({ progress }: { progress: ProgressState }) {
  const [expanded, setExpanded] = useState('homeland')
  const totalSentences = topics.reduce((sum, topic) => sum + topic.sentences.length, 0)
  const totalWords = topics.reduce((sum, topic) => sum + topic.vocabulary.length, 0)

  return (
    <main className="screen topics-screen">
      <section className="screen-heading">
        <div><p className="kicker">База из Ваших PDF</p><h1>Темы</h1></div>
        <div className="counter-pill">{topics.length} темы</div>
      </section>
      <p className="topics-intro">В приложении уже <strong>{totalSentences} персональных ответа</strong>, <strong>{totalWords} слов</strong> и <strong>{analogueSentences.length} дополнительных фраз</strong>. Новые PDF можно добавлять в папку проекта.</p>
      <div className="topics-list">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            progress={progress}
            expanded={expanded === topic.id}
            onToggle={() => setExpanded((value) => value === topic.id ? '' : topic.id)}
          />
        ))}
      </div>
      <aside className="content-note">
        <BookOpen size={21} />
        <div><strong>Персональные формулировки</strong><p>Упражнения основаны на Ваших готовых ответах. Дополнительные аналоги будут добавляться отдельно и не заменят проверенный материал.</p></div>
      </aside>
    </main>
  )
}

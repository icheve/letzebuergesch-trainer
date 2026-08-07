import { topics } from '../data/topics'

export function TopicFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="topic-filter" role="group" aria-label="Выбор темы">
      <button type="button" className={value === 'all' ? 'active' : ''} onClick={() => onChange('all')}>
        Все
      </button>
      {topics.map((topic) => (
        <button
          type="button"
          key={topic.id}
          className={value === topic.id ? 'active' : ''}
          onClick={() => onChange(topic.id)}
        >
          {topic.titleRu}
        </button>
      ))}
    </div>
  )
}

import { topics } from '../data/topics'

interface TopicOption {
  id: string
  titleRu: string
}

export function TopicFilter({
  value,
  onChange,
  options = topics,
}: {
  value: string
  onChange: (value: string) => void
  options?: TopicOption[]
}) {
  return (
    <div className="topic-filter" role="group" aria-label="Выбор темы">
      <button type="button" className={value === 'all' ? 'active' : ''} onClick={() => onChange('all')}>
        Все
      </button>
      {options.map((topic) => (
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

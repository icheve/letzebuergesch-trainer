import { BookOpenText, GraduationCap, House, Layers3, MessagesSquare } from 'lucide-react'

export type Tab = 'home' | 'words' | 'sentences' | 'exam' | 'topics'

const items: { id: Tab; label: string; icon: typeof House }[] = [
  { id: 'home', label: 'Сегодня', icon: House },
  { id: 'words', label: 'Слова', icon: Layers3 },
  { id: 'sentences', label: 'Фразы', icon: BookOpenText },
  { id: 'exam', label: 'Экзамен', icon: MessagesSquare },
  { id: 'topics', label: 'Темы', icon: GraduationCap },
]

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      {items.map(({ id, label, icon: Icon }) => (
        <button
          type="button"
          key={id}
          className={active === id ? 'active' : ''}
          onClick={() => onChange(id)}
          aria-current={active === id ? 'page' : undefined}
        >
          <Icon size={21} strokeWidth={active === id ? 2.4 : 1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}

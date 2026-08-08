import { ArrowRight, BookOpenText, CalendarDays, Check, Flame, GraduationCap, Layers3, Smartphone, Sparkles } from 'lucide-react'
import { grammarLessons } from '../data/grammarLessons'
import { allSentences, allVocabulary, topics } from '../data/topics'
import type { DailyActivity, ProgressState } from '../types'
import type { Tab } from './BottomNav'

const EXAM_DATE = new Date(2026, 9, 28, 9, 0, 0)

function daysToExam() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(EXAM_DATE)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86_400_000))
}

function dateKey(date: Date) {
  return date.toLocaleDateString('sv-SE')
}

function calculateStreak(activity: DailyActivity[]) {
  const active = new Set(activity.filter((day) => day.words + day.sentences + day.exam + day.grammar > 0).map((day) => day.date))
  const cursor = new Date()
  if (!active.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (active.has(dateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function GoalRow({ icon: Icon, label, current, target, onClick }: {
  icon: typeof Layers3
  label: string
  current: number
  target: number
  onClick: () => void
}) {
  const complete = current >= target
  return (
    <button type="button" className={`goal-row ${complete ? 'complete' : ''}`} onClick={onClick}>
      <span className="goal-icon">{complete ? <Check size={20} /> : <Icon size={20} />}</span>
      <span className="goal-copy"><strong>{label}</strong><small>{Math.min(current, target)} из {target}</small></span>
      <span className="goal-track"><i style={{ width: `${Math.min(100, current / target * 100)}%` }} /></span>
      <ArrowRight size={18} />
    </button>
  )
}

export function Dashboard({
  progress,
  today,
  onNavigate,
  canInstall,
  installed,
  onInstall,
}: {
  progress: ProgressState
  today: DailyActivity
  onNavigate: (tab: Tab) => void
  canInstall: boolean
  installed: boolean
  onInstall: () => void
}) {
  const learnedWords = allVocabulary.filter((card) => (progress.reviews[card.id]?.repetitions ?? 0) > 0).length
  const learnedSentences = allSentences.filter((item) => (progress.sentenceAttempts[item.id]?.correct ?? 0) > 0).length
  const confidentAnswers = Object.values(progress.examRatings).filter((rating) => rating === 'good' || rating === 'easy').length
  const masteredGrammar = grammarLessons.filter((lesson) => (progress.grammarLessons[lesson.id]?.bestScore ?? 0) >= 4).length
  const learnedTotal = learnedWords + learnedSentences + confidentAnswers + masteredGrammar * 5
  const contentTotal = allVocabulary.length + allSentences.length * 2 + grammarLessons.length * 5
  const readiness = Math.round(learnedTotal / contentTotal * 100)
  const streak = calculateStreak(progress.activity)
  const days = daysToExam()
  const doneToday = Math.min(today.words, 10) + Math.min(today.sentences, 5) + Math.min(today.grammar, 1)

  return (
    <main className="screen dashboard">
      <header className="home-header">
        <div className="brand-mark"><span>L</span></div>
        <div className="brand-copy"><strong>Lëtzebuergesch</strong><small>Äert Zil · 28. Oktober</small></div>
        <div className="streak-badge"><Flame size={17} fill="currentColor" /><strong>{streak}</strong></div>
      </header>

      <section className="countdown-card">
        <div className="countdown-content">
          <p><CalendarDays size={16} /> До экзамена</p>
          <div className="day-count"><strong>{days}</strong><span>{days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}</span></div>
          <p className="countdown-note">28 октября 2026</p>
        </div>
        <div className="readiness-ring" style={{ '--progress': `${readiness * 3.6}deg` } as React.CSSProperties}>
          <div><strong>{readiness}%</strong><span>готовность</span></div>
        </div>
        <div className="lux-stripe" aria-hidden="true"><i /><i /><i /></div>
      </section>

      <section className="daily-section">
        <div className="section-title">
          <div><p className="kicker">Ваш ритм на сегодня</p><h2>Ежедневная тренировка</h2></div>
          <span>{doneToday}/16</span>
        </div>
        <div className="goal-list">
          <GoalRow icon={Layers3} label="Тренировать лексику" current={today.words} target={10} onClick={() => onNavigate('words')} />
          <GoalRow icon={BookOpenText} label="Собрать фразы" current={today.sentences} target={5} onClick={() => onNavigate('sentences')} />
          <GoalRow icon={GraduationCap} label="Пройти урок грамматики" current={today.grammar} target={1} onClick={() => onNavigate('grammar')} />
        </div>
      </section>

      <section className="topics-preview">
        <div className="section-title compact">
          <div><p className="kicker">Материалы экзамена</p><h2>Ваши темы</h2></div>
          <button type="button" className="link-button" onClick={() => onNavigate('topics')}>Все темы <ArrowRight size={16} /></button>
        </div>
        <div className="topic-preview-grid">
          {topics.map((topic) => {
            const trained = topic.sentences.filter((item) => progress.sentenceAttempts[item.id] || progress.examRatings[item.id]).length
            return (
              <button type="button" className={`topic-preview topic-${topic.color}`} key={topic.id} onClick={() => onNavigate('topics')}>
                <span>{topic.titleLux}</span>
                <strong>{topic.titleRu}</strong>
                <small>{trained} из {topic.sentences.length} фраз</small>
              </button>
            )
          })}
        </div>
      </section>

      {!installed && (
        <section className="install-card">
          <span className="install-icon"><Smartphone size={23} /></span>
          <div><strong>Установите на телефон</strong><p>Прогресс и темы будут доступны как в обычном приложении.</p></div>
          {canInstall ? (
            <button type="button" onClick={onInstall}>Установить</button>
          ) : (
            <span className="install-hint"><Sparkles size={15} /> Меню браузера → «На экран Домой»</span>
          )}
        </section>
      )}
    </main>
  )
}

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'
import { BottomNav, type Tab } from './components/BottomNav'
import { Dashboard } from './components/Dashboard'
import { ExamTrainer } from './components/ExamTrainer'
import { SentenceTrainer } from './components/SentenceTrainer'
import { TopicsPage } from './components/TopicsPage'
import { WordTrainer } from './components/WordTrainer'
import { useInstallPrompt } from './hooks/useInstallPrompt'
import { useProgress } from './hooks/useProgress'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [online, setOnline] = useState(navigator.onLine)
  const {
    progress,
    today,
    reviewCard,
    recordSentence,
    saveSentenceDeck,
    selectSentenceTopic,
    rateExam,
  } = useProgress()
  const { canInstall, installed, install } = useInstallPrompt()

  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tab])

  return (
    <div className="app-shell">
      {!online && <div className="offline-banner"><WifiOff size={15} /> Офлайн-режим · прогресс сохраняется</div>}
      {tab === 'home' && (
        <Dashboard
          progress={progress}
          today={today}
          onNavigate={setTab}
          canInstall={canInstall}
          installed={installed}
          onInstall={() => { void install() }}
        />
      )}
      {tab === 'words' && <WordTrainer progress={progress} reviewCard={reviewCard} />}
      {tab === 'sentences' && (
        <SentenceTrainer
          progress={progress}
          recordSentence={recordSentence}
          saveSentenceDeck={saveSentenceDeck}
          selectTopic={selectSentenceTopic}
        />
      )}
      {tab === 'exam' && <ExamTrainer progress={progress} rateExam={rateExam} />}
      {tab === 'topics' && <TopicsPage progress={progress} />}
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

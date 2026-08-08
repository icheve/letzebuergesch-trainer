import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, Lightbulb, RotateCcw, X } from 'lucide-react'
import { allSentences } from '../data/topics'
import type { ProgressState, SentenceDeck } from '../types'
import { advanceSentenceDeck, reconcileSentenceDeck } from '../utils/sentenceDeck'
import { normalizeAnswer, shuffle, splitIntoTiles } from '../utils/text'
import { AudioButton } from './AudioButton'
import { TopicFilter } from './TopicFilter'

type Tile = { id: number; text: string }

export function SentenceTrainer({
  progress,
  recordSentence,
  saveSentenceDeck,
  selectTopic,
}: {
  progress: ProgressState
  recordSentence: (id: string, correct: boolean) => void
  saveSentenceDeck: (key: string, deck: SentenceDeck) => void
  selectTopic: (topic: string) => void
}) {
  const [available, setAvailable] = useState<Tile[]>([])
  const [selected, setSelected] = useState<Tile[]>([])
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [hintCount, setHintCount] = useState(0)

  const topic = progress.sentenceTopic
  const items = useMemo(() => allSentences.filter((item) => topic === 'all' || item.topicId === topic), [topic])
  const itemIds = useMemo(() => items.map((item) => item.id), [items])
  const savedDeck = progress.sentenceDecks[topic]
  const initiallyCompleted = useMemo(() => itemIds.filter((id) => (progress.sentenceAttempts[id]?.correct ?? 0) > 0), [itemIds, progress.sentenceAttempts])
  const deck = useMemo(
    () => reconcileSentenceDeck(savedDeck, itemIds, initiallyCompleted),
    [initiallyCompleted, itemIds, savedDeck],
  )
  const currentId = deck.order[deck.cursor]
  const current = items.find((item) => item.id === currentId) ?? items[0]

  useEffect(() => {
    if (deck !== savedDeck) saveSentenceDeck(topic, deck)
  }, [deck, saveSentenceDeck, savedDeck, topic])

  const prepare = (sentenceText: string) => {
    const tiles = splitIntoTiles(sentenceText).map((text, id) => ({ id, text }))
    setAvailable(shuffle(tiles))
    setSelected([])
    setStatus('idle')
    setHintCount(0)
  }

  useEffect(() => {
    if (current) prepare(current.answerLux)
  // current.id is the intentional exercise boundary.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, topic])

  const choose = (tile: Tile) => {
    if (status === 'correct') return
    setAvailable((tiles) => tiles.filter((item) => item.id !== tile.id))
    setSelected((tiles) => [...tiles, tile])
    setStatus('idle')
  }

  const remove = (tile: Tile) => {
    if (status === 'correct') return
    setSelected((tiles) => tiles.filter((item) => item.id !== tile.id))
    setAvailable((tiles) => [...tiles, tile])
    setStatus('idle')
  }

  const check = () => {
    if (!current || selected.length === 0) return
    const correct = normalizeAnswer(selected.map((tile) => tile.text).join(' ')) === normalizeAnswer(current.answerLux)
    setStatus(correct ? 'correct' : 'wrong')
    recordSentence(current.id, correct)
  }

  const next = () => {
    saveSentenceDeck(topic, advanceSentenceDeck(deck, itemIds))
  }

  const showHint = () => {
    if (!current) return
    const correctTiles = splitIntoTiles(current.answerLux)
    const nextText = correctTiles[selected.length]
    const tile = available.find((item) => item.text === nextText)
    if (tile) choose(tile)
    setHintCount((value) => value + 1)
  }

  if (!current) return <main className="screen"><div className="empty-state">В этой теме пока нет предложений.</div></main>

  const attempts = progress.sentenceAttempts[current.id]

  return (
    <main className="screen trainer-screen sentence-screen">
      <section className="screen-heading">
        <div>
          <p className="kicker">Соберите правильный порядок</p>
          <h1>Фразы</h1>
        </div>
        <div className="counter-pill">{deck.cursor + 1} / {items.length} · круг {deck.cycle}</div>
      </section>

      <TopicFilter value={topic} onChange={selectTopic} />

      <article className="prompt-card">
        <div className="prompt-meta">
          <span>{current.kind === 'analogue' ? 'Дополнительная практика' : current.topicTitle}</span>
          <span>{attempts ? `${attempts.correct}/${attempts.total} верно` : current.kind === 'analogue' ? 'аналог' : 'новая фраза'}</span>
        </div>
        <p className="prompt-label">Скажите по-люксембуржски</p>
        <h2>{current.answerRu}</h2>
      </article>

      <section className={`sentence-workspace status-${status}`}>
        <div className="sentence-answer" aria-label="Собранное предложение">
          {selected.length === 0 && <span className="placeholder">Нажимайте на слова в нужном порядке…</span>}
          {selected.map((tile) => (
            <button type="button" key={tile.id} onClick={() => remove(tile)}>{tile.text}</button>
          ))}
        </div>
        {status === 'correct' && <div className="feedback success"><Check size={19} /> Отлично! Предложение собрано верно.</div>}
        {status === 'wrong' && <div className="feedback error"><X size={19} /> Порядок пока неверный. Попробуйте ещё раз.</div>}
      </section>

      <div className="tile-bank" aria-label="Доступные слова">
        {available.map((tile) => (
          <button type="button" key={tile.id} onClick={() => choose(tile)}>{tile.text}</button>
        ))}
      </div>

      {status === 'correct' ? (
        <div className="correct-actions">
          <AudioButton text={current.answerLux} label="Синтез фразы" />
          <button type="button" className="primary-button" onClick={next}>Следующая <ArrowRight size={18} /></button>
        </div>
      ) : (
        <div className="builder-actions">
          <button type="button" className="text-button" onClick={() => prepare(current.answerLux)}><RotateCcw size={17} /> Сбросить</button>
          <button type="button" className="text-button" onClick={showHint}><Lightbulb size={17} /> Подсказка{hintCount ? ` · ${hintCount}` : ''}</button>
          <button type="button" className="primary-button" disabled={!selected.length} onClick={check}>Проверить</button>
        </div>
      )}
    </main>
  )
}

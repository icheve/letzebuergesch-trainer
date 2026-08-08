import type { SentenceDeck } from '../types'
import { shuffle } from './text'

type Random = () => number

function unique(ids: string[]) {
  return [...new Set(ids)]
}

function shuffledCycle(ids: string[], previousId: string | undefined, random: Random) {
  const order = shuffle(ids, random)
  if (order.length > 1 && order[0] === previousId) {
    ;[order[0], order[1]] = [order[1], order[0]]
  }
  return order
}

export function reconcileSentenceDeck(
  deck: SentenceDeck | undefined,
  availableIds: string[],
  initiallyCompletedIds: string[] = [],
  random: Random = Math.random,
): SentenceDeck {
  const ids = unique(availableIds)
  if (ids.length === 0) return { order: [], cursor: 0, cycle: 1 }

  if (!deck || !Array.isArray(deck.order)) {
    const available = new Set(ids)
    const completed = unique(initiallyCompletedIds).filter((id) => available.has(id))
    const completedSet = new Set(completed)
    const remaining = ids.filter((id) => !completedSet.has(id))

    if (remaining.length === 0) {
      return { order: shuffledCycle(ids, undefined, random), cursor: 0, cycle: 2 }
    }

    return {
      order: [...shuffle(completed, random), ...shuffle(remaining, random)],
      cursor: completed.length,
      cycle: 1,
    }
  }

  const cycle = Number.isInteger(deck.cycle) && deck.cycle > 0 ? deck.cycle : 1
  const safeCursor = Number.isInteger(deck.cursor) ? Math.max(0, deck.cursor) : 0
  const allowed = new Set(ids)
  const seen: string[] = []
  const remaining: string[] = []
  const included = new Set<string>()

  deck.order.forEach((id, index) => {
    if (!allowed.has(id) || included.has(id)) return
    included.add(id)
    if (index < safeCursor) seen.push(id)
    else remaining.push(id)
  })

  const added = ids.filter((id) => !included.has(id))
  const isUnchanged = added.length === 0
    && seen.length + remaining.length === ids.length
    && deck.order.length === ids.length
    && safeCursor === seen.length
    && deck.cursor < deck.order.length
    && cycle === deck.cycle

  if (isUnchanged) return deck

  const nextRemaining = shuffle([...remaining, ...added], random)
  if (nextRemaining.length === 0) {
    return {
      order: shuffledCycle(ids, seen.at(-1), random),
      cursor: 0,
      cycle: cycle + 1,
    }
  }

  return {
    order: [...seen, ...nextRemaining],
    cursor: seen.length,
    cycle,
  }
}

export function advanceSentenceDeck(
  deck: SentenceDeck,
  availableIds: string[],
  random: Random = Math.random,
): SentenceDeck {
  const current = reconcileSentenceDeck(deck, availableIds, [], random)
  if (current.order.length === 0) return current

  if (current.cursor + 1 < current.order.length) {
    return { ...current, cursor: current.cursor + 1 }
  }

  return {
    order: shuffledCycle(unique(availableIds), current.order[current.cursor], random),
    cursor: 0,
    cycle: current.cycle + 1,
  }
}

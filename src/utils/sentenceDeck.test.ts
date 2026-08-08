import { describe, expect, it } from 'vitest'
import { advanceSentenceDeck, reconcileSentenceDeck } from './sentenceDeck'

const ids = ['a', 'b', 'c', 'd']
const fixedRandom = () => 0.25

describe('sentence deck', () => {
  it('starts with a shuffled cycle and keeps it unchanged when reopened', () => {
    const deck = reconcileSentenceDeck(undefined, ids, [], fixedRandom)
    expect(deck.order).toHaveLength(ids.length)
    expect(new Set(deck.order)).toEqual(new Set(ids))
    expect(deck.cursor).toBe(0)
    expect(deck.cycle).toBe(1)
    expect(reconcileSentenceDeck(deck, ids, [], fixedRandom)).toBe(deck)
  })

  it('does not repeat a phrase before the cycle is complete', () => {
    let deck = reconcileSentenceDeck(undefined, ids, [], fixedRandom)
    const shown: string[] = []

    for (let index = 0; index < ids.length; index += 1) {
      shown.push(deck.order[deck.cursor])
      deck = advanceSentenceDeck(deck, ids, fixedRandom)
    }

    expect(new Set(shown).size).toBe(ids.length)
    expect(deck.cursor).toBe(0)
    expect(deck.cycle).toBe(2)
    expect(deck.order[0]).not.toBe(shown.at(-1))
  })

  it('uses previously correct phrases as completed in the first cycle', () => {
    const deck = reconcileSentenceDeck(undefined, ids, ['a', 'c'], fixedRandom)
    expect(new Set(deck.order.slice(0, deck.cursor))).toEqual(new Set(['a', 'c']))
    expect(new Set(deck.order.slice(deck.cursor))).toEqual(new Set(['b', 'd']))
    expect(deck.cursor).toBe(2)
  })

  it('adds new content to the remaining part without replaying completed phrases', () => {
    const existing = { order: ['a', 'b', 'c'], cursor: 1, cycle: 1 }
    const deck = reconcileSentenceDeck(existing, ['a', 'b', 'c', 'd'], [], fixedRandom)
    expect(deck.order[0]).toBe('a')
    expect(deck.cursor).toBe(1)
    expect(new Set(deck.order.slice(deck.cursor))).toEqual(new Set(['b', 'c', 'd']))
  })
})

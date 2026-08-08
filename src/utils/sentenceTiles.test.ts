import { describe, expect, it } from 'vitest'
import { applySentenceHint, firstIncorrectPosition, type SentenceTile } from './sentenceTiles'

const tiles: SentenceTile[] = [
  { id: 0, text: 'Ech' },
  { id: 1, text: 'léieren' },
  { id: 2, text: 'Lëtzebuergesch.' },
]

describe('sentence tile hints', () => {
  it('finds the first tile placed in the wrong position', () => {
    expect(firstIncorrectPosition([tiles[0], tiles[2], tiles[1]])).toBe(1)
  })

  it('repairs the correct prefix when every tile is already selected', () => {
    const result = applySentenceHint([tiles[0], tiles[2], tiles[1]], [], () => 0)
    expect(result.selected.map((tile) => tile.id)).toEqual([0, 1])
    expect(result.available.map((tile) => tile.id)).toEqual([2])
    expect(result.correctedPosition).toBe(1)
  })

  it('adds the next correct tile to an incomplete correct prefix', () => {
    const result = applySentenceHint([tiles[0]], [tiles[2], tiles[1]], () => 0)
    expect(result.selected.map((tile) => tile.id)).toEqual([0, 1])
    expect(result.available.map((tile) => tile.id)).toEqual([2])
  })
})

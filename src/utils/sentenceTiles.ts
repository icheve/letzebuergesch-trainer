import { shuffle } from './text'

export interface SentenceTile {
  id: number
  text: string
}

export function firstIncorrectPosition(selected: SentenceTile[]) {
  return selected.findIndex((tile, position) => tile.id !== position)
}

export function applySentenceHint(
  selected: SentenceTile[],
  available: SentenceTile[],
  random = Math.random,
) {
  const allTiles = [...selected, ...available]
  const firstWrong = firstIncorrectPosition(selected)
  const targetPosition = firstWrong >= 0 ? firstWrong : selected.length

  if (targetPosition >= allTiles.length) {
    return { selected, available, correctedPosition: -1 }
  }

  return {
    selected: allTiles
      .filter((tile) => tile.id <= targetPosition)
      .sort((left, right) => left.id - right.id),
    available: shuffle(allTiles.filter((tile) => tile.id > targetPosition), random),
    correctedPosition: targetPosition,
  }
}

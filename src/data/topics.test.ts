import { describe, expect, it } from 'vitest'
import { allSentences, allVocabulary, analogueSentences, topics, verifiedSentences } from './topics'

describe('learning content', () => {
  it('contains the complete initial PDF corpus', () => {
    expect(topics).toHaveLength(3)
    expect(verifiedSentences).toHaveLength(73)
    expect(allVocabulary).toHaveLength(39)
  })

  it('keeps analogues separate from verified answers', () => {
    expect(analogueSentences).toHaveLength(18)
    expect(allSentences).toHaveLength(91)
    expect(verifiedSentences.every((item) => item.kind === 'verified')).toBe(true)
    expect(analogueSentences.every((item) => item.kind === 'analogue')).toBe(true)
  })

  it('uses unique IDs and complete Russian translations', () => {
    const ids = [...allVocabulary, ...allSentences].map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(allVocabulary.every((item) => item.russian.trim().length > 0)).toBe(true)
    expect(allSentences.every((item) => item.answerRu.trim().length > 0 && item.questionRu.trim().length > 0)).toBe(true)
  })

  it('connects every vocabulary card to an official LOD recording', () => {
    expect(allVocabulary.every((item) => /^https:\/\/lod\.lu\/uploads\/AAC\/[a-z0-9]+\.m4a$/.test(item.lodAudioUrl))).toBe(true)
    expect(allVocabulary.every((item) => item.lodId.length > 0)).toBe(true)
  })

  it('provides a usable personal context for every vocabulary card', () => {
    expect(allVocabulary.every((item) => item.sentenceLux.includes(item.answer))).toBe(true)
    expect(allVocabulary.every((item) => item.sentenceRu.trim().length > 0)).toBe(true)
  })
})

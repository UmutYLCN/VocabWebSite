import { describe, it, expect } from 'vitest'
import { useAppStore } from '../store/useAppStore'

describe('store basics', () => {
  it('can add deck and vocab and schedule review', () => {
    const { addDeck, addVocab, getDueVocabs, reviewAnswer } = useAppStore.getState()
    const d = addDeck('Test')
    const v = addVocab(d.id, 'hello', 'merhaba')
    const now = new Date()
    let due = getDueVocabs(now)
    expect(due.find(x => x.id === v.id)).toBeTruthy()
    reviewAnswer(v.id, 5, now)
    due = getDueVocabs(now)
    expect(due.find(x => x.id === v.id)).toBeFalsy()
  })
})

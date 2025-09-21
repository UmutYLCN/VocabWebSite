import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Deck, Vocab } from '../types/models'
import { newId } from '../lib/id'
import { initReviewState, reviewWithSm2 } from '../lib/sm2'

type AppState = {
  decks: Record<string, Deck>
  vocabs: Record<string, Vocab>
}

type AppActions = {
  addDeck: (name: string, description?: string) => Deck
  addVocab: (deckId: string, front: string, back: string) => Vocab
  getDecks: () => Deck[]
  getDeck: (id: string) => Deck | undefined
  getVocabsByDeck: (deckId: string) => Vocab[]
  getDueVocabs: (now?: Date) => Vocab[]
  reviewAnswer: (vocabId: string, quality: 0|1|2|3|4|5, now?: Date) => void
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      decks: {},
      vocabs: {},

      addDeck: (name, description) => {
        const id = newId()
        const deck: Deck = { id, name, description, createdAt: new Date().toISOString() }
        set(s => ({ decks: { ...s.decks, [id]: deck } }))
        return deck
      },

      addVocab: (deckId, front, back) => {
        const id = newId()
        const vocab: Vocab = {
          id,
          deckId,
          front,
          back,
          createdAt: new Date().toISOString(),
          review: initReviewState()
        }
        set(s => ({ vocabs: { ...s.vocabs, [id]: vocab } }))
        return vocab
      },

      getDecks: () => Object.values(get().decks).sort((a, b) => a.name.localeCompare(b.name)),
      getDeck: id => get().decks[id],
      getVocabsByDeck: deckId => Object.values(get().vocabs).filter(v => v.deckId === deckId),

      getDueVocabs: (now = new Date()) => {
        const vocabs = Object.values(get().vocabs)
        return vocabs
          .filter(v => new Date(v.review.dueAt).getTime() <= now.getTime())
          .sort((a, b) => new Date(a.review.dueAt).getTime() - new Date(b.review.dueAt).getTime())
      },

      reviewAnswer: (vocabId, quality, now = new Date()) => {
        set(s => {
          const v = s.vocabs[vocabId]
          if (!v) return {}
          const updated = { ...v, review: reviewWithSm2(v.review, quality, now) }
          return { vocabs: { ...s.vocabs, [vocabId]: updated } }
        })
      }
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

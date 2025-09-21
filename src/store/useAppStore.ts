import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Deck, Vocab, Gamification } from '../types/models'
import { newId } from '../lib/id'
import { initReviewState, reviewWithSm2 } from '../lib/sm2'

type AppState = {
  decks: Record<string, Deck>
  vocabs: Record<string, Vocab>
  stats: Gamification & { lastReviewDate?: string }
  preferences: {
    dailyGoal: number
    scope: 'all' | 'deck'
    deckId?: string
  }
}

type AppActions = {
  addDeck: (name: string, description?: string) => Deck
  updateDeck: (id: string, patch: Partial<Pick<Deck, 'name' | 'description'>>) => void
  addVocab: (deckId: string, front: string, back: string) => Vocab
  updateVocab: (id: string, patch: Partial<Pick<Vocab, 'front' | 'back' | 'deckId'>>) => void
  deleteDeck: (deckId: string) => void
  deleteVocab: (id: string) => void
  getDecks: () => Deck[]
  getDeck: (id: string) => Deck | undefined
  getVocabsByDeck: (deckId: string) => Vocab[]
  getDueVocabs: (now?: Date) => Vocab[]
  reviewAnswer: (vocabId: string, quality: 0|1|2|3|4|5, now?: Date) => void
  exportData: () => string
  importData: (json: string) => boolean
  resetAll: () => void
  setDailyGoal: (n: number) => void
  setScope: (s: 'all' | 'deck', deckId?: string) => void
  getTodayBatch: (limit?: number, deckId?: string) => Vocab[]
}

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      decks: {},
      vocabs: {},
      stats: { xp: 0, streak: 0, level: 1 },
      preferences: { dailyGoal: 10, scope: 'all' },

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

      updateDeck: (id, patch) => {
        set(s => ({ decks: { ...s.decks, [id]: { ...s.decks[id], ...patch } as Deck } }))
      },

      updateVocab: (id, patch) => {
        set(s => ({ vocabs: { ...s.vocabs, [id]: { ...s.vocabs[id], ...patch } as Vocab } }))
      },

      deleteDeck: (deckId: string) => {
        set(s => {
          const decks = { ...s.decks }
          delete decks[deckId]
          const vocabs = Object.fromEntries(Object.entries(s.vocabs).filter(([, v]) => v.deckId !== deckId))
          return { decks, vocabs }
        })
      },

      deleteVocab: (id: string) => {
        set(s => {
          const v = { ...s.vocabs }
          delete v[id]
          return { vocabs: v }
        })
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
          // Gamification update
          const dayStr = now.toISOString().slice(0, 10)
          const prevDay = s.stats.lastReviewDate
          let streak = s.stats.streak
          if (!prevDay) streak = 1
          else {
            const d1 = new Date(prevDay + 'T00:00:00Z')
            const d2 = new Date(dayStr + 'T00:00:00Z')
            const diff = Math.round((+d2 - +d1) / (1000 * 60 * 60 * 24))
            if (diff === 0) {
              // same day, keep streak
            } else if (diff === 1) {
              streak += 1
            } else if (diff > 1) {
              streak = 1
            }
          }
          const gained = quality >= 5 ? 5 : quality >= 4 ? 3 : quality >= 3 ? 1 : 0
          const xp = s.stats.xp + gained
          const level = Math.max(1, Math.floor(xp / 100) + 1)
          return {
            vocabs: { ...s.vocabs, [vocabId]: updated },
            stats: { xp, streak, level, lastReviewDate: dayStr }
          }
        })
      },

      exportData: () => {
        const { decks, vocabs, stats } = get()
        return JSON.stringify({ decks, vocabs, stats }, null, 2)
      },

      importData: (json: string) => {
        try {
          const obj = JSON.parse(json)
          if (!obj || typeof obj !== 'object') return false
          const decks = obj.decks ?? {}
          const vocabs = obj.vocabs ?? {}
          const stats = obj.stats ?? { xp: 0, streak: 0, level: 1 }
          set({ decks, vocabs, stats })
          return true
        } catch {
          return false
        }
      },

      resetAll: () => {
        set({ decks: {}, vocabs: {}, stats: { xp: 0, streak: 0, level: 1 }, preferences: { dailyGoal: 10, scope: 'all' } })
      },

      setDailyGoal: (n: number) => set(s => ({ preferences: { ...s.preferences, dailyGoal: Math.max(1, Math.min(200, Math.floor(n))) } })),
      setScope: (scope, deckId) => set(s => ({ preferences: { ...s.preferences, scope, deckId } })),

      getTodayBatch: (limit, deckId) => {
        const prefs = get().preferences
        const lim = Math.max(1, Math.min(200, limit ?? prefs.dailyGoal))
        const all = Object.values(get().vocabs)
        const filtered = deckId ? all.filter(v => v.deckId === deckId) : all
        const due = filtered
          .filter(v => new Date(v.review.dueAt).getTime() <= Date.now())
          .sort((a, b) => new Date(a.review.dueAt).getTime() - new Date(b.review.dueAt).getTime())
        if (due.length >= lim) return due.slice(0, lim)
        const need = lim - due.length
        const fresh = filtered
          .filter(v => (v.review.reps || 0) === 0)
          .slice(0, need)
        return [...due, ...fresh]
      }
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

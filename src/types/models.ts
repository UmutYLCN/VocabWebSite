// Models placeholders (fields are names only; types TBD)

export interface Vocab {
  id: string
  front: string
  back: string
  deckId?: string | null
  createdAt: string // ISO date
  review: ReviewState
}

export interface Deck {
  id: string
  name: string
  description?: string
  createdAt: string // ISO date
}

export interface Gamification {
  xp: number
  streak: number
  level: number
}

export interface ReviewState {
  /** Easiness factor, min 1.3 */
  ef: number
  /** Interval in days */
  interval: number
  /** Successful repetitions count */
  reps: number
  /** Next due time, ISO string */
  dueAt: string
}
